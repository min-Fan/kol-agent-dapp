"use client";
import { chat } from "@/app/request/api";
import { useAppSelector, useAppDispatch } from "@/app/store/hooks";
import { handleSSEResponse } from "@/app/utils/api";
import { useEffect, useState, useRef } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { clearFrom } from "@/app/store/reducers/userSlice";
import PreviewThinking from "./preview-thinking";
import PreviewLoader from "./preview-loader";
import Markdown from "react-markdown";
import PreviewRepost from "./preview-repost";
import PreviewPost from "./preview-post";
import TypingParagraphs from "./typingParagraphs";

// 定义消息结构，包含内容和思考过程
interface Message {
  content: string;
  reasoningContent?: string;
}

export default function PreviewStepTwo() {
  const Step1 = useAppSelector((state: any) => state.userReducer.from.step1);
  const Step2 = useAppSelector((state: any) => state.userReducer.from.step2);
  const [defaultMessage, setDefaultMessage] = useState<string[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [partialOutput, setPartialOutput] = useState<string>("");
  const [partialReasoning, setPartialReasoning] = useState<string>("");
  const dispatch = useAppDispatch();
  const language = useAppSelector(
    (state: any) => state.userReducer.config.language
  );
  // 添加逐字输出相关的状态和引用
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  // const typingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const fullMessageRef = useRef<string>("");
  const typingIndexRef = useRef<number>(0);
  const prevDataRef = useRef<any>(null);
  const initializedRef = useRef<boolean>(false);
  const apiResponseReceivedRef = useRef<boolean>(false);

  // 添加一个引用来追踪默认消息是否正在输出
  const isDefaultMessageTypingRef = useRef<boolean>(false);
  // 添加一个引用来存储API返回的消息，等待默认消息输出完毕后使用
  const pendingApiResponseRef = useRef<{
    content: string;
    reasoningContent: string;
  } | null>(null);

  // 添加标记，跟踪组件是否处于激活状态
  const componentActiveRef = useRef<boolean>(true);

  // 逐字打印效果函数
  // const typeMessage = (message: string, isDefault: boolean = false) => {
  //   // 清理之前可能的计时器
  //   if (typingTimerRef.current) {
  //     clearTimeout(typingTimerRef.current);
  //   }

  //   // 设置是否为默认消息标志
  //   isDefaultMessageTypingRef.current = isDefault;

  //   fullMessageRef.current = message;
  //   typingIndexRef.current = 0;
  //   setLoading(true);
  //   setPartialOutput("");

  //   // 开始打字效果
  //   // typeNextChar();
  // };

  // 逐字打印的递归函数
  // const typeNextChar = () => {
  //   if (typingIndexRef.current < fullMessageRef.current.length) {
  //     setPartialOutput(
  //       fullMessageRef.current.substring(0, typingIndexRef.current + 1)
  //     );
  //     typingIndexRef.current++;

  //     // 随机打字速度，更自然
  //     const randomDelay = Math.floor(Math.random() * 10) + 0; // 20-50ms之间的随机延迟

  //     typingTimerRef.current = setTimeout(typeNextChar, randomDelay);
  //   } else {
  //     // 打字结束，保存完整消息
  //     setMessages((prev) => [
  //       ...prev,
  //       {
  //         content: fullMessageRef.current,
  //         reasoningContent: "",
  //       },
  //     ]);
  //     setLoading(false);
  //     setPartialOutput("");

  //     // 检查打字完成后是否为默认消息，且是否有待处理的API响应
  //     if (isDefaultMessageTypingRef.current && pendingApiResponseRef.current) {
  //       // 设置一个短暂延迟，让用户有时间查看默认消息
  //       setTimeout(() => {
  //         // 显示API返回的消息
  //         setMessages((prev) => [
  //           ...prev,
  //           {
  //             content: pendingApiResponseRef.current!.content,
  //             reasoningContent: pendingApiResponseRef.current!.reasoningContent,
  //           },
  //         ]);
  //         // 清空待处理响应
  //         pendingApiResponseRef.current = null;
  //         // 重置默认消息标志
  //         isDefaultMessageTypingRef.current = false;
  //       }, 500); // 500ms延迟，可根据需要调整
  //     } else {
  //       // 重置默认消息标志
  //       isDefaultMessageTypingRef.current = false;
  //     }
  //   }
  // };

  // 检查是否有足够的信息可以生成描述
  const hasEnoughInfo = () => {
    // 检查Step2是否存在且有值
    if (!Step2 || Object.keys(Step2).length === 0) return false;

    // 至少需要一个非空的字段
    return Object.values(Step2).some(
      (value) => value !== undefined && value !== null && value !== ""
    );
  };

  // 构建默认消息，替换变量
  const buildDefaultMessage = () => {
    // 从Step2中获取能力相关信息
    // const ability = Step2?.ability || "advanced abilities";
    // const abilityDescription =
    //   Step2?.abilityDescription || "help you achieve your goals effectively";

    // // 替换消息模板中的变量
    // let message =
    //   "You have chosen $[Ability] and I will acquire $[Ability.description]. Moreover, I will use these abilities to post tweets and interact with KOLs and followers.";

    // message = message.replace("$[Ability]", ability);
    // message = message.replace("$[Ability.description]", abilityDescription);
    if (Step2?.ability) {
      return `You have chosen ${Step2?.name}, and I will acquire  ${Step2?.ability} Moreover, I will use these abilities to post tweets and interact with KOLs and followers.`;
    }
    return "Once the ability is selected, the Agent will immediately acquire and activate this function.";
  };

  // 构建提示信息，结合Step1和Step2的值
  const buildPrompt = () => {
    let prompt =
      "Please create a comprehensive personality profile for my KOL agent, ";

    // 添加名称（如果有）
    if (Step1?.name && Step1.name.trim() !== "") {
      prompt += `named ${Step1.name}, `;
    } else {
      prompt += "who ";
    }

    // 添加Step1的基本信息
    const basicInfo = [];

    if (Step1?.gender) {
      basicInfo.push(`is a ${Step1.gender}`);
    }

    const regionName = Step1?.region
      ? typeof Step1.region === "object"
        ? Step1.region.name
        : Step1.region
      : "";
    if (regionName) {
      basicInfo.push(`from ${regionName}`);
    }

    if (Step1?.character && Step1.character.trim() !== "") {
      basicInfo.push(`with ${Step1.character} character`);
    }

    const languageName = language.find(
      (item: any) => item.id === Step1.language
    )?.name;
    if (languageName) {
      basicInfo.push(`speaking ${languageName}`);
    }

    if (basicInfo.length > 0) {
      prompt += basicInfo.join(", ") + ". ";
    }

    // 添加Step2的详细性格特征
    prompt += "Based on the following personality traits and background: ";

    // 转换Step2对象为字符串描述
    const traits = Object.entries(Step2)
      .filter(
        ([_, value]) => value !== undefined && value !== null && value !== ""
      )
      .map(
        ([key, value]) =>
          `${key.replace(/([A-Z])/g, " $1").toLowerCase()}: ${value}`
      )
      .join("; ");

    if (traits) {
      prompt += traits + ". ";
    }

    // 添加请求生成内容的指示
    prompt += `Please create a detailed personality profile that captures their essence, writing style, tone, and key characteristics. Divide the response into multiple paragraphs focusing on different aspects of their personality.`;

    return prompt;
  };

  const generateDescription = async () => {
    try {
      // 检查是否至少有一些内容可以生成
      if (!hasEnoughInfo()) {
        console.log("没有足够的信息可以生成描述");
        return;
      }

      // 重置状态，确保清除之前的可能影响
      setLoading(true);
      console.log("生成描述开始");
      setDefaultMessage([buildDefaultMessage()]);
      setPartialOutput("");
      setPartialReasoning("");
      apiResponseReceivedRef.current = false;
      pendingApiResponseRef.current = null;

      // 标记组件为激活状态
      componentActiveRef.current = true;

      // 强制清除并重置所有已有的计时器
      // if (timeoutRef.current) {
      //   clearTimeout(timeoutRef.current);
      //   timeoutRef.current = null;
      // }

      // if (typingTimerRef.current) {
      //   clearTimeout(typingTimerRef.current);
      //   typingTimerRef.current = null;
      // }

      // 仅在组件初始化的useEffect外调用generateDescription时设置超时计时器
      // if (!timeoutRef.current) {
      //   console.log("设置1秒超时计时器");
      //   timeoutRef.current = setTimeout(() => {
      //     // 如果组件仍然激活且1秒内API没有响应，使用默认消息
      //     if (componentActiveRef.current && !apiResponseReceivedRef.current) {
      //       console.log("API响应超时，使用默认消息");

      //       setDefaultMessage([buildDefaultMessage()]);
      //       // typeMessage(defaultMessage, true); // 标记为默认消息
      //     }
      //     timeoutRef.current = null;
      //   }, 1000);
      // }

      const prompt = buildPrompt();
      console.log("生成提示:", prompt);

      try {
        const response: any = await chat({
          messages: [
            {
              content: prompt,
              role: "user",
            },
          ],
        });

        // 只有在组件仍然激活时才处理API响应
        if (componentActiveRef.current) {
          // 标记API已响应
          apiResponseReceivedRef.current = true;

          // 清除超时计时器
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
          }

          const { content, reasoningContent } = await handleSSEResponse(
            response,
            () => {}
          );

          console.log("生成的对话:", content);
          console.log("思考过程:", reasoningContent);

          // 检查内容是否为空字符串
          if (!content || content.trim() === "") {
            console.log("生成的内容为空，不添加消息");
          } else if (isDefaultMessageTypingRef.current) {
            // 如果默认消息正在输出，将API响应存储为待处理
            console.log("默认消息正在输出，存储API响应");
            pendingApiResponseRef.current = {
              content,
              reasoningContent,
            };
          } else {
            // 直接添加API响应消息
            setMessages((prevMessages) => [
              ...prevMessages,
              {
                content: content,
                reasoningContent: reasoningContent,
              },
            ]);
            setLoading(false);
          }
        }
      } catch (error) {
        // 如果组件仍然激活且API请求失败，且超时计时器还未触发，使用默认消息
        if (
          componentActiveRef.current &&
          !apiResponseReceivedRef.current &&
          !timeoutRef.current &&
          !isDefaultMessageTypingRef.current
        ) {
          console.log("API请求失败，使用默认消息");
          setDefaultMessage([buildDefaultMessage()]);
          // typeMessage(defaultMessage, true); // 标记为默认消息
        }
        throw error;
      }
    } catch (error) {
      console.error("生成对话失败:", error);
      if (componentActiveRef.current && !isDefaultMessageTypingRef.current) {
        setLoading(false);
      }
    } finally {
      // 只有在组件激活且没有输出默认消息时才重置加载状态
      if (
        componentActiveRef.current &&
        apiResponseReceivedRef.current &&
        !isDefaultMessageTypingRef.current
      ) {
        setLoading(false);
      }
    }
  };

  const currentStep = useAppSelector(
    (state: any) => state.userReducer.config.currentStep
  );

  // 监听数据变化的useEffect
  useEffect(() => {
    // 创建一个包含Step1和Step2的组合数据对象
    const combinedData = { step1: Step1, step2: Step2 };
    const currentDataJSON = JSON.stringify(combinedData);

    // 如果数据没有变化，直接返回
    if (prevDataRef.current === currentDataJSON) return;

    // 更新之前的数据引用
    prevDataRef.current = currentDataJSON;

    // 如果没有足够的信息，直接返回
    if (!hasEnoughInfo()) return;

    // 组件标记为激活状态
    componentActiveRef.current = true;

    // 清除任何现有的定时器
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // 设置新的定时器，延迟生成描述
    timerRef.current = setTimeout(() => {
      if (componentActiveRef.current) {
        generateDescription();
      }
      timerRef.current = null;
    }, 500);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      // if (typingTimerRef.current) {
      //   clearTimeout(typingTimerRef.current);
      // }
    };
  }, [Step1, Step2, currentStep]);

  // 添加一个新的useEffect，专门处理组件挂载和卸载
  useEffect(() => {
    // 组件挂载时，设置为激活状态
    componentActiveRef.current = true;

    // setDefaultMessage([""]);
    setDefaultMessage([buildDefaultMessage()])

    // 如果未初始化过，启动初始化流程
    if (!initializedRef.current) {
      initializedRef.current = true;

      // 检查是否有足够的信息可以生成描述
      if (hasEnoughInfo()) {
        console.log("组件初始化时检测到已有数据，开始生成描述");

        // 重置状态，确保清除之前的可能影响
        setLoading(true);
        setPartialOutput("");
        setPartialReasoning("");
        apiResponseReceivedRef.current = false;
        pendingApiResponseRef.current = null;

        // 设置1秒超时计时器
        // timeoutRef.current = setTimeout(() => {
        //   // 如果组件仍然激活且1秒内API没有响应，使用默认消息
        //   if (componentActiveRef.current && !apiResponseReceivedRef.current) {
        //     console.log("初始化API响应超时，使用默认消息");
        //     // setDefaultMessage([buildDefaultMessage()]);
        //     // typeMessage(defaultMessage, true); // 标记为默认消息
        //   }
        //   timeoutRef.current = null;
        // }, 1000);

        // 然后再调用generateDescription
        generateDescription();
      }
    }

    // 组件卸载时的清理
    return () => {
      // 标记组件为非激活状态
      componentActiveRef.current = false;

      // 清理所有计时器
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      // if (typingTimerRef.current) {
      //   clearTimeout(typingTimerRef.current);
      //   typingTimerRef.current = null;
      // }
    };
  }, []); // 依赖数组为空，表示只在组件挂载和卸载时执行

  return (
    <div className="px-4 space-y-4 text-md">
      {messages.length > 0 &&
        messages.map((message, index) => (
          <div key={index} className="space-y-2">
            {/* 显示主要内容 */}
            {/* <div className="bg-background rounded-md px-2 py-2 break-words">
              <Markdown>{message.content}</Markdown>
            </div> */}
            <PreviewPost
              content={`🤖 Hello! I'm your exclusive ${Step1.gender} AI assistant ${Step1.name}.🌟 Personality Traits | ${Step1.character}🗺 Cultural Background | An expert in [Language] from [Region]`}
              key="preview-post"
            />
          </div>
        ))}

      {/* 显示正在加载的内容 */}
      {/* {loading && (
        <div className="space-y-2">
          {partialReasoning && (
            <>
              <PreviewLoader text="Thinking..." isThinking={loading} />
              <PreviewThinking texts={partialReasoning} />
            </>
          )}

          {partialOutput && (
            <div className="bg-background rounded-md px-2 py-2 relative break-words">
              <Markdown>{partialOutput}</Markdown>
            </div>
          )}

          {!partialOutput && !partialReasoning && (
            <PreviewLoader text="Thinking..." isThinking={loading} />
          )}
        </div>
      )} */}

      {(loading || messages.length === 0) && (
        <TypingParagraphs messages={defaultMessage}></TypingParagraphs>
      )}
    </div>
  );
}
