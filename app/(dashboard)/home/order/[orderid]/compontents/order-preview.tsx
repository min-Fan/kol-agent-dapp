'use client'
import React, { useRef, useState, useEffect } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import OrderPreviewProfile from './order-previewProfile';
import { OrderKol } from '@/app/types/types';

export default function OrderPreview({ kol }: { kol: OrderKol }) {
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const mouseLeaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    setShouldAutoScroll(false);
    
    if (mouseLeaveTimerRef.current) {
      clearTimeout(mouseLeaveTimerRef.current);
      mouseLeaveTimerRef.current = null;
    }
  };

  const handleMouseLeave = () => {
    if (mouseLeaveTimerRef.current) {
      clearTimeout(mouseLeaveTimerRef.current);
    }
    
    mouseLeaveTimerRef.current = setTimeout(() => {
      setShouldAutoScroll(true);
      scrollToBottom();
      mouseLeaveTimerRef.current = null;
    }, 500);
  };
  const scrollToBottom = () => {
    if (shouldAutoScroll && scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  };
  return (
    <div className="w-full bg-foreground h-dvh flex flex-col">
      <div className="border-b border-border">
        <OrderPreviewProfile info={kol} />
      </div>
      <div 
        className="flex-1 w-full h-full overflow-auto box-border py-4"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <ScrollArea className="w-full h-full" ref={scrollAreaRef}>
          
        </ScrollArea>
      </div>
    </div>
  )
}
