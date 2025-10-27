'use client';

import * as React from 'react';
import { useCallback } from 'react';
import { Track } from 'livekit-client';
import { BarVisualizer, useRemoteParticipants } from '@livekit/components-react';
import { ChatText, PhoneDisconnect, Phone } from '@phosphor-icons/react/dist/ssr';
import { ChatInput } from '@/components/livekit/chat/chat-input';
import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';
import { AppConfig } from '@/lib/types';
import { cn } from '@/lib/utils';
import { DeviceSelect } from '../device-select';
import { TrackToggle } from '../track-toggle';
import { UseAgentControlBarProps, useAgentControlBar } from './hooks/use-agent-control-bar';

export interface AgentControlBarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    UseAgentControlBarProps {
  capabilities: Pick<AppConfig, 'supportsChatInput' | 'supportsVideoInput' | 'supportsScreenShare'>;
  onChatOpenChange?: (open: boolean) => void;
  onSendMessage?: (message: string) => Promise<void>;
  onDisconnect?: () => void;
  onDeviceError?: (error: { source: Track.Source; error: Error }) => void;
}

/**
 * A control bar specifically designed for voice assistant interfaces
 */
export function AgentControlBar({
  controls,
  saveUserChoices = true,
  capabilities,
  className,
  onSendMessage,
  onChatOpenChange,
  onDisconnect,
  onDeviceError,
  ...props
}: AgentControlBarProps) {
  const participants = useRemoteParticipants();
  const [chatOpen, setChatOpen] = React.useState(false);
  const [isSendingMessage, setIsSendingMessage] = React.useState(false);

  const isAgentAvailable = participants.some((p) => p.isAgent);
  const isInputDisabled = !chatOpen || !isAgentAvailable || isSendingMessage;

  const [isDisconnecting, setIsDisconnecting] = React.useState(false);

  const {
    micTrackRef,
    visibleControls,
    cameraToggle,
    microphoneToggle,
    screenShareToggle,
    handleAudioDeviceChange,
    handleVideoDeviceChange,
    handleDisconnect,
  } = useAgentControlBar({
    controls,
    saveUserChoices,
  });

  const handleSendMessage = async (message: string) => {
    setIsSendingMessage(true);
    try {
      await onSendMessage?.(message);
    } finally {
      setIsSendingMessage(false);
    }
  };

  const onLeave = async () => {
    setIsDisconnecting(true);
    await handleDisconnect();
    setIsDisconnecting(false);
    onDisconnect?.();
  };

  React.useEffect(() => {
    onChatOpenChange?.(chatOpen);
  }, [chatOpen, onChatOpenChange]);

  const onMicrophoneDeviceSelectError = useCallback(
    (error: Error) => {
      onDeviceError?.({ source: Track.Source.Microphone, error });
    },
    [onDeviceError]
  );
  const onCameraDeviceSelectError = useCallback(
    (error: Error) => {
      onDeviceError?.({ source: Track.Source.Camera, error });
    },
    [onDeviceError]
  );

  return (
    <div
      aria-label="Voice assistant controls"
      className={cn(
        'bg-white/90 dark:bg-gray-900/90',
        'backdrop-blur-xl',
        'border border-gray-200 dark:border-gray-700',
        'rounded-2xl p-4 shadow-xl shadow-gray-900/10',
        'transition-all duration-300',
        className
      )}
      {...props}
    >
      {capabilities.supportsChatInput && (
        <div
          inert={!chatOpen}
          className={cn(
            'overflow-hidden transition-all duration-300 ease-out mb-4',
            chatOpen ? 'max-h-32 opacity-100' : 'max-h-0 opacity-0'
          )}
        >
          <div className="flex h-12 w-full">
            <ChatInput onSend={handleSendMessage} disabled={isInputDisabled} className="w-full" />
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700 my-3"></div>
        </div>
      )}

      <div className="flex flex-row justify-between gap-3">
        <div className="flex gap-2">
          {visibleControls.microphone && (
            <div className="flex items-center gap-0">
              <TrackToggle
                variant="primary"
                source={Track.Source.Microphone}
                pressed={microphoneToggle.enabled}
                disabled={microphoneToggle.pending}
                onPressedChange={microphoneToggle.toggle}
                className="peer/track group/track relative w-auto pr-4 pl-4 md:rounded-r-none md:border-r-0 md:pr-3"
              >
                <BarVisualizer
                  barCount={3}
                  trackRef={micTrackRef}
                  options={{ minHeight: 5 }}
                  className="flex h-full w-auto items-center justify-center gap-1"
                >
                  <span
                    className={cn([
                      'h-full w-1 origin-center rounded-full',
                      'group-data-[state=on]/track:bg-white group-data-[state=off]/track:bg-red-500',
                      'data-lk-muted:bg-gray-400',
                    ])}
                  ></span>
                </BarVisualizer>
              </TrackToggle>
              <div className="bg-gray-200 dark:bg-gray-700 peer-data-[state=off]/track:bg-red-500 relative z-10 -mr-px hidden h-6 w-px md:block"></div>
              <DeviceSelect
                size="sm"
                kind="audioinput"
                requestPermissions={false}
                onMediaDeviceError={onMicrophoneDeviceSelectError}
                onActiveDeviceChange={handleAudioDeviceChange}
                className={cn([
                  'pl-3',
                  'peer-data-[state=off]/track:text-red-500',
                  'hover:text-gray-800 focus:text-gray-800',
                  'hover:peer-data-[state=off]/track:text-red-500 focus:peer-data-[state=off]/track:text-red-500',
                  'hidden rounded-l-none md:block',
                ])}
              />
            </div>
          )}

          {capabilities.supportsVideoInput && visibleControls.camera && (
            <div className="flex items-center gap-0">
              <TrackToggle
                variant="primary"
                source={Track.Source.Camera}
                pressed={cameraToggle.enabled}
                pending={cameraToggle.pending}
                disabled={cameraToggle.pending}
                onPressedChange={cameraToggle.toggle}
                className="peer/track relative w-auto rounded-r-none pr-4 pl-4 disabled:opacity-100 md:border-r-0 md:pr-3"
              />
              <div className="bg-gray-200 dark:bg-gray-700 peer-data-[state=off]/track:bg-red-500 relative z-10 -mr-px hidden h-6 w-px md:block"></div>
              <DeviceSelect
                size="sm"
                kind="videoinput"
                requestPermissions={false}
                onMediaDeviceError={onCameraDeviceSelectError}
                onActiveDeviceChange={handleVideoDeviceChange}
                className={cn([
                  'pl-3',
                  'peer-data-[state=off]/track:text-red-500',
                  'hover:text-gray-800 focus:text-gray-800',
                  'hover:peer-data-[state=off]/track:text-red-500 focus:peer-data-[state=off]/track:text-red-500',
                  'rounded-l-none',
                ])}
              />
            </div>
          )}

          {capabilities.supportsScreenShare && visibleControls.screenShare && (
            <div className="flex items-center gap-0">
              <TrackToggle
                variant="secondary"
                source={Track.Source.ScreenShare}
                pressed={screenShareToggle.enabled}
                disabled={screenShareToggle.pending}
                onPressedChange={screenShareToggle.toggle}
                className="relative w-auto rounded-full"
              />
            </div>
          )}

          {visibleControls.chat && (
            <Toggle
              variant="secondary"
              aria-label="Toggle chat"
              pressed={chatOpen}
              onPressedChange={setChatOpen}
              disabled={!isAgentAvailable}
              className="aspect-square h-full rounded-full"
            >
              <ChatText weight="bold" className="w-5 h-5" />
            </Toggle>
          )}
        </div>
        {visibleControls.leave && (
          <Button
            variant="destructive"
            onClick={onLeave}
            disabled={isDisconnecting}
            className="font-medium rounded-full px-4 py-2 flex items-center gap-2"
          >
            <PhoneDisconnect weight="bold" className="w-5 h-5" />
            <span className="hidden md:inline">END CALL</span>
            <span className="inline md:hidden">END</span>
          </Button>
        )}
      </div>
    </div>
  );
}