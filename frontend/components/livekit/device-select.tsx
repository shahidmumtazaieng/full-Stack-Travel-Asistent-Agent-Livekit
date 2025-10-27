'use client';

import { useLayoutEffect, useState } from 'react';
import { cva } from 'class-variance-authority';
import { LocalAudioTrack, LocalVideoTrack } from 'livekit-client';
import { useMaybeRoomContext, useMediaDeviceSelect } from '@livekit/components-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { CaretUpDown } from '@phosphor-icons/react/dist/ssr';

type DeviceSelectProps = React.ComponentProps<typeof SelectTrigger> & {
  kind: MediaDeviceKind;
  track?: LocalAudioTrack | LocalVideoTrack | undefined;
  requestPermissions?: boolean;
  onMediaDeviceError?: (error: Error) => void;
  initialSelection?: string;
  onActiveDeviceChange?: (deviceId: string) => void;
  onDeviceListChange?: (devices: MediaDeviceInfo[]) => void;
  variant?: 'default' | 'small';
};

const selectVariants = cva(
  [
    'w-full rounded-xl px-3 py-2 text-sm cursor-pointer',
    'bg-white/80 dark:bg-gray-800/80',
    'backdrop-blur-sm',
    'border border-gray-200 dark:border-gray-700',
    'shadow-sm shadow-gray-200/50 dark:shadow-gray-900/50',
    'disabled:not-allowed hover:bg-gray-100/80 focus:bg-gray-100/80',
    'transition-colors duration-200',
  ],
  {
    variants: {
      size: {
        default: 'w-[180px]',
        sm: 'w-auto',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

export function DeviceSelect({
  kind,
  track,
  requestPermissions,
  onMediaDeviceError,
  // initialSelection,
  // onActiveDeviceChange,
  // onDeviceListChange,
  ...props
}: DeviceSelectProps) {
  const size = props.size || 'default';

  const [open, setOpen] = useState(false);
  const [requestPermissionsState, setRequestPermissionsState] = useState(requestPermissions);

  const room = useMaybeRoomContext();
  const { devices, activeDeviceId, setActiveMediaDevice } = useMediaDeviceSelect({
    kind,
    room,
    track,
    requestPermissions: requestPermissionsState,
    onError: onMediaDeviceError,
  });

  // When the select opens, ensure that media devices are re-requested in case when they were last
  // requested, permissions were not granted
  useLayoutEffect(() => {
    if (open) {
      setRequestPermissionsState(true);
    }
  }, [open]);

  return (
    <Select
      value={activeDeviceId}
      onValueChange={setActiveMediaDevice}
      open={open}
      onOpenChange={setOpen}
    >
      <SelectTrigger className={cn(selectVariants({ size }), props.className)}>
        <div className="flex items-center gap-2">
          {size !== 'sm' && (
            <SelectValue className="font-medium text-sm truncate" placeholder={`Select a ${kind}`} />
          )}
          <CaretUpDown weight="bold" className="w-4 h-4 text-gray-500" />
        </div>
      </SelectTrigger>
      <SelectContent className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg">
        {devices
          .filter((d) => d.deviceId !== '')
          .map((device) => (
            <SelectItem 
              key={device.deviceId} 
              value={device.deviceId} 
              className="font-medium text-sm px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
            >
              {device.label}
            </SelectItem>
          ))}
      </SelectContent>
    </Select>
  );
}