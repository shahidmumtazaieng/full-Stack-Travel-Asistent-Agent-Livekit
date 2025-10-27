# TravelAI - LiveKit Voice Agent Travel Assistant

A complete voice-enabled travel assistant application built with LiveKit, Next.js, and Python. This project provides a sophisticated travel planning experience through natural voice conversations, combining real-time communication with AI-powered travel recommendations.

## Table of Contents
- [Overview](#overview)
- [Architecture](#architecture)
- [Features](#features)
- [Project Structure](#project-structure)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Setup and Installation](#setup-and-installation)
- [Running the Application](#running-the-application)
- [Deployment](#deployment)
- [API Keys Required](#api-keys-required)
- [Project Workflow](#project-workflow)
- [Contributing](#contributing)

## Overview

This project is a complete travel assistant solution that allows users to plan trips, find flights, and book hotels through natural voice conversations. It consists of two main components:

1. **Frontend (Next.js React Application)**: Provides the user interface for connecting to the voice agent, displaying chat/transcriptions, and managing media settings.
2. **Backend (Python Voice Agent)**: Handles voice processing, AI decision-making, and integration with travel data APIs.

## Architecture

```
┌─────────────────┐    WebSocket    ┌──────────────────────┐
│                 │◄───────────────►│                      │
│   Next.js App   │                 │  LiveKit Platform    │
│  (Frontend)     │◄───────────────►│                      │
│                 │    Media/Data   └───────────┬──────────┘
└─────────┬───────┘                            │
          │                                    │
          │         HTTP/REST                  │
          ▼                                    │
┌─────────────────┐                          │
│                 │                          │
│  Python Agent   │◄─────────────────────────┘
│  (Backend)      │    Real-time Voice
│                 │    Processing
└─────────────────┘
```

### Component Breakdown

1. **Frontend (Next.js)**
   - Real-time voice and video communication UI
   - Chat interface for text-based interaction
   - Device selection and media controls
   - Session management and state display

2. **Backend (Python Voice Agent)**
   - LiveKit Agents integration for real-time communication
   - LangGraph workflow for complex travel planning
   - Google Gemini for intelligent conversation
   - SerpAPI integration for flight/hotel data
   - Professional travel consultation workflow

## Features

### Frontend Features
- **Real-time Voice/Video**: Connect to the voice agent with live audio/video
- **Chat Interface**: Text-based communication alternative
- **Live Transcription**: Real-time speech-to-text display
- **Media Controls**: Toggle microphone, camera, and other settings
- **Device Selection**: Choose audio/video input/output devices
- **Session Management**: Connect/disconnect functionality
- **Responsive Design**: Works on desktop and mobile devices

### Backend Features
- **Voice Interface**: Natural voice conversations using LiveKit
- **LangGraph Workflow**: Multi-agent workflow for complex travel planning
- **Flight Search**: Find flights using Google Flights via SerpAPI
- **Hotel Search**: Find hotels using Google Hotels via SerpAPI
- **Travel Planning**: Professional travel planning workflow
- **Multi-Scenario Support**: Family vacations, business trips, romantic getaways, etc.
- **Stateful Conversations**: Memory persistence across sessions

## Project Structure

```
.
├── agent-starter-react/          # Frontend Next.js application
│   ├── app/                      # Next.js App Router pages
│   │   ├── (app)/                # Main application pages
│   │   │   ├── home/             # Home page components
│   │   │   └── voice-assistant/  # Voice assistant page components
│   │   └── api/                  # API routes
│   │       └── connection-details/  # LiveKit connection endpoint
│   ├── components/               # React UI components
│   │   ├── livekit/              # LiveKit-specific components
│   │   └── ui/                   # Generic UI components
│   ├── hooks/                    # Custom React hooks
│   ├── lib/                      # Utility functions and types
│   └── types/                    # TypeScript type definitions
│
├── backend/                      # Backend voice agent
│   └── livekit-voice-agent/      # Python voice agent implementation
│       ├── agent.py              # Main agent logic with LangGraph workflow
│       ├── tools/                # Travel tools (flights, hotels)
│       ├── Dockerfile            # Container build instructions
│       └── requirements.txt      # Python dependencies
│
└── README.md                     # This file
```

## Technology Stack

### Frontend
- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **LiveKit Components**: Pre-built UI components for real-time communication
- **React Hooks**: Custom hooks for state management
- **pnpm**: Fast, disk space efficient package manager

### Backend
- **Python 3.12+**: Programming language
- **LiveKit Agents**: Real-time communication framework
- **LangGraph**: Workflow orchestration for complex AI interactions
- **Google Gemini**: AI model for conversation and decision making
- **SerpAPI**: Travel data retrieval (flights/hotels)
- **Docker**: Containerization platform
- **uv**: Python package manager and project runner

## Prerequisites

- Node.js 18+ (for frontend)
- Python 3.12+ (for backend)
- LiveKit account and project
- API keys for required services
- Docker (for containerized deployment)

## Setup and Installation

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd agent-starter-react
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Create a `.env.local` file with LiveKit configuration:
   ```env
   NEXT_PUBLIC_LIVEKIT_URL=wss://your-project.livekit.cloud
   LIVEKIT_API_KEY=your_api_key
   LIVEKIT_API_SECRET=your_api_secret
   ```

### Backend Setup

1. Navigate to the backend directory:
   ```bash
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

3. Create a `.env.local` file with required API keys:
   ```env
   LIVEKIT_URL=wss://your-project.livekit.cloud
   LIVEKIT_API_KEY=your_api_key
   LIVEKIT_API_SECRET=your_api_secret
   SERPAPI_API_KEY=your_serpapi_key
   GOOGLE_API_KEY=your_google_api_key
   ```

## Running the Application

### Development Mode

You need to run both frontend and backend simultaneously:

**Frontend (Terminal 1):**
```bash
cd agent-starter-react
pnpm dev
```

**Backend (Terminal 2):**
```bash
cd backend/livekit-voice-agent
uv run agent.py start
```

The frontend will be available at `http://localhost:3000` and the backend will connect to your LiveKit project.

### Production Mode

**Frontend:**
```bash
cd agent-starter-react
pnpm build
pnpm start
```

**Backend (Docker):**
```bash
cd backend/livekit-voice-agent
docker build -t travel-voice-agent .
docker run -p 8080:8080 --env-file .env.local travel-voice-agent
```

## Deployment

### Frontend Deployment

The Next.js frontend can be deployed to any platform that supports Next.js:
- Vercel (recommended)
- Netlify
- AWS Amplify
- Custom Node.js server

### Backend Deployment

The Python backend can be deployed using:
- Docker containers
- Cloud platforms (AWS, GCP, Azure)
- Kubernetes clusters
- Serverless platforms (with modifications)

## API Keys Required

1. **LiveKit API Keys**
   - Obtain from your LiveKit project dashboard
   - Required for real-time communication

2. **SerpAPI Key**
   - Required for flight and hotel search functionality
   - Sign up at [serpapi.com](https://serpapi.com/)

3. **Google API Key**
   - Required for Google Gemini integration
   - Enable the Generative Language API in Google Cloud Console

## Project Workflow

### User Journey

1. **Connection**: User connects to the frontend application
2. **Media Setup**: User selects audio/video devices and permissions
3. **Agent Connection**: Frontend connects to the Python voice agent via LiveKit
4. **Conversation Start**: Agent greets user and begins travel consultation
5. **Requirements Gathering**: Agent asks clarifying questions about travel needs
6. **Planning Phase**: Agent provides personalized travel recommendations
7. **Booking Assistance**: Agent helps find specific flights/hotels when requested
8. **Finalization**: Agent summarizes recommendations and provides follow-up

### Technical Workflow

1. **Frontend Initialization**
   - Load Next.js application
   - Initialize LiveKit room connection
   - Set up media devices
   - Render UI components

2. **Backend Initialization**
   - Start LiveKit agent session
   - Initialize LangGraph workflow
   - Load Google Gemini model
   - Prepare travel tools

3. **Real-time Communication**
   - Audio/video streaming via WebRTC
   - Speech-to-text processing
   - AI decision making with LangGraph
   - Tool invocation for travel data
   - Text-to-speech response generation

4. **Conversation Flow**
   - Welcome and introduction
   - Requirements gathering
   - Travel planning and recommendations
   - Detailed guidance
   - Booking assistance
   - Finalization

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

### Development Guidelines

- Follow the existing code style and conventions
- Write clear, descriptive commit messages
- Add comments for complex logic
- Test changes thoroughly before submitting

- Update documentation as needed
