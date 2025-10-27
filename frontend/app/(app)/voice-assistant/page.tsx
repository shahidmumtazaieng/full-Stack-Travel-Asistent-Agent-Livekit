'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Room } from 'livekit-client';
import { RoomAudioRenderer, RoomContext, StartAudio } from '@livekit/components-react';
import { toastAlert } from '@/components/alert-toast';
import { SessionView } from '@/components/session-view';
import { Toaster } from '@/components/ui/sonner';
import useConnectionDetails from '@/hooks/useConnectionDetails';
import { getAppConfig } from '@/lib/utils';
import type { AppConfig } from '@/lib/types';

export default function VoiceAssistantPage() {
  const [appConfig, setAppConfig] = useState<AppConfig | null>(null);
  const [room] = useState(() => new Room());
  const router = useRouter();
  
  // Initialize with a default config to avoid conditional hook calls
  const [initialConfig] = useState<AppConfig>({
    companyName: 'Travel AI',
    pageTitle: 'Travel Ai Voice Agent',
    pageDescription: 'A voice agent built with Travel AI',
    supportsChatInput: true,
    supportsVideoInput: true,
    supportsScreenShare: true,
    isPreConnectBufferEnabled: true,
    accent: '#002cf2',
    logo: 'https://img.freepik.com/premium-vector/travel-agency-logo-vector-white-background_1277164-7693.jpg',
    logoDark: 'https://img.freepik.com/premium-vector/travel-agency-logo-vector-white-background_1277164-7693.jpg',
    accentDark: '#1fd5f9',
    startButtonText: 'Start call',
    agentName: undefined,
  });
  
  const { refreshConnectionDetails, existingOrRefreshConnectionDetails } = useConnectionDetails(initialConfig);
  
  // Get the actual app config
  useEffect(() => {
    const loadConfig = async () => {
      const config = await getAppConfig(new Headers());
      setAppConfig(config);
    };
    loadConfig();
  }, []);

  useEffect(() => {
    // Don't proceed if we don't have the real config yet
    if (!appConfig) return;
    
    const onDisconnected = () => {
      console.log('Room disconnected, attempting to refresh connection details');
      refreshConnectionDetails().catch((error) => {
        console.error('Failed to refresh connection details:', error);
      });
      // Navigate back to welcome page when disconnected
      router.push('/');
    };
    
    const onMediaDevicesError = (error: Error) => {
      toastAlert({
        title: 'Encountered an error with your media devices',
        description: `${error.name}: ${error.message}`,
      });
    };
    
    const onEncryptionError = (error: Error) => {
      console.warn('Encryption error occurred:', error);
    };
    
    room.on('mediaDevicesError', onMediaDevicesError);
    room.on('disconnected', onDisconnected);
    room.on('encryptionError', onEncryptionError);
    
    // Connect to the room
    const connectToRoom = async () => {
      try {
        const connectionDetails = await existingOrRefreshConnectionDetails();
        console.log('Connection details obtained:', connectionDetails);
        
        await Promise.all([
          room.localParticipant.setMicrophoneEnabled(true, undefined, {
            preConnectBuffer: appConfig.isPreConnectBufferEnabled,
          }),
          room.connect(connectionDetails.serverUrl, connectionDetails.participantToken),
        ]);
        
        console.log('Successfully connected to room');
      } catch (error: any) {
        console.error('Error connecting to room:', error);
        toastAlert({
          title: 'There was an error connecting to the agent',
          description: `${error.name}: ${error.message}`,
        });
        // Navigate back to welcome page on connection error
        router.push('/');
      }
    };
    
    connectToRoom();
    
    return () => {
      room.off('mediaDevicesError', onMediaDevicesError);
      room.off('disconnected', onDisconnected);
      room.off('encryptionError', onEncryptionError);
      room.disconnect();
    };
  }, [room, appConfig, refreshConnectionDetails, existingOrRefreshConnectionDetails, router]);

  // Show loading state until we have the real config
  if (!appConfig) {
    return <div>Loading...</div>;
  }

  return (
    <main className="relative min-h-screen bg-gray-50 dark:bg-gray-900">
      <RoomContext.Provider value={room}>
        <RoomAudioRenderer />
        <StartAudio label="Start Audio" />
        <SessionView 
          appConfig={appConfig}
          disabled={false}
          sessionStarted={true}
        />
      </RoomContext.Provider>
      <Toaster />
    </main>
  );
}