import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Phone, PhoneOff, Video, VideoOff, MessageSquare, Settings, Wifi, WifiOff, Volume2, User, ArrowLeft, Minimize2, Maximize2 } from 'lucide-react';

// Simulated LiveKit connection states
const ConnectionState = {
  DISCONNECTED: 'disconnected',
  CONNECTING: 'connecting',
  CONNECTED: 'connected',
  RECONNECTING: 'reconnecting'
};

const AgentState = {
  INITIALIZING: 'initializing',
  LISTENING: 'listening',
  THINKING: 'thinking',
  SPEAKING: 'speaking'
};

export default function VoiceAssistantApp() {
  const [connectionState, setConnectionState] = useState(ConnectionState.DISCONNECTED);
  const [agentState, setAgentState] = useState(AgentState.INITIALIZING);
  const [isCallActive, setIsCallActive] = useState(false);
  const [isMicEnabled, setIsMicEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(false);
  const [messages, setMessages] = useState([]);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [audioLevel, setAudioLevel] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [isVideoExpanded, setIsVideoExpanded] = useState(false);
  const videoRef = useRef(null);
  const chatEndRef = useRef(null);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Simulate audio visualization
  useEffect(() => {
    if (isCallActive && agentState === AgentState.SPEAKING) {
      const interval = setInterval(() => {
        setAudioLevel(Math.random() * 100);
      }, 100);
      return () => clearInterval(interval);
    } else {
      setAudioLevel(0);
    }
  }, [isCallActive, agentState]);

  // Simulate connection process
  const handleStartCall = async () => {
    setConnectionState(ConnectionState.CONNECTING);
    setMessages([{ type: 'system', content: 'Connecting to travel assistant...', timestamp: new Date() }]);

    setTimeout(() => {
      setConnectionState(ConnectionState.CONNECTED);
      setIsCallActive(true);
      setAgentState(AgentState.LISTENING);
      setMessages(prev => [...prev, 
        { type: 'system', content: 'Connected successfully!', timestamp: new Date() },
        { type: 'agent', content: 'Hi! I\'m your travel assistant. How can I help you plan your trip today?', timestamp: new Date() }
      ]);
      
      if (isVideoEnabled) {
        startVideoStream();
      }
    }, 2000);
  };

  const handleEndCall = () => {
    setConnectionState(ConnectionState.DISCONNECTED);
    setIsCallActive(false);
    setAgentState(AgentState.INITIALIZING);
    setMessages(prev => [...prev, { type: 'system', content: 'Call ended', timestamp: new Date() }]);
    stopVideoStream();
  };

  const startVideoStream = () => {
    if (videoRef.current && navigator.mediaDevices) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then(stream => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch(err => {
          console.error('Error accessing camera:', err);
          setIsVideoEnabled(false);
        });
    }
  };

  const stopVideoStream = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const toggleVideo = () => {
    if (!isVideoEnabled) {
      setIsVideoEnabled(true);
      if (isCallActive) startVideoStream();
    } else {
      setIsVideoEnabled(false);
      stopVideoStream();
    }
  };

  const toggleMic = () => {
    setIsMicEnabled(!isMicEnabled);
    if (isCallActive) {
      setMessages(prev => [...prev, { 
        type: 'system', 
        content: `Microphone ${!isMicEnabled ? 'enabled' : 'muted'}`, 
        timestamp: new Date() 
      }]);
    }
  };

  // Simulate user speaking
  const simulateUserMessage = () => {
    const userMessages = [
      "I want to visit Paris next month",
      "What's the weather like in Tokyo?",
      "Can you recommend hotels in New York?",
      "I need a flight to London"
    ];
    const message = userMessages[Math.floor(Math.random() * userMessages.length)];
    setMessages(prev => [...prev, { type: 'user', content: message, timestamp: new Date() }]);
    simulateAgentResponse(message);
  };

  // Simulate agent responses
  const simulateAgentResponse = (userMessage) => {
    setAgentState(AgentState.THINKING);
    setTimeout(() => {
      setAgentState(AgentState.SPEAKING);
      const responses = [
        "I'd be happy to help you with that! Let me find the best options for you.",
        "Great choice! I have some excellent recommendations based on your preferences.",
        "I found several amazing destinations that match what you're looking for.",
        "Let me check the latest availability and prices for you."
      ];
      const response = responses[Math.floor(Math.random() * responses.length)];
      setMessages(prev => [...prev, { type: 'agent', content: response, timestamp: new Date() }]);
      
      setTimeout(() => {
        setAgentState(AgentState.LISTENING);
      }, 2000);
    }, 1500);
  };

  // Audio visualizer bars
  const AudioVisualizer = () => {
    const bars = 40;
    return (
      <div className="flex items-center justify-center space-x-1 h-24">
        {[...Array(bars)].map((_, i) => {
          const height = agentState === AgentState.SPEAKING 
            ? Math.random() * 60 + 20 
            : agentState === AgentState.THINKING 
            ? Math.random() * 30 + 10 
            : 10;
          
          return (
            <div
              key={i}
              className="bg-gradient-to-t from-blue-600 to-purple-600 rounded-full transition-all duration-100"
              style={{
                width: '4px',
                height: `${height}px`,
                opacity: 0.7 + Math.random() * 0.3
              }}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <header className="bg-slate-800/50 backdrop-blur-md border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => window.history.back()}
                className="p-2 hover:bg-slate-700 rounded-lg transition"
              >
                <ArrowLeft className="w-5 h-5 text-slate-300" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-white">Travel Voice Assistant</h1>
                <div className="flex items-center space-x-2 mt-1">
                  {connectionState === ConnectionState.CONNECTED ? (
                    <>
                      <Wifi className="w-4 h-4 text-green-400" />
                      <span className="text-sm text-green-400">Connected</span>
                    </>
                  ) : connectionState === ConnectionState.CONNECTING ? (
                    <>
                      <div className="w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
                      <span className="text-sm text-yellow-400">Connecting...</span>
                    </>
                  ) : (
                    <>
                      <WifiOff className="w-4 h-4 text-slate-400" />
                      <span className="text-sm text-slate-400">Disconnected</span>
                    </>
                  )}
                  {isCallActive && (
                    <span className="ml-4 px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs font-medium">
                      {agentState.charAt(0).toUpperCase() + agentState.slice(1)}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 hover:bg-slate-700 rounded-lg transition"
            >
              <Settings className="w-5 h-5 text-slate-300" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Video & Audio */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Panel */}
            <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl border border-slate-700 overflow-hidden">
              <div className="p-4 border-b border-slate-700 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Video className="w-5 h-5 text-blue-400" />
                  <h2 className="text-lg font-semibold text-white">Video Stream</h2>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setIsVideoExpanded(!isVideoExpanded)}
                    className="p-2 hover:bg-slate-700 rounded-lg transition"
                  >
                    {isVideoExpanded ? (
                      <Minimize2 className="w-4 h-4 text-slate-300" />
                    ) : (
                      <Maximize2 className="w-4 h-4 text-slate-300" />
                    )}
                  </button>
                </div>
              </div>
              <div className="relative aspect-video bg-slate-900">
                {isVideoEnabled && isCallActive ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <User className="w-12 h-12 text-white" />
                      </div>
                      <p className="text-slate-400">
                        {isCallActive ? 'Video disabled' : 'Start a call to enable video'}
                      </p>
                    </div>
                  </div>
                )}
                
                {isCallActive && (
                  <div className="absolute top-4 left-4 bg-slate-800/80 backdrop-blur-sm rounded-lg p-3 border border-slate-600">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
                          <Volume2 className="w-6 h-6 text-white" />
                        </div>
                        {agentState === AgentState.SPEAKING && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse" />
                        )}
                      </div>
                      <div>
                        <div className="text-white font-medium text-sm">AI Travel Agent</div>
                        <div className="text-slate-400 text-xs">{agentState}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Audio Visualizer */}
            <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl border border-slate-700 p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Volume2 className="w-5 h-5 text-purple-400" />
                <h2 className="text-lg font-semibold text-white">Audio Stream</h2>
              </div>
              <div className="bg-slate-900/50 rounded-xl p-6">
                {isCallActive ? (
                  <AudioVisualizer />
                ) : (
                  <div className="flex items-center justify-center h-24">
                    <p className="text-slate-400">Audio visualization will appear during call</p>
                  </div>
                )}
              </div>
              {isCallActive && (
                <div className="mt-4 flex items-center justify-center space-x-2 text-sm text-slate-400">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span>Audio active - {isMicEnabled ? 'Microphone on' : 'Microphone muted'}</span>
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl border border-slate-700 p-6">
              <div className="flex justify-center items-center space-x-4">
                <button
                  onClick={toggleMic}
                  disabled={!isCallActive}
                  className={`p-4 rounded-full transition-all transform hover:scale-110 ${
                    isMicEnabled 
                      ? 'bg-blue-600 hover:bg-blue-700' 
                      : 'bg-red-600 hover:bg-red-700'
                  } ${!isCallActive ? 'opacity-50 cursor-not-allowed' : ''} text-white`}
                  title={isMicEnabled ? 'Mute' : 'Unmute'}
                >
                  {isMicEnabled ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
                </button>

                <button
                  onClick={isCallActive ? handleEndCall : handleStartCall}
                  disabled={connectionState === ConnectionState.CONNECTING}
                  className={`p-6 rounded-full transition-all transform hover:scale-110 ${
                    isCallActive 
                      ? 'bg-red-600 hover:bg-red-700' 
                      : 'bg-green-600 hover:bg-green-700'
                  } text-white shadow-lg`}
                >
                  {connectionState === ConnectionState.CONNECTING ? (
                    <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
                  ) : isCallActive ? (
                    <PhoneOff className="w-8 h-8" />
                  ) : (
                    <Phone className="w-8 h-8" />
                  )}
                </button>

                <button
                  onClick={toggleVideo}
                  disabled={!isCallActive}
                  className={`p-4 rounded-full transition-all transform hover:scale-110 ${
                    isVideoEnabled 
                      ? 'bg-blue-600 hover:bg-blue-700' 
                      : 'bg-slate-600 hover:bg-slate-700'
                  } ${!isCallActive ? 'opacity-50 cursor-not-allowed' : ''} text-white`}
                  title={isVideoEnabled ? 'Disable Video' : 'Enable Video'}
                >
                  {isVideoEnabled ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
                </button>
              </div>

              <div className="mt-6 text-center">
                <p className="text-slate-400 text-sm mb-2">
                  {isCallActive ? 'Call in progress' : 'Click the phone button to start'}
                </p>
                {isCallActive && (
                  <button
                    onClick={simulateUserMessage}
                    className="mt-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg transition"
                  >
                    Simulate User Message
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Chat */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl border border-slate-700 h-full flex flex-col">
              <div className="p-4 border-b border-slate-700 flex items-center space-x-2">
                <MessageSquare className="w-5 h-5 text-green-400" />
                <h2 className="text-lg font-semibold text-white">Conversation</h2>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ maxHeight: 'calc(100vh - 300px)' }}>
                {messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-slate-400 text-center">
                      Start a call to begin conversation
                    </p>
                  </div>
                ) : (
                  messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] rounded-lg p-3 ${
                        msg.type === 'system' 
                          ? 'bg-slate-700/50 text-slate-300 text-sm text-center w-full' 
                          : msg.type === 'user'
                          ? 'bg-blue-600 text-white rounded-br-none'
                          : 'bg-slate-700 text-white rounded-bl-none'
                      }`}>
                        {msg.type !== 'system' && (
                          <div className="text-xs opacity-75 mb-1">
                            {msg.type === 'user' ? 'You' : 'AI Agent'}
                          </div>
                        )}
                        <p className="text-sm">{msg.content}</p>
                        <div className="text-xs opacity-50 mt-1">
                          {msg.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  ))
                )}
                <div ref={chatEndRef} />
              </div>

              {isCallActive && (
                <div className="p-4 border-t border-slate-700">
                  <div className="flex items-center space-x-2 text-sm text-slate-400">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                    <span>Listening...</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-2xl border border-slate-700 max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">Settings</h3>
              <button
                onClick={() => setShowSettings(false)}
                className="p-2 hover:bg-slate-700 rounded-lg transition"
              >
                <span className="text-slate-300 text-xl">×</span>
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-slate-300 text-sm font-medium">Room URL</label>
                <input
                  type="text"
                  placeholder="wss://your-livekit-server.com"
                  className="w-full mt-2 px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="text-slate-300 text-sm font-medium">Access Token</label>
                <input
                  type="password"
                  placeholder="Enter your token"
                  className="w-full mt-2 px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition">
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}