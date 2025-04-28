"use client";
import { chat } from "@/app/request/api";
import { useAppSelector, useAppDispatch } from "@/app/store/hooks";
import { handleSSEResponse } from "@/app/utils/api";
import { useEffect, useState, useRef } from "react";
import PreviewThinking from "./preview-thinking";
import PreviewLoader from "./preview-loader";
import Markdown from "react-markdown";
// 定义消息结构，包含内容和思考过程
interface Message {
  content: string;
  reasoningContent?: string;
}

export default function PreviewStepOne() {
  const Step1 = useAppSelector((state: any) => state.userReducer.from.step1);
  const region = useAppSelector(
    (state: any) => state.userReducer.config.region
  );
  const language = useAppSelector(
    (state: any) => state.userReducer.config.language
  );
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [partialOutput, setPartialOutput] = useState<string>("");

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const fullMessageRef = useRef<string>("");
  const typingIndexRef = useRef<number>(0);
  const prevStep1Ref = useRef<string | null>(null);

  // 生成基于模板的消息
  const generateTemplateMessage = () => {
    const lines = [];

    // 根据提供的模板生成消息
    if (Step1?.name && Step1.name.trim() !== "") {
      lines.push(
        `Hello! I'm your assistant, ${Step1.name.trim()}. It's my great honor to serve you.`
      );
    }

    if (Step1?.gender) {
      lines.push(`Let me introduce myself. I'm of ${Step1.gender} gender.`);
    }

    if (Step1?.character && Step1.character.trim() !== "") {
      lines.push(
        `I have a distinct personality, possessing traits such as ${Step1.character.trim()} and I look forward to providing you with an intimate and unique interactive experience.`
      );
    }

    const regionName = region?.find(
      (item: any) => item.id === Step1?.region
    )?.name;
    if (regionName) {
      lines.push(`I come from the charming ${regionName}.`);
    }

    const languageName = language?.find(
      (item: any) => item.id === Step1?.language
    )?.name;
    if (languageName) {
      lines.push(
        `In our future communication, I will communicate with you entirely in ${languageName} to ensure smooth interaction.`
      );
    }

    // 如果没有任何内容，使用默认消息
    if (lines.length === 0) {
      return "Hello! I'm your KOL Agent assistant. It's a pity that you haven't set some of my attributes yet. By default, I will serve you with a friendly and enthusiastic attitude. Although I haven't been assigned a specific region of origin for now, I'm always ready to go beyond geographical boundaries to help you solve problems. In terms of communication, I will communicate with you in Chinese by default. If you have other needs in the future, you can adjust it at any time. I'm looking forward to starting a pleasant and efficient interactive journey with you.";
    }

    return lines.join("\n");
  };

  // 开始逐字打印
  const startTyping = (message: string) => {
    // 清理之前可能的计时器
    if (typingTimerRef.current) {
      clearTimeout(typingTimerRef.current);
    }

    fullMessageRef.current = message;
    typingIndexRef.current = 0;
    setLoading(true);
    setPartialOutput("");

    // 开始打字效果
    typeMessage();
  };

  // 逐字打印效果
  const typeMessage = () => {
    if (typingIndexRef.current < fullMessageRef.current.length) {
      setPartialOutput(
        fullMessageRef.current.substring(0, typingIndexRef.current + 1)
      );
      typingIndexRef.current++;

      // 随机打字速度，更自然，但速度调快一点
      const randomDelay = Math.floor(Math.random() * 5) + 5; // 5-10ms之间的随机延迟

      typingTimerRef.current = setTimeout(typeMessage, randomDelay);
    } else {
      // 打字结束后，仅设置一条消息
      setMessages([
        {
          content: fullMessageRef.current,
          reasoningContent: "",
        },
      ]);
      setLoading(false);
      setPartialOutput("");
    }
  };

  // 在组件挂载时执行一次，负责初始消息的设置
  useEffect(() => {
    const hasInitialContent =
      Step1 &&
      Object.keys(Step1).some((key) => {
        if (key === "name" || key === "character") {
          return Step1[key] && Step1[key].trim() !== "";
        }
        return !!Step1[key];
      });

    const defaultMessage =
      "Hello! I'm your KOL Agent assistant. It's a pity that you haven't set some of my attributes yet. By default, I will serve you with a friendly and enthusiastic attitude. Although I haven't been assigned a specific region of origin for now, I'm always ready to go beyond geographical boundaries to help you solve problems. In terms of communication, I will communicate with you in Chinese by default. If you have other needs in the future, you can adjust it at any time. I'm looking forward to starting a pleasant and efficient interactive journey with you.";

    if (hasInitialContent) {
      // 如果已有内容，生成模板消息并显示
      const templateMessage = generateTemplateMessage();
      // 直接设置消息，避免打字效果
      setMessages([
        {
          content: templateMessage,
          reasoningContent: "",
        },
      ]);
    } else {
      // 如果没有内容，使用默认消息
      setMessages([
        {
          content: defaultMessage,
          reasoningContent: "",
        },
      ]);
    }

    // 初始化引用变量，防止后续比较出错
    prevStep1Ref.current = Step1 ? JSON.stringify(Step1) : null;
  }, []); // 仅在组件挂载时执行一次

  // 处理Step1变化的useEffect
  useEffect(() => {
    // 避免初始渲染时重复处理
    if (prevStep1Ref.current === null) {
      return;
    }

    const currentStepJSON = Step1 ? JSON.stringify(Step1) : null;
    if (prevStep1Ref.current === currentStepJSON) {
      return;
    }

    prevStep1Ref.current = currentStepJSON;

    // 检查Step1是否有实际内容
    const hasContent =
      Step1 &&
      Object.keys(Step1).some((key) => {
        if (key === "name" || key === "character") {
          return Step1[key] && Step1[key].trim() !== "";
        }
        return !!Step1[key];
      });

    // 清除之前的消息
    setMessages([]);

    // 如果没有内容，重置为默认消息
    if (!hasContent) {
      const defaultMessage =
        "Hello! I'm your KOL Agent assistant. It's a pity that you haven't set some of my attributes yet. By default, I will serve you with a friendly and enthusiastic attitude. Although I haven't been assigned a specific region of origin for now, I'm always ready to go beyond geographical boundaries to help you solve problems. In terms of communication, I will communicate with you in Chinese by default. If you have other needs in the future, you can adjust it at any time. I'm looking forward to starting a pleasant and efficient interactive journey with you.";

      setMessages([
        {
          content: defaultMessage,
          reasoningContent: "",
        },
      ]);
      return;
    }

    // 取消之前的定时器
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    if (typingTimerRef.current) {
      clearTimeout(typingTimerRef.current);
    }

    // 生成模板消息
    const templateMessage = generateTemplateMessage();

    // 立即开始打字
    startTyping(templateMessage);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      if (typingTimerRef.current) {
        clearTimeout(typingTimerRef.current);
      }
    };
  }, [Step1, region, language]);

  return (
    <div className="px-4 space-y-4 text-md">
      {messages.length > 0 &&
        messages.map((message, index) =>
          message.content.split("\n").map((line, lineIndex) => (
            <div key={`${index}-${lineIndex}`} className="space-y-2">
              <div className="bg-background rounded-md px-2 py-2 relative">
                <Markdown>{line}</Markdown>
              </div>
            </div>
          ))
          // <div key={index} className="space-y-2">
          //   <div className="bg-background rounded-md px-2 py-2">
          //     <Markdown>{message.content}</Markdown>
          //   </div>
          // </div>
        )}

      {/* 显示正在加载/打字的内容 */}
      {loading && (
        <div className="space-y-2">
          {/* 实时输出内容 */}
          <div className="bg-background/80 rounded-md px-2 py-2 relative">
            <Markdown>{partialOutput}</Markdown>
          </div>
        </div>
      )}
    </div>
  );
}
