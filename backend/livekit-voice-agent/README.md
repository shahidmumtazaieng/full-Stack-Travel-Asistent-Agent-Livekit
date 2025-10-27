# LiveKit Travel Voice Agent

A voice-enabled travel assistant built with LiveKit Agents that can help users plan trips, find flights, and book hotels through natural voice conversations.

## Project Structure

```
.
├── agent.py                  # Main LiveKit voice agent with LangGraph workflow
├── tools/                    # Travel tools for flights and hotels
│   ├── flights_finder.py     # Flight search tool using Serpapi
│   └── hotels_finder.py      # Hotel search tool using Serpapi
├── .env.local                # Environment variables
├── requirements.txt          # Python dependencies
├── pyproject.toml            # Project configuration
└── Dockerfile                # Container build instructions
```

## Features

- **Voice Interface**: Natural voice conversations using LiveKit
- **LangGraph Workflow**: Multi-agent workflow for complex travel planning
- **Flight Search**: Find flights using Google Flights via SerpAPI
- **Hotel Search**: Find hotels using Google Hotels via SerpAPI
- **Travel Planning**: Professional travel planning workflow
- **Multi-Scenario Support**: Family vacations, business trips, romantic getaways, etc.

## Architecture

This agent combines:
- **LiveKit Agents**: For real-time voice interaction
- **LangGraph**: For complex multi-step workflows
- **LangChain Tools**: For structured tool calling
- **SerpAPI**: For flight and hotel data

The agent follows a stateful workflow where:
1. User requests are processed through LiveKit's voice interface
2. Requests are passed to a LangGraph-based workflow
3. The workflow determines which tools to use
4. Tools are executed to gather information
5. Results are formatted and returned to the user via voice

## Setup

1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Set up environment variables in `.env.local`:
   ```env
   SERPAPI_API_KEY=your_serpapi_key
   GOOGLE_API_KEY=your_google_api_key
   LIVEKIT_URL=your_livekit_url
   LIVEKIT_API_KEY=your_api_key
   LIVEKIT_API_SECRET=your_api_secret
   ```

3. Run the agent:
   ```bash
   python agent.py start
   ```

## Tools

### Flights Finder
Search for flights between airports with specific dates and passenger information.

### Hotels Finder
Search for hotels in a location with check-in/check-out dates and guest information.

## Voice Agent Workflow

The agent follows a professional travel planning workflow:

1. **Welcome & Introduction**
2. **Requirements Gathering**
3. **Travel Planning & Recommendations**
4. **Detailed Travel Guidance**
5. **Booking Assistance**
6. **Finalization & Follow-up**

## Testing

Run the test script to verify the LangGraph workflow:
```bash
python test_langgraph_agent.py
```

## Deployment

Use the provided Dockerfile to containerize the application:

```bash
docker build -t travel-voice-agent .
docker run -p 8080:8080 travel-voice-agent
```