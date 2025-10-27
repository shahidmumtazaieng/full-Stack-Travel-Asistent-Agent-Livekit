# LiveKit Travel Voice Agent

A sophisticated voice-enabled travel assistant built with LiveKit Agents that helps users plan trips, find flights, and book hotels through natural voice conversations. This project combines real-time voice processing with AI-powered travel planning capabilities.

## Table of Contents
- [Overview](#overview)
- [Architecture](#architecture)
- [Features](#features)
- [Project Structure](#project-structure)
- [Workflow](#workflow)
- [Prerequisites](#prerequisites)
- [Setup](#setup)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Deployment](#deployment)
- [API Keys Required](#api-keys-required)
- [Tools](#tools)
- [Testing](#testing)

## Overview

This voice agent provides a complete travel planning experience through natural conversation. Users can discuss their travel needs, get personalized recommendations, and receive specific flight and hotel information - all through voice interaction.

The system integrates:
- **LiveKit Agents**: For real-time voice, video, and data streaming
- **LangGraph**: For complex multi-step workflows and state management
- **Google Gemini**: For intelligent conversation and decision making
- **SerpAPI**: For flight and hotel data retrieval
- **Professional Travel Planning Workflow**: Structured approach to travel consultation

## Architecture

```
┌─────────────────┐    Voice/Text    ┌──────────────────────┐
│                 │◄────────────────►│                      │
│   User Client   │                  │   LiveKit Platform   │
│                 │─────────────────►│                      │
└─────────────────┘    Media/Data    └───────────┬──────────┘
                                                │
                       ┌────────────────────────▼────────────────────────┐
                       │              Voice Agent Server                │
                       │ ┌─────────────────────────────────────────────┐ │
                       │ │              LiveKit Agents                 │ │
                       │ ├─────────────────────────────────────────────┤ │
                       │ │              LangGraph Workflow             │ │
                       │ ├─────────────────────────────────────────────┤ │
                       │ │        Google Gemini (Decision Logic)       │ │
                       │ ├─────────────────────────────────────────────┤ │
                       │ │        Travel Tools (SerpAPI Integration)   │ │
                       │ └─────────────────────────────────────────────┘ │
                       └─────────────────────────────────────────────────┘
```

## Features

- **Voice Interface**: Natural voice conversations using LiveKit's real-time communication
- **LangGraph Workflow**: Multi-agent workflow for complex travel planning
- **Flight Search**: Find flights using Google Flights via SerpAPI
- **Hotel Search**: Find hotels using Google Hotels via SerpAPI
- **Travel Planning**: Professional travel planning workflow
- **Multi-Scenario Support**: Family vacations, business trips, romantic getaways, etc.
- **Real-time Processing**: Low-latency voice interaction with noise cancellation
- **Stateful Conversations**: Memory persistence across conversation sessions

## Project Structure

```
backend/
└── livekit-voice-agent/
    ├── agent.py                  # Main LiveKit voice agent with LangGraph workflow
    ├── tools/                    # Travel tools for flights and hotels
    │   ├── flights_finder.py     # Flight search tool using Serpapi
    │   └── hotels_finder.py      # Hotel search tool using Serpapi
    ├── .env.local                # Environment variables
    ├── requirements.txt          # Python dependencies
    ├── pyproject.toml            # Project configuration
    ├── Dockerfile                # Container build instructions
    └── README.md                 # Agent-specific documentation
```

## Workflow

The agent follows a professional travel planning workflow:

1. **Welcome & Introduction**
   - Warm greeting and establishment of expertise
   - Initial travel inquiry

2. **Requirements Gathering**
   - Primary purpose of travel (business, leisure, family vacation, etc.)
   - Destination preferences
   - Travel dates and flexibility
   - Budget range
   - Group composition
   - Special requirements

3. **Travel Planning & Recommendations**
   - Personalized recommendations based on requirements
   - Destination options with pros/cons
   - Optimal travel dates
   - Accommodation options
   - Transportation options

4. **Detailed Travel Guidance**
   - Local attractions and activities
   - Dining recommendations
   - Cultural tips and etiquette
   - Visa and documentation requirements
   - Weather information
   - Safety information

5. **Booking Assistance**
   - Flight comparison using flights_finder tool
   - Accommodation suggestions using hotels_finder tool
   - Travel insurance options
   - Booking platform recommendations

6. **Finalization & Follow-up**
   - Travel detail confirmation
   - Summary document provision
   - Pre-departure tips
   - Last-minute question support

## Prerequisites

- Python 3.12 or higher
- LiveKit account and project
- API keys for required services (see [API Keys Required](#api-keys-required))
- Docker (for containerized deployment)

## Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd backend/livekit-voice-agent
   ```

2. Install dependencies using uv (recommended):
   ```bash
   pip install uv
   uv sync
   ```

   Or using pip:
   ```bash
   pip install -r requirements.txt
   ```

## Configuration

Create a `.env.local` file in the `livekit-voice-agent` directory with the following environment variables:

```env
# LiveKit configuration
LIVEKIT_URL=your_livekit_url
LIVEKIT_API_KEY=your_api_key
LIVEKIT_API_SECRET=your_api_secret

# API keys for travel tools
SERPAPI_API_KEY=your_serpapi_key
GOOGLE_API_KEY=your_google_api_key

# Optional email configuration
FROM_EMAIL=your_email@example.com
TO_EMAIL=recipient@example.com
EMAIL_SUBJECT=Your Travel Itinerary
SENDGRID_API_KEY=your_sendgrid_api_key
```

## Running the Application

### Development Mode

```bash
uv run agent.py start
```

Or with pip:

```bash
python agent.py start
```

### Pre-download Models (Recommended)

To ensure all models are downloaded before runtime:

```bash
uv run agent.py download-files
```

## Deployment

### Docker Deployment

1. Build the Docker image:
   ```bash
   docker build -t travel-voice-agent .
   ```

2. Run the container:
   ```bash
   docker run -p 8080:8080 --env-file .env.local travel-voice-agent
   ```

### Production Considerations

- Use proper secrets management for API keys
- Configure appropriate resource limits
- Set up monitoring and logging
- Implement health checks
- Use a process manager like systemd or supervisor

## API Keys Required

The following API keys are required for full functionality:

1. **LiveKit API Keys**
   - Obtain from your LiveKit project dashboard
   - Required for real-time communication

2. **SerpAPI Key**
   - Required for flight and hotel search functionality
   - Sign up at [serpapi.com](https://serpapi.com/)

3. **Google API Key**
   - Required for Google Gemini integration
   - Enable the Generative Language API in Google Cloud Console

4. **Optional Services**
   - SendGrid API Key (for email functionality)
   - Cartesia API Key (for alternative TTS)

## Tools

### Flights Finder
Search for flights between airports with specific dates and passenger information.

**Parameters:**
- `departure_airport`: Departure airport code (IATA)
- `arrival_airport`: Arrival airport code (IATA)
- `outbound_date`: Outbound date (YYYY-MM-DD)
- `return_date`: Return date (YYYY-MM-DD)
- `adults`: Number of adults (default: 1)
- `children`: Number of children (default: 0)
- `infants_in_seat`: Number of infants in seat (default: 0)
- `infants_on_lap`: Number of infants on lap (default: 0)

### Hotels Finder
Search for hotels in a location with check-in/check-out dates and guest information.

**Parameters:**
- `q`: Location of the hotel
- `check_in_date`: Check-in date (YYYY-MM-DD)
- `check_out_date`: Check-out date (YYYY-MM-DD)
- `sort_by`: Sorting criteria (optional)
- `adults`: Number of adults (default: 1)
- `children`: Number of children (default: 0)
- `rooms`: Number of rooms (default: 1)
- `hotel_class`: Hotel class filter (e.g., "2,3,4")

## Testing

Run the agent in development mode to test functionality:

```bash
uv run agent.py start
```

Monitor the console for:
- Connection status
- Tool invocation logs
- Error messages
- Conversation flow

For integration testing, you can connect to your LiveKit room using the LiveKit client SDKs or the LiveKit CLI.