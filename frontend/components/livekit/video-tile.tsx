import React from 'react';
import { motion } from 'motion/react';
import { VideoTrack } from '@livekit/components-react';
import { cn } from '@/lib/utils';

const MotionVideoTrack = motion.create(VideoTrack);

export const VideoTile = ({
  trackRef,
  className,
  ref,
}: React.ComponentProps<'div'> & React.ComponentProps<typeof VideoTrack>) => {
  return (
    <div 
      ref={ref} 
      className={cn(
        'bg-gradient-to-br from-gray-700/30 to-gray-800/30',
        'backdrop-blur-sm border border-gray-600/30 rounded-xl',
        'shadow-lg shadow-gray-900/10',
        'overflow-hidden',
        className
      )}
    >
      <div className="relative w-full h-full">
        <MotionVideoTrack
          trackRef={trackRef}
          width={trackRef?.publication.dimensions?.width ?? 0}
          height={trackRef?.publication.dimensions?.height ?? 0}
          className={cn('w-full h-full object-cover rounded-lg')}
        />
        <div className="absolute inset-0 rounded-lg bg-gradient-to-t from-black/10 to-transparent"></div>
      </div>
    </div>
  );
};