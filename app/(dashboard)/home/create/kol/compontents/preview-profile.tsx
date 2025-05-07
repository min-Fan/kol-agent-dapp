"use client";
import Image from "next/image";
import { Link, CalendarDays } from "lucide-react";

import banner from "@/app/assets/image/banner.png";
import avatar from "@/app/assets/image/avatar.png";
import { formatJoinedDate } from "@/app/utils/date-utils";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppSelector } from "@/app/store/hooks";
import { useEffect, useState, useRef } from "react";
import { chat } from "@/app/request/api";
import { handleSSEResponse } from "@/app/utils/api";
import CountUp from "@/app/components/comm/CountUp";
import dynamic from "next/dynamic";
// import { DotLottieReact } from "@lottiefiles/dotlottie-react";
const DotLottieReact = dynamic(() => import('@lottiefiles/dotlottie-react').then(mod => mod.DotLottieReact), {
  ssr: false,
})
export default function PreviewProfile() {
  const Step1 = useAppSelector((state: any) => state.userReducer.from.step1);
  const [description, setDescription] = useState<string>("");
  const [reasoning, setReasoning] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [partialOutput, setPartialOutput] = useState<string>("");
  const [partialReasoning, setPartialReasoning] = useState<string>("");
  const [descriptionGenerated, setDescriptionGenerated] = useState<boolean>(false);

  // 修改状态管理
  const [currentCount, setCurrentCount] = useState<number>(0); // 当前计数值
  const [nextCount, setNextCount] = useState<number>(100); // 下一个计数值
  const [key, setKey] = useState<number>(0); // 用于强制重新渲染

  // 添加用于跟踪定时器的ref
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const prevCharacterRef = useRef<string>("");

  // 处理计数结束的函数
  const handleCountEnd = () => {
    // 清除任何现有的定时器
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // 设置新的定时器，1秒后增加随机数
    timerRef.current = setTimeout(() => {
      // 生成1-1000之间的随机数
      const randomIncrement = Math.floor(Math.random() * 1000) + 1;

      // 更新当前计数为之前的nextCount
      setCurrentCount(nextCount);

      // 计算新的nextCount
      setNextCount(nextCount + randomIncrement);

      // 更新key以强制重新渲染CountUp组件
      setKey((prevKey) => prevKey + 1);

      timerRef.current = null;
    }, 2000); // 1秒延迟
  };

  // 检查Step1是否所有必要字段都已填写
  const isStep1Complete = () => {
    // 检查Step1是否存在
    if (!Step1) return false;

    // 定义必要字段列表
    const requiredFields = [
      "name",
      "gender",
      "character",
      "region",
      "language",
    ];

    // 检查每个必要字段是否存在且不为空
    return requiredFields.every(
      (field) =>
        Step1[field] !== undefined &&
        Step1[field] !== null &&
        Step1[field] !== "" &&
        Step1[field] !== 0
    );
  };

  // 组件卸载时清理定时器
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const generateDescription = async () => {
    try {
      // 如果已经生成过描述，直接返回
      if (descriptionGenerated || !Step1.character) return;
      
      setLoading(true);
      setPartialOutput(""); // 清空之前的部分输出
      setPartialReasoning(""); // 清空之前的推理过程输出

      const response: any = await chat({
        messages: [
          {
            content: `length is limited to 100 characters, don't need to output how many characters it is, just plain content, nothing else.`,
            role: "system",
          },
          {
            content: `Hi, please generate a short description for kol, his character is ${Step1.character}`,
            role: "user",
          },
        ],
      });

      // 处理流式响应，传入回调函数以更新部分输出
      const { content, reasoningContent } = await handleSSEResponse(
        response,
        (text: string, reasoningText: string) => {
          setPartialOutput(text); // 更新实时输出
          setPartialReasoning(reasoningText); // 更新推理过程输出
        }
      );

      // 设置最终描述和推理过程
      console.log("生成的描述:", content);
      console.log("推理过程:", reasoningContent);
      setDescription(content);
      setReasoning(reasoningContent);
      
      // 标记为已生成
      setDescriptionGenerated(true);
    } catch (error) {
      console.error("生成描述失败:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // 如果已经生成过描述或没有character，则直接返回
    if (descriptionGenerated || !Step1.character) return;

    prevCharacterRef.current = Step1.character;

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      generateDescription();
      timerRef.current = null;
    }, 500);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [Step1.character, descriptionGenerated]);

  const fullUserInfo = useAppSelector(
    (state: any) => state.userReducer.twitter_full_profile
  );
  return (
    <div className="text-md">
      <div className="h-30 relative bg-primary/10">
        <Image src={banner} alt="banner" fill className="object-cover" />
        <div className="absolute bottom-0 left-4 w-20 h-20 rounded-full bg-muted-foreground border-4 translate-y-1/2 border-background overflow-hidden">
          {/* {fullUserInfo.profile_image_url ? (
            <img
              src={fullUserInfo.profile_image_url}
              alt=""
              className="w-full h-full object-cover"
            />
          ) : ( */}
            <Image src={avatar} alt="avatar" fill />
          {/* )} */}
        </div>
      </div>
      <div className="p-4 space-y-2">
        <div className="h-6"></div>
        <dl className="flex flex-col gap-1">
          <dt className="h-7">
            {Step1.name ? (
              <h1 className="text-xl font-bold">
                {/* {fullUserInfo.username ? fullUserInfo.username : Step1.name} */}
                {Step1.name}
              </h1>
            ) : (
              <h1 className="text-xl font-bold">Agent</h1>
              // <Skeleton className="w-20 h-7" />
            )}
          </dt>
          <dd className="text-muted-foreground h-4">
            {Step1.name ? (
              <span className="text-md">
                @
                {/* {fullUserInfo.screen_name
                  ? fullUserInfo.screen_name
                  : Step1.name} */}
                {Step1.name}
              </span>
            ) : (
              <span className="text-md">
                @Agent
              </span>
              // <Skeleton className="w-24 h-4" />
            )}
          </dd>
        </dl>
        <div className="text-muted-foreground min-h-4">
          {/* {fullUserInfo.description ? (
            <p className="text-sm line-clamp-3 overflow-hidden text-ellipsis">
              {fullUserInfo.description}
            </p>
          ) : ( */}
            <>
              {loading ? (
                // 在加载时显示部分输出
                partialOutput ? (
                  <div className="relative">
                    <p className="text-sm line-clamp-3 overflow-hidden text-ellipsis">
                      {partialOutput}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <Skeleton className="w-full h-3" />
                    <Skeleton className="w-[80%] h-3" />
                    <Skeleton className="w-[60%] h-3" />
                  </div>
                )
              ) : description ? (
                <p className="text-sm line-clamp-3 overflow-hidden text-ellipsis">
                  {description}
                </p>
              ) : (
                <div className="space-y-1">
                  <span className="text-md">Hello!</span>
                  {/* <Skeleton className="w-full h-3" />
                  <Skeleton className="w-[80%] h-3" />
                  <Skeleton className="w-[60%] h-3" /> */}
                </div>
              )}
            </>
          {/* )} */}
        </div>
        <ul className="flex space-x-4 items-center">
          <li className="flex items-center space-x-1">
            <Link className="w-4 h-4 text-muted-foreground" />
            <span className="text-blue-500 underline">kol-agent.com</span>
          </li>
          <li className="flex items-center space-x-1">
            <CalendarDays className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              {formatJoinedDate(new Date())}
            </span>
          </li>
        </ul>
        <ul className="flex space-x-4 items-center">
          <li className="space-x-1">
            <CountUp
              from={0}
              to={1}
              separator=","
              direction="up"
              duration={1}
              className="count-up-text font-bold text-md"
            />
            <span className="text-muted-foreground">Following</span>
          </li>
          <li className="space-x-1 flex items-center">
            <div className="relative inline-flex items-center justify-center">
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 pointer-events-none">
                <DotLottieReact
                  className="w-[200px]"
                  src="/lottie/like.lottie"
                  loop
                  autoplay
                />
              </div>
              <CountUp
                key={key}
                from={currentCount}
                to={nextCount}
                separator=","
                direction="up"
                duration={1}
                className="count-up-text font-bold text-md relative z-10"
                onEnd={handleCountEnd}
              />
            </div>
            <span className="text-muted-foreground">Followers</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
