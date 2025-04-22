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

export default function PreviewStepOneBack() {
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
  const [partialReasoning, setPartialReasoning] = useState<string>("");

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const prevStep1Ref = useRef<string | null>(null);

  const generateDescription = async () => {
    try {
      setPartialOutput("");
      setPartialReasoning("");

      // --- 构建 API 请求的 messages 数组 ---
      const apiMessages = [];

      // 1. 系统提示词 (System Prompt)
      const systemPrompt = `You are an assistant generating a self-introduction based on provided details. Follow these instructions strictly:
- Use the following template sentences.
- Only include a sentence if a value for its placeholder is provided in the user message.
- Substitute the placeholder (e.g., $[Name]) with the provided value.
- Output each included sentence on a new line.
- If the user message indicates 'No values provided', output the default message exactly.

Template Sentences:
1. Hello! I'm your assistant, $[Name]. It's my great honor to serve you.
2. Let me introduce myself. I'm of $[Gender] gender.
3. I have a distinct personality, possessing traits such as $[Character], and I look forward to providing you with an intimate and unique interactive experience.
4. I come from the charming $[Region].
5. In our future communication, I will communicate with you entirely in $[Language] to ensure smooth interaction.

Default Message (use only if no values provided):
"Hello! I'm your KOL Agent assistant. It's a pity that you haven't set some of my attributes yet. By default, I will serve you with a friendly and enthusiastic attitude. Although I haven't been assigned a specific region of origin for now, I'm always ready to go beyond geographical boundaries to help you solve problems. In terms of communication, I will communicate with you in Chinese by default. If you have other needs in the future, you can adjust it at any time. I'm looking forward to starting a pleasant and efficient interactive journey with you."
`;
      apiMessages.push({ role: "system", content: systemPrompt });

      // 2. 用户消息 (User Prompt) - 包含实际值
      let userPromptContent = "";
      const providedValues: string[] = [];
      let hasValues = false;

      // Name
      if (Step1?.name && Step1.name.trim() !== "") {
        providedValues.push(`- Name: ${Step1.name.trim()}`);
        hasValues = true;
      }
      // Gender
      if (Step1?.gender) {
        providedValues.push(`- Gender: ${Step1.gender}`);
        hasValues = true;
      }
      // Character
      if (Step1?.character && Step1.character.trim() !== "") {
        providedValues.push(`- Character: ${Step1.character.trim()}`);
        hasValues = true;
      }
      // Region
      const regionName = region?.find(
        (item: any) => item.id === Step1?.region
      )?.name;
      if (regionName) {
        providedValues.push(`- Region: ${regionName}`);
        hasValues = true;
      }
      // Language
      const languageName = language?.find(
        (item: any) => item.id === Step1?.language
      )?.name;
      if (languageName) {
        providedValues.push(`- Language: ${languageName}`);
        hasValues = true;
      }

      if (hasValues) {
        userPromptContent =
          "Generate the introduction based on the following provided values:\n" +
          providedValues.join("\n");
      } else {
        userPromptContent =
          "No values provided. Please generate the default message.";
      }
      apiMessages.push({ role: "user", content: userPromptContent });
      // --- 结束构建 messages 数组 ---

      console.log("API Messages:", apiMessages);

      const response: any = await chat({ messages: apiMessages });

      // 处理流式响应
      const { content, reasoningContent } = await handleSSEResponse(
        response,
        (text: string, reasoningText: string) => {
          setPartialOutput(text);
          setPartialReasoning(reasoningText);
        }
      );

      console.log("生成的对话:", content);
      console.log("思考过程:", reasoningContent);

      // 保存最终消息
      setMessages([
        {
          content: content,
          reasoningContent: reasoningContent,
        },
      ]);
    } catch (error) {
      console.error("生成对话失败:", error);
      setMessages([
        { content: "抱歉，生成描述时遇到错误。", reasoningContent: "" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // 处理Step1变化的useEffect
  useEffect(() => {
    const currentStepJSON = Step1 ? JSON.stringify(Step1) : null;
    if (prevStep1Ref.current === currentStepJSON) {
      return;
    }
    prevStep1Ref.current = currentStepJSON;
    
    // 检查Step1是否有实际内容
    const hasContent = Step1 && Object.keys(Step1).some(key => {
      if (key === 'name' || key === 'character') {
        return Step1[key] && Step1[key].trim() !== '';
      }
      return !!Step1[key];
    });
    
    if (!hasContent) {
      // 没有内容，设置默认消息
      setMessages([{
        content: "Hello! I'm your KOL Agent assistant. It's a pity that you haven't set some of my attributes yet. By default, I will serve you with a friendly and enthusiastic attitude. Although I haven't been assigned a specific region of origin for now, I'm always ready to go beyond geographical boundaries to help you solve problems. In terms of communication, I will communicate with you in Chinese by default. If you have other needs in the future, you can adjust it at any time. I'm looking forward to starting a pleasant and efficient interactive journey with you."
      }]);
      setLoading(false);
      return;
    }

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    setMessages([]);
    setPartialOutput("");
    setPartialReasoning("");
    setLoading(true);

    timerRef.current = setTimeout(() => {
      console.log("触发生成描述 (useEffect)");
      generateDescription();
      timerRef.current = null;
    }, 500);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [Step1, region, language]);

  // 组件初始化时设置默认消息
  useEffect(() => {
    // 检查是否有任何输入
    const hasInitialContent = Step1 && Object.keys(Step1).some(key => {
      if (key === 'name' || key === 'character') {
        return Step1[key] && Step1[key].trim() !== '';
      }
      return !!Step1[key];
    });
    
    if (!hasInitialContent) {
      setMessages([{
        content: "Hello! I'm your KOL Agent assistant. It's a pity that you haven't set some of my attributes yet. By default, I will serve you with a friendly and enthusiastic attitude. Although I haven't been assigned a specific region of origin for now, I'm always ready to go beyond geographical boundaries to help you solve problems. In terms of communication, I will communicate with you in Chinese by default. If you have other needs in the future, you can adjust it at any time. I'm looking forward to starting a pleasant and efficient interactive journey with you."
      }]);
      setLoading(false);
    }
  }, []);

  return (
    <div className="px-4 space-y-4 text-md">
      {messages.length > 0 &&
        messages.map((message, index) => (
          <div key={index} className="space-y-2">
            {/* 显示思考过程 */}
            {message.reasoningContent && !loading && (
              <>
                <PreviewLoader text={"Thought process:"} isThinking={false} />
                <PreviewThinking texts={message.reasoningContent} />
              </>
            )}
            {/* 显示主要内容 */}
            <div className="bg-background rounded-md px-2 py-2">
              <Markdown>{message.content}</Markdown>
            </div>
          </div>
        ))}

      {/* 显示正在加载的内容 */}
      {loading && (
        <div className="space-y-2">
          {/* 实时思考过程 */}
          {partialReasoning && (
            <>
              <PreviewLoader text="Thinking..." isThinking={true} />
              <PreviewThinking texts={partialReasoning} />
            </>
          )}
          {/* 如果只有 thinking 图标 */}
          {!partialReasoning && !partialOutput && (
            <PreviewLoader text="Thinking..." isThinking={true} />
          )}
          {/* 实时输出内容 */}
          {partialOutput && (
            <div className="bg-background/80 rounded-md px-2 py-2 relative">
              <Markdown>{partialOutput}</Markdown>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
