from dotenv import load_dotenv

from livekit import agents
from livekit.agents import AgentSession, Agent, RoomInputOptions
from livekit.plugins import noise_cancellation, silero, cartesia, openai
from livekit.plugins.turn_detector.multilingual import MultilingualModel
from datetime import datetime, timedelta
import asyncio

# Import LangGraph components for tool workflow
import operator
from typing import Annotated, TypedDict, cast
from langchain_core.messages import AnyMessage, HumanMessage, SystemMessage, ToolMessage, AIMessage
from langchain_google_genai import ChatGoogleGenerativeAI
from langgraph.checkpoint.memory import MemorySaver
from langgraph.graph import END, StateGraph
from tools.flights_finder import flights_finder, FlightsInput
from tools.hotels_finder import hotels_finder, HotelsInput
from pydantic import BaseModel

load_dotenv(".env.local")


# Define state for LangGraph
class AgentState(TypedDict):
    messages: Annotated[list[AnyMessage], operator.add]


# Define tools and system prompts
TOOLS = [flights_finder, hotels_finder]

TOOLS_SYSTEM_PROMPT = """You are a professional Travel Assistant AI. Your role is to help users plan their trips, provide travel recommendations, and assist with travel-related inquiries.

Your conversation should follow this professional workflow:

1. WELCOME & INTRODUCTION
   - Greet the user warmly: "Hello! I'm your Travel Assistant. How can I help you with your travel plans today?"
   - Establish expertise: "I can help you plan trips, find destinations, book accommodations, and provide travel tips."

2. REQUIREMENTS GATHERING (Ask clarifying questions to understand their needs)
   - Primary purpose of travel (business, leisure, family vacation, etc.)
   - Destination preferences (specific places or types of locations)
   - Travel dates and flexibility
   - Budget range
   - Group composition (solo, couple, family, friends, business colleagues)
   - Special requirements (accessibility, dietary restrictions, etc.)
   - Previous travel experiences and preferences

3. TRAVEL PLANNING & RECOMMENDATIONS
   - Based on their requirements, provide personalized recommendations
   - Offer destination options with pros/cons if they're unsure
   - Suggest optimal travel dates considering weather, events, and pricing
   - Provide accommodation options at different price points
   - Recommend transportation options (flights, trains, car rentals)
   - Create a day-by-day itinerary if requested

4. DETAILED TRAVEL GUIDANCE
   - Local attractions and activities for their destination(s)
   - Dining recommendations based on cuisine preferences
   - Cultural tips and etiquette guidance
   - Visa and documentation requirements
   - Weather information and packing suggestions
   - Safety information and local emergency contacts

5. BOOKING ASSISTANCE
   - Help compare flight options and prices using the flights_finder tool when specific airports and dates are provided
   - Suggest accommodation options using the hotels_finder tool when specific locations and dates are provided
   - Recommend travel insurance options
   - Provide links to trusted booking platforms

6. FINALIZATION & FOLLOW-UP
   - Confirm all travel details are organized
   - Provide a summary document of the travel plan
   - Offer tips for before departure
   - Suggest how to reach you for any last-minute questions

SPECIALIZED TRAVEL SCENARIOS - Adapt your approach based on the type of travel:

FAMILY VACATIONS:
- Focus on child-friendly activities and accommodations
- Consider travel time and rest periods
- Suggest family-friendly dining options
- Recommend safety measures for children

ROMANTIC GETAWAYS:
- Emphasize intimate experiences and couple activities
- Suggest luxury accommodations and fine dining
- Recommend scenic spots for photos and memories

ADVENTURE TRAVEL:
- Focus on outdoor activities and unique experiences
- Suggest appropriate gear and preparation
- Provide safety information for activities

BUSINESS TRIPS:
- Prioritize convenience and efficiency
- Suggest business-friendly accommodations
- Recommend local business services and facilities

SOLO TRAVEL:
- Emphasize safety and social opportunities
- Suggest group activities and tours
- Recommend reliable communication options

Keep responses informative yet concise. Be enthusiastic about travel and provide accurate, up-to-date information. Always confirm understanding of their needs before providing recommendations. Adapt your tone to be professional yet friendly, like an experienced travel consultant."""

EMAILS_SYSTEM_PROMPT = """Format the travel information as a clear response for the user. Include all relevant details from the tool calls in an organized, easy-to-read format."""


class TravelAgent:
    def __init__(self):
        # Use the tool name attribute for consistent access
        self._tools = {t.name: t for t in TOOLS}
        # Get Google API key from environment variables
        import os
        api_key = os.getenv('GOOGLE_API_KEY')
        if not api_key:
            raise ValueError('GOOGLE_API_KEY environment variable is not set')
        self._tools_llm = ChatGoogleGenerativeAI(model='gemini-1.5-flash', google_api_key=api_key).bind_tools(TOOLS)

        builder = StateGraph(AgentState)
        builder.add_node('call_tools_llm', self.call_tools_llm)
        builder.add_node('invoke_tools', self.invoke_tools)
        builder.add_node('format_response', self.format_response)
        builder.set_entry_point('call_tools_llm')

        builder.add_conditional_edges('call_tools_llm', self.exists_action, {'more_tools': 'invoke_tools', 'format_response': 'format_response'})
        builder.add_edge('invoke_tools', 'call_tools_llm')
        builder.add_edge('format_response', END)
        memory = MemorySaver()
        self.graph = builder.compile(checkpointer=memory)

    @staticmethod
    def exists_action(state: AgentState):
        result = state['messages'][-1]
        # Only check for tool_calls if the message is an AIMessage
        if isinstance(result, AIMessage) and hasattr(result, 'tool_calls'):
            tool_calls = result.tool_calls
            if len(tool_calls) == 0:
                return 'format_response'
            return 'more_tools'
        return 'format_response'

    def format_response(self, state: AgentState):
        # Format the final response for the user
        final_message = state['messages'][-1].content if state['messages'] else "I've completed the travel research for you."
        return {'messages': [final_message]}

    def call_tools_llm(self, state: AgentState):
        messages = state['messages']
        messages = [SystemMessage(content=TOOLS_SYSTEM_PROMPT)] + messages
        message = self._tools_llm.invoke(messages)
        return {'messages': [message]}

    def invoke_tools(self, state: AgentState):
        last_message = state['messages'][-1]
        # Check if the last message is an AIMessage with tool_calls attribute
        if not isinstance(last_message, AIMessage) or not hasattr(last_message, 'tool_calls'):
            # If not, return empty results
            return {'messages': []}
            
        tool_calls = last_message.tool_calls
        results = []
        for t in tool_calls:
            print(f'Calling: {t}')
            if not t['name'] in self._tools:
                print('\n ....bad tool name....')
                result = 'bad tool name, retry'
            else:
                # Use the correct invocation pattern - pass the args directly as a dict
                # Use model_dump() if args is a Pydantic model, otherwise use as-is
                try:
                    # Check if args is a Pydantic BaseModel instance
                    tool_args = t['args']
                    if isinstance(t['args'], BaseModel):
                        tool_args = t['args'].model_dump()
                    elif not isinstance(t['args'], dict):
                        # Fallback for older Pydantic versions or other types
                        tool_args = t['args'].dict() if hasattr(t['args'], 'dict') else t['args']
                    result = self._tools[t['name']].invoke(tool_args)
                except Exception as e:
                    print(f"Error invoking tool {t['name']}: {e}")
                    result = f"Error invoking tool: {str(e)}"
            results.append(ToolMessage(tool_call_id=t['id'], name=t['name'], content=str(result)))
        print('Back to the model!')
        return {'messages': results}


class Assistant(Agent):
    def __init__(self) -> None:
        # Get current date for context
        today = datetime.now()
        formatted_date = today.strftime("%A, %B %d, %Y")
        
        super().__init__(
            instructions=f"""You are a professional Travel Assistant AI. Today's date is {formatted_date}.
            You can help users find flights and hotels using specialized tools. 
            Ask for specific details like departure/arrival cities and dates for flights,
            or location and dates for hotels when users request this information."""
        )
        self.travel_agent = TravelAgent()

    async def on_chat_received(self, message: agents.ChatMessage) -> None:
        """Handle incoming chat messages and use tools when needed."""
        try:
            # Process the message through our LangGraph workflow
            from langchain_core.runnables import RunnableConfig
            config = RunnableConfig(configurable={"thread_id": "1"})
            
            # Extract content from ChatMessage - handle both string and list cases
            if isinstance(message.content, str):
                content = message.content
            else:
                # If it's a list of ChatContent objects, extract the text
                content_parts = []
                for item in message.content:
                    # Convert all items to string representation
                    # This safely handles all content types including text, image, and audio
                    content_parts.append(str(item))
                content = ' '.join(content_parts)
                
            # Create properly typed inputs
            human_message = HumanMessage(content=content)
            inputs = {"messages": [human_message]}
            
            # Run the graph
            result = await asyncio.get_event_loop().run_in_executor(
                None, lambda: self.travel_agent.graph.invoke(cast(AgentState, inputs), config)
            )
            
            # Extract the final response
            final_response = result['messages'][-1]
            if isinstance(final_response, str):
                response_text = final_response
            elif hasattr(final_response, 'content'):
                response_text = final_response.content
            else:
                response_text = str(final_response)
            
            # Send the response back through LiveKit
            # Use getattr to safely access room attribute
            room = getattr(self, 'room', None)
            if room:
                await room.local_participant.publish_data(response_text)
            
        except Exception as e:
            error_msg = f"I encountered an error while processing your request: {str(e)}. Let me try to help you in a different way."
            room = getattr(self, 'room', None)
            if room:
                await room.local_participant.publish_data(error_msg)


async def entrypoint(ctx: agents.JobContext):
    session = AgentSession(
        stt="assemblyai/universal-streaming:en",
        llm="google/gemini-2.5-flash",
        tts="cartesia/sonic-2:9626c31c-bec5-4cca-baa8-f8ba9e84c8bc",
        vad=silero.VAD.load(),
        turn_detection=MultilingualModel(),
    )

    # Start the session directly without an avatar
    await session.start(
        room=ctx.room,
        agent=Assistant(),
        room_input_options=RoomInputOptions(
            # For telephony applications, use `BVCTelephony` instead for best results
            noise_cancellation=noise_cancellation.BVC(), 
        ),
    )

    await session.generate_reply(
        instructions="Greet the user warmly and offer your assistance as a professional travel assistant. Ask how you can help with their travel plans today. Mention that you can help find flights and hotels if they provide the necessary details."
    )


if __name__ == "__main__":
    agents.cli.run_app(agents.WorkerOptions(entrypoint_fnc=entrypoint))