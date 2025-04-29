import React, { useEffect, useState } from "react";
import Markdown from "react-markdown";

interface TypingParagraphsProps {
  messages: string[];
}

const TypingParagraphs: React.FC<TypingParagraphsProps> = ({ messages }) => {
  const [currentText, setCurrentText] = useState<string[]>([]);
  const [currentMessageIndex, setCurrentMessageIndex] = useState<number>(0);
  const [charIndex, setCharIndex] = useState<number>(0);

  const getRandomSpeed = () => Math.floor(Math.random() * 5) + 5;  // 50~150ms

  // 每次 messages 变化时，重置打字状态
  useEffect(() => {
    setCurrentText(messages.length > 0 ? [''] : []);
    setCurrentMessageIndex(0);
    setCharIndex(0);
  }, [messages]);

  useEffect(() => {
    if (currentMessageIndex >= messages.length) return;

    const currentMessage = messages[currentMessageIndex];

    if (charIndex < currentMessage.length) {
      const timeout = setTimeout(() => {
        setCurrentText(prev => {
          const updated = [...prev];
          updated[currentMessageIndex] = (updated[currentMessageIndex] || '') + currentMessage[charIndex];
          return updated;
        });
        setCharIndex(charIndex + 1);
      }, getRandomSpeed());

      return () => clearTimeout(timeout);
    } else {
      // 当前段落打完，如果还有下一段，就准备下一个段落
      if (currentMessageIndex < messages.length - 1) {
        const timeout = setTimeout(() => {
          setCurrentText(prev => [...prev, '']);
          setCurrentMessageIndex(currentMessageIndex + 1);
          setCharIndex(0);
        }, 300); // 段落之间的间隔
        return () => clearTimeout(timeout);
      }
    }
  }, [charIndex, currentMessageIndex, messages]);

  return (
    <>
      {currentText.map((text, index) => (
        <div key={`${index}`} className="space-y-2">
          <div className="bg-background rounded-md px-2 py-2 relative">
            <Markdown>{text}</Markdown>
          </div>
        </div>
      ))}
    </>
  );
};

export default TypingParagraphs;
