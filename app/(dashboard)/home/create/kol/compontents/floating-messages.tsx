// components/FloatingMessages.tsx
"use client";

import { useEffect, useState, useRef, useCallback } from "react";

interface MessageItem {
  id: number;
  text: string;
}

interface FloatingMessagesProps {
  messages: string[];
}

export default function FloatingMessages({ messages }: FloatingMessagesProps) {
  const [activeMessages, setActiveMessages] = useState<MessageItem[]>([]);
  const idCounter = useRef(0);

  // 只在 messages 改变时（或首次挂载时）启动一个 interval
  useEffect(() => {
    const interval = setInterval(() => {
      if (messages.length === 0) return;
      const next = messages[Math.floor(Math.random() * messages.length)];
      // 生成唯一 id
      const newId = ++idCounter.current;
      setActiveMessages((prev) => [...prev, { id: newId, text: next }]);
    }, 1000);
    return () => clearInterval(interval);
  }, [messages]);

 
  const handleRemove = useCallback((id: number) => {
    setActiveMessages((prev) => prev.filter((item) => item.id !== id));
  }, []);

  return (
    <div className="w-full h-full overflow-hidden bg-transparent absolute top-0 left-0 pointer-events-none">
      {activeMessages.map((msg) => (
        <FloatingBubble
          key={msg.id}
          id={msg.id}
          message={msg.text}
          onRemove={handleRemove}
        />
      ))}
    </div>
  );
}

function FloatingBubble({
  id,
  message,
  onRemove,
}: {
  id: number;
  message: string;
  onRemove: (id: number) => void;
}) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(id);
    }, 3000);
    return () => clearTimeout(timer);
  }, [id]); // 这里只依赖 id，一旦挂载后三秒必触发

  return (
    <div
      className="absolute bottom-0 right-0 transform -translate-x-1/2
        animate-float-up text-sm px-4 py-2 bg-white text-black rounded-full shadow-md
        opacity-0"
    >
      {message}
    </div>
  );
}
