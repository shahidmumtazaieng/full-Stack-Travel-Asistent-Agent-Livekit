'use client';

import * as React from 'react';
import { Track } from 'livekit-client';
import { useTrackToggle } from '@livekit/components-react';
import {
  Microphone,
  MicrophoneSlash,
  MonitorArrowUp,
  Spinner,
  VideoCamera,
  VideoCameraSlash,
} from '@phosphor-icons/react/dist/ssr';
import { Toggle } from '@/components/ui/toggle';
import { cn } from '@/lib/utils';

export type TrackToggleProps = React.ComponentProps<typeof Toggle> & {
  source: Parameters<typeof useTrackToggle>[0]['source'];
  pending?: boolean;
};

function getSourceIcon(source: Track.Source, enabled: boolean, pending = false) {
  if (pending) {
    return Spinner;
  }

  switch (source) {
    case Track.Source.Microphone:
      return enabled ? Microphone : MicrophoneSlash;
    case Track.Source.Camera:
      return enabled ? VideoCamera : VideoCameraSlash;
    case Track.Source.ScreenShare:
      return MonitorArrowUp;
    default:
      return React.Fragment;
  }
}

export function TrackToggle({ source, pressed, pending, className, ...props }: TrackToggleProps) {
  const IconComponent = getSourceIcon(source, pressed ?? false, pending);

  return (
    <Toggle 
      pressed={pressed} 
      aria-label={`Toggle ${source}`}
      className={cn(
        'relative',
        'bg-white/80 dark:bg-gray-800/80',
        'backdrop-blur-sm',
        'border border-gray-200 dark:border-gray-700',
        'shadow-sm shadow-gray-200/50 dark:shadow-gray-900/50',
        'hover:shadow-md transition-shadow',
        'data-[state=on]:bg-blue-500 data-[state=on]:text-white',
        'data-[state=on]:border-blue-600',
        className
      )} 
      {...props}
    >
      <IconComponent weight="bold" className={cn(
        'w-5 h-5',
        pending && 'animate-spin'
      )} />
      {props.children}
    </Toggle>
  );
}