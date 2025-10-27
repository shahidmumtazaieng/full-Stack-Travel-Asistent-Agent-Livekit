'use client';

import React from 'react';
import { Room } from 'livekit-client';
import { RoomContext } from '@livekit/components-react';
import { toastAlert } from '@/components/alert-toast';
import useConnectionDetails from '@/hooks/useConnectionDetails';
import { AppConfig } from '@/lib/types';

export function Provider({
  appConfig,
  children,
}: {
  appConfig: AppConfig;
  children: React.ReactNode;
}) {
  const { connectionDetails } = useConnectionDetails(appConfig);
  const room = React.useMemo(() => new Room(), []);

  React.useEffect(() => {
    if (room.state === 'disconnected' && connectionDetails) {
      Promise.all([
        room.localParticipant.setMicrophoneEnabled(true, undefined, {
          preConnectBuffer: true,
        }),
        room.connect(connectionDetails.serverUrl, connectionDetails.participantToken),
      ]).catch((error) => {
        toastAlert({
          title: 'There was an error connecting to the agent',
          description: `${error.name}: ${error.message}`,
        });
      });
    }
    
    const onMediaDevicesError = (error: Error) => {
      toastAlert({
        title: 'Encountered an error with your media devices',
        description: `${error.name}: ${error.message}`,
      });
    };
    const onEncryptionError = (error: Error) => {
      console.warn('Encryption error occurred in Provider:', error);
      // These errors may need specific handling
    };
    room.on('mediaDevicesError', onMediaDevicesError);
    room.on('encryptionError', onEncryptionError);
    
    return () => {
      room.off('mediaDevicesError', onMediaDevicesError);
      room.off('encryptionError', onEncryptionError);
      room.disconnect();
    };
  }, [room, connectionDetails]);

  return <RoomContext.Provider value={room}>{children}</RoomContext.Provider>;
}