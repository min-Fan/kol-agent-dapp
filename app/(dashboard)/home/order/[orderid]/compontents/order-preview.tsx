"use client";
import React, { useRef, useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import OrderPreviewProfile from "./order-previewProfile";
import { OrderKol, OrderPreviewType, OrderDetail } from "@/app/types/types";
import PostContent from "./post-content";
import PostView from "./post-view";
import { useOrderPreview } from "@/app/context/OrderPreviewContext";

export default function OrderPreview({
  kol,
  orderDetail,
}: {
  kol: OrderKol;
  orderDetail: OrderDetail;
}) {
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const mouseLeaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { status, setStatus } = useOrderPreview();

  useEffect(() => {
    if (orderDetail.kol_audit_status === "pending" || orderDetail.kol_audit_status === "doing") {
      setStatus(OrderPreviewType.POST_CONTENT);
    } else {
      setStatus(OrderPreviewType.POST_VIEW);
    }
  }, [orderDetail]);

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
      const scrollContainer = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      );
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
        className="flex-1 w-full h-full overflow-auto box-border"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <ScrollArea className="w-full h-full" ref={scrollAreaRef}>
          {status === OrderPreviewType.POST_CONTENT && (
            <div className="w-full h-full p-2">
              <PostContent orderDetail={orderDetail} />
            </div>
          )}
          {status === OrderPreviewType.POST_VIEW && (
            <div className="w-full h-full p-2">
              <PostView orderDetail={orderDetail} />
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
}
