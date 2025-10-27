'use client';

import { useEffect, useMemo, useState } from 'react';
import { Room } from 'livekit-client';
import { motion } from 'motion/react';
import { RoomAudioRenderer, RoomContext, StartAudio } from '@livekit/components-react';
import { toastAlert } from '@/components/alert-toast';
import { SessionView } from '@/components/session-view';
import { Toaster } from '@/components/ui/sonner';
import { Welcome } from '@/components/welcome';
import useConnectionDetails from '@/hooks/useConnectionDetails';
import type { AppConfig } from '@/lib/types';
import { Phone } from '@phosphor-icons/react';

const MotionWelcome = motion.create(Welcome);
const MotionSessionView = motion.create(SessionView);

interface AppProps {
  appConfig: AppConfig;
}

export function App({ appConfig }: AppProps) {
  const room = useMemo(() => new Room(), []);
  
  const [sessionStarted, setSessionStarted] = useState(false);
  const { refreshConnectionDetails, existingOrRefreshConnectionDetails } =
    useConnectionDetails(appConfig);

  useEffect(() => {
    const onDisconnected = () => {
      setSessionStarted(false);
      refreshConnectionDetails();
    };
    const onMediaDevicesError = (error: Error) => {
      toastAlert({
        title: 'Encountered an error with your media devices',
        description: `${error.name}: ${error.message}`,
      });
    };
    const onEncryptionError = (error: Error) => {
      console.warn('Encryption error occurred:', error);
      // These errors may need specific handling
    };
    room.on('mediaDevicesError', onMediaDevicesError);
    room.on('disconnected', onDisconnected);
    room.on('encryptionError', onEncryptionError);
    
    return () => {
      room.off('disconnected', onDisconnected);
      room.off('mediaDevicesError', onMediaDevicesError);
      room.off('encryptionError', onEncryptionError);
    };
  }, [room, refreshConnectionDetails]);

  useEffect(() => {
    let aborted = false;
    if (sessionStarted && room.state === 'disconnected') {
      Promise.all([
        room.localParticipant.setMicrophoneEnabled(true, undefined, {
          preConnectBuffer: appConfig.isPreConnectBufferEnabled,
        }),
        existingOrRefreshConnectionDetails().then((connectionDetails) =>
          room.connect(connectionDetails.serverUrl, connectionDetails.participantToken)
        ),
      ]).catch((error) => {
        if (aborted) {
          // Once the effect has cleaned up after itself, drop any errors
          //
          // These errors are likely caused by this effect rerunning rapidly,
          // resulting in a previous run `disconnect` running in parallel with
          // a current run `connect`
          return;
        }

        toastAlert({
          title: 'There was an error connecting to the agent',
          description: `${error.name}: ${error.message}`,
        });
      });
    }
    return () => {
      aborted = true;
      room.disconnect();
    };
  }, [room, sessionStarted, appConfig.isPreConnectBufferEnabled]);

  const { startButtonText } = appConfig;

  return (
    <main className="relative">
      <MotionWelcome
        key="welcome"
        startButtonText={startButtonText}
        onStartCall={() => setSessionStarted(true)}
        disabled={sessionStarted}
      />

      <RoomContext.Provider value={room}>
        <RoomAudioRenderer />
        <StartAudio label="Start Audio" />
        {/* Conversation popup overlay */}
        {sessionStarted && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl h-[90vh] overflow-hidden flex flex-col">
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">Conversation</h2>
                <button 
                  onClick={() => setSessionStarted(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="flex-grow overflow-auto">
                <MotionSessionView
                  key="session-view"
                  appConfig={appConfig}
                  disabled={!sessionStarted}
                  sessionStarted={sessionStarted}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: sessionStarted ? 1 : 0 }}
                  transition={{
                    duration: 0.5,
                    ease: 'easeInOut',
                    delay: sessionStarted ? 0.2 : 0,
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </RoomContext.Provider>

      {/* Floating Call Button */}
      {!sessionStarted && (
        <button
          onClick={() => setSessionStarted(true)}
          className="fixed bottom-8 right-8 bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 z-30 flex items-center justify-center"
          aria-label="Start call"
        >
          <Phone className="w-6 h-6" weight="fill" />
        </button>
      )}

      <Toaster />
    </main>
  );
}