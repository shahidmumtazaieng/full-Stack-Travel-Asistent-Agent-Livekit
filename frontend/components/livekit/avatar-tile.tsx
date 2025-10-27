import { type TrackReference, VideoTrack } from '@livekit/components-react';
import { cn } from '@/lib/utils';

interface AgentAudioTileProps {
  videoTrack: TrackReference;
  className?: string;
}

export const AvatarTile = ({
  videoTrack,
  className,
  ref,
}: React.ComponentProps<'div'> & AgentAudioTileProps) => {
  return (
    <div 
      ref={ref} 
      className={cn(
        'bg-gradient-to-br from-indigo-500/20 to-purple-600/20',
        'backdrop-blur-sm border border-indigo-500/30 rounded-xl',
        'shadow-lg shadow-indigo-500/10',
        'overflow-hidden',
        className
      )}
    >
      <div className="relative w-full h-full">
        <VideoTrack
          trackRef={videoTrack}
          width={videoTrack?.publication.dimensions?.width ?? 0}
          height={videoTrack?.publication.dimensions?.height ?? 0}
          className="rounded-lg w-full h-full object-cover"
        />
        <div className="absolute inset-0 rounded-lg bg-gradient-to-t from-black/20 to-transparent"></div>
        <div className="absolute top-2 right-2">
          <div className="flex items-center justify-center w-6 h-6 bg-indigo-500 rounded-full">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};