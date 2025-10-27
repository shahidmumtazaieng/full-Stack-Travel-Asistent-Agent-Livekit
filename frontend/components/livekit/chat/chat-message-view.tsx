'use client';

import { type RefObject, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

export function useAutoScroll(scrollContentContainerRef: RefObject<Element | null>) {
  useEffect(() => {
    function scrollToBottom() {
      const { scrollingElement } = document;

      if (scrollingElement) {
        scrollingElement.scrollTop = scrollingElement.scrollHeight;
      }
    }

    if (scrollContentContainerRef.current) {
      const resizeObserver = new ResizeObserver(scrollToBottom);

      resizeObserver.observe(scrollContentContainerRef.current);
      scrollToBottom();

      return () => resizeObserver.disconnect();
    }
  }, [scrollContentContainerRef]);
}
interface ChatProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
}

export const ChatMessageView = ({ className, children, ...props }: ChatProps) => {
  const scrollContentRef = useRef<HTMLDivElement>(null);

  useAutoScroll(scrollContentRef);

  return (
    <div 
      ref={scrollContentRef} 
      className={cn(
        'flex flex-col justify-end',
        'bg-white/50 dark:bg-gray-900/50',
        'backdrop-blur-sm',
        'border border-gray-200 dark:border-gray-700',
        'rounded-2xl p-4',
        'shadow-sm shadow-gray-200/50 dark:shadow-gray-900/50',
        className
      )} 
      {...props}
    >
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
};