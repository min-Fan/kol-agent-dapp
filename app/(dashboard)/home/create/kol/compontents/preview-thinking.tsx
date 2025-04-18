"use client";
import { useState, useEffect } from "react";
import Markdown from "react-markdown";
import { ChevronDown, ChevronUp } from "lucide-react"; // 引入展开/收起图标
import { AnimatePresence, motion } from "framer-motion"; // 引入动画库

interface PreviewThinkingProps {
  texts: string[] | string;
  isLoading?: boolean; // 是否正在加载/生成中
  currentText?: string; // 当前正在生成的文本
}

export default function PreviewThinking(props: PreviewThinkingProps) {
  const { texts, isLoading = false, currentText = "" } = props;
  const [isExpanded, setIsExpanded] = useState(true);

  // 监听 isLoading 变化
  useEffect(() => {
    if (isLoading) {
      setIsExpanded(true); // loading时展开
    } else {
      // 当loading结束时，延迟一小段时间后收起
      const timer = setTimeout(() => {
        // setIsExpanded(false);
      }, 500); // 等待500ms后收起
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  return (
    <div className="space-y-2 relative">
      <div
        className="w-full flex items-center gap-1 cursor-pointer hover:text-secondary sticky top-0"
        onClick={() => !isLoading && setIsExpanded(!isExpanded)} // 只有在非loading状态下才允许手动切换
      >
        {isExpanded ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
        <span className="text-sm font-medium">
          {isExpanded ? "Hide" : "Show"}
        </span>
      </div>

      <AnimatePresence>
        {(isExpanded || isLoading) && ( // 在loading时强制展开
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="space-y-4 border-l-2 border-secondary pl-2 text-md">
              {/* 显示已完成的思考内容 */}
              {Array.isArray(texts)
                ? texts.map((text, index) => (
                    <Markdown key={index}>{text}</Markdown>
                  ))
                : typeof texts === "string" &&
                  texts && <Markdown>{texts}</Markdown>}

              {/* 显示当前正在生成的内容，带有闪烁的光标 */}
              {isLoading && currentText && (
                <div className="relative">
                  <Markdown>{currentText}</Markdown>
                  <span className="animate-pulse inline-block ml-0.5">▌</span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
