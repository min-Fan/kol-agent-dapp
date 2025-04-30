import { useEffect, useState, useRef } from "react";
import { useAppSelector } from "@/app/store/hooks";
import { chat } from "@/app/request/api";
import { handleSSEResponse } from "@/app/utils/api";
import PreviewLoader from "./preview-loader";
import PreviewThinking from "./preview-thinking";
import PreviewPost from "./preview-post";
import Markdown from "react-markdown";
import FloatingMessages from "./floating-messages";
import TypingParagraphs from "./typingParagraphs";
// 定义消息结构
interface Message {
  tweet: string;
  reasoningContent?: string;
}

export default function PreviewStepFour() {
  const Step1 = useAppSelector((state: any) => state.userReducer.from.step1);
  const Step2 = useAppSelector((state: any) => state.userReducer.from.step2);
  const Step3 = useAppSelector((state: any) => state.userReducer.from.step3);
  const Step4 = useAppSelector((state: any) => state.userReducer.from.step4);
  const [waitingMessage, setWaitingMessage] = useState<string[]>([]);
  const prevDataRef = useRef<any>(null);
  const [message, setMessage] = useState<Message | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [partialTweet, setPartialTweet] = useState<string>("");
  const [partialReasoning, setPartialReasoning] = useState<string>("");
  const initializedRef = useRef<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const language = useAppSelector(
    (state: any) => state.userReducer.config.language
  );

  // 构建提示信息
  const buildPrompt = () => {
    let prompt = "Please act as a Twitter content generator for a KOL. ";

    // 添加KOL基本信息 (Step1)
    prompt += `The KOL's name is ${Step1.name}`;
    if (Step1.gender) prompt += `, who is a ${Step1.gender}`;
    if (Step1.character) prompt += ` with a ${Step1.character} personality`;
    prompt += ". ";

    // 添加KOL能力和特征 (Step2)
    if (Step2.ability) {
      prompt += `This KOL has the following abilities: ${Step2.ability}. `;
    }

    const languageName = language.find(
      (item: any) => item.id === Step1.language
    )?.name;
    if (languageName) {
      prompt += `The KOL speaks ${languageName}. `;
    }

    // 添加互动要求 (Step3)
    if (Step3.interactive) {
      prompt += `The KOL should interact with users interested in: ${Step3.interactive}. `;
    }

    if (Step4.topics) {
      prompt += `The KOL will engage in interactions on topics related to ${Step4.topics}. `;
    }

    // 明确生成内容的要求
    prompt += `Based on this information, please:
    1. Generate FIVE different Twitter posts (tweets) that showcase the KOL's personality and relate to their area of interest. Each tweet should be unique and under 280 characters.
    
    Format your response with "TWEETS:" followed by numbered tweets (1).`;

    return prompt;
  };

  // 解析API返回的内容
  const parseContent = (content: string): { tweet: string } => {
    let tweets: string[] = [];

    // 尝试提取推文
    const tweetsMatch = content.match(/TWEETS:([\s\S]+)/);
    if (tweetsMatch && tweetsMatch[1]) {
      // 分割推文
      tweets = tweetsMatch[1]
        .split(/\d+\./)
        .filter((line) => line.trim())
        .map((tweet) => tweet.trim());
    }

    // 如果未找到格式化的内容，尝试进行基本拆分
    if (!tweets.length) {
      tweets = content
        .split("\n")
        .filter((line) => line.trim())
        .slice(0, 5);
    }

    // 随机选择一条推文
    const randomTweet = tweets[Math.floor(Math.random() * tweets.length)] || "";

    return { tweet: randomTweet };
  };

  const hasEnoughInfo = () => {
    // 检查Step1, Step2, Step3 ,setp4是否存在且有值
    if (!Step1 || !Step2 || !Step3) return false;

    // 至少需要Step1中的名字和Step3中的互动数据
    return (
      Step1.name &&
      Step1.name.trim() !== "" &&
      Step3.interactive &&
      Step3.interactive.trim() !== "" &&
      Step4.topics &&
      Step4.topics.trim() !== ""
    );
  };

  const generateTweet = async () => {
    try {
      if (!hasEnoughInfo()) {
        console.log("Not enough information to generate content");
        return;
      }

      setLoading(true);
      setWaitingMessage([
        `The tweet topics will revolve around ${Step4?.topics.trim()} as I create and publish related content.`,
      ]);
      setPartialTweet("");
      setPartialReasoning("");

      const prompt = buildPrompt();
      console.log("Generation prompt:", prompt);

      const response: any = await chat({
        messages: [
          {
            content: prompt,
            role: "user",
          },
        ],
      });

      const { content, reasoningContent } = await handleSSEResponse(
        response,
        (text: string, reasoningText: string) => {
          const { tweet } = parseContent(text);
          setPartialTweet(tweet);
          setPartialReasoning(reasoningText);
        }
      );

      const { tweet } = parseContent(content);
      console.log("Generated tweet:", tweet);
      console.log("Reasoning process:", reasoningContent);

      if (tweet.trim() !== "") {
        setMessage({
          tweet,
          reasoningContent,
        });
      }
    } catch (error) {
      console.error("Failed to generate tweet:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const combinedData = {
      step1: Step1,
      step2: Step2,
      step3: Step3,
      step4: Step4,
    };
    const currentDataJSON = JSON.stringify(combinedData);

    // 如果数据没有变化，直接返回
    if (prevDataRef.current === currentDataJSON) return;

    // 更新之前的数据引用
    prevDataRef.current = currentDataJSON;

    // 如果没有足够的信息，直接返回
    if (!hasEnoughInfo()) return;

    // 清除任何现有的定时器
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // 设置新的定时器，延迟生成内容
    timerRef.current = setTimeout(() => {
      generateTweet();
      timerRef.current = null;
    }, 500);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
    // if (initializedRef.current) return;
    // initializedRef.current = true;
    // if (!hasEnoughInfo()) return;
    // setSetp1Message(generateTemplateMessage());
    // generateTweet();
  }, [Step1, Step2, Step3, Step4]);

  useEffect(() => {
    // 如果已经初始化过，则返回
    if (initializedRef.current) return;

    // 标记为已初始化
    initializedRef.current = true;

    // setSetp1Message(generateTemplateMessage())
    // 检查是否有足够的信息可以生成内容
    if (hasEnoughInfo()) {
      console.log(
        "Detected existing data during component initialization, generating content"
      );
      generateTweet();
    }
  }, []); // 依赖数组为空，表示只在组件挂载时执行一次

  return (
    <div className="px-4 space-y-4 text-md">
      {/* 显示思考过程 */}
      {loading && (
        <TypingParagraphs messages={waitingMessage}></TypingParagraphs>
        // <div className="space-y-2">
        //   {setp1Message.split("\n").map((line, index) => (
        //     <div key={`${index}`} className="space-y-2">
        //       <div className="bg-background rounded-md px-2 py-2 relative">
        //         <Markdown>{line}</Markdown>
        //       </div>
        //     </div>
        //   ))}
        // </div>
        // <>
        //   <PreviewLoader
        //     text={loading ? "Thinking..." : "Thought process:"}
        //     isThinking={loading && !partialTweet}
        //   />
        //   <PreviewThinking
        //     texts={loading ? partialReasoning : message?.reasoningContent || ""}
        //   />
        // </>
      )}
      {/* 显示推文 */}
      {message?.tweet && (
        <>
          <PreviewLoader text="Generated Tweet:" isThinking={false} />
          <PreviewPost content={message.tweet} />
        </>
      )}
      {/* 显示加载状态或空状态 */}
      {!loading && !message && (
        <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
          <p>Waiting for data from previous steps</p>
          <p className="text-sm">
            Please complete Steps 1-3 to generate content
          </p>
        </div>
      )}

      {/* 显示浮动消息 */}
      {message?.tweet && (
        <FloatingMessages
          messages={[
            "+1 Elon Musk is following you",
            "+1 Liam is following you",
            "+1 CNN following you",
          ]}
        ></FloatingMessages>
      )}
    </div>
  );
}
