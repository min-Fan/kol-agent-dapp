import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CountUp from "@/app/components/comm/CountUp";
import Image from "next/image";
import avatar from "@/app/assets/image/avatar.png";
import PreviewPost from "./preview-post";
import MockMessage from "./mockMesasge";

interface EarningMessage {
  id: number;
  amount: number;
  showPlusAnimation: boolean;
  startCounterAnimation: boolean;
  minutesAgo: number;
  showProjectMessage: boolean;
  showYourMessage: boolean;
}

const texts = [
  "CZ Agent发表话题关键次有：Layer2、Web3、RWA，发表的内容应该与Layer2、Web3、RWA行业相关，通过搜索该行业最新热点，撰写每日热点内容，发布话带有#Layer2、#Web3、#RWA标签",
  "CZ Agent发表话题关键次有：Layer2、Web3、RWA，发表的内容应该与Layer2、Web3、RWA行业相关，通过搜索该行业最新热点，撰写每日热点内容，发布话带有#Layer2、#Web3、#RWA标签",
];

// --- 模拟数据和逻辑 ---
// // 在实际应用中，你需要从父组件或其他状态管理获取
// const useSimulatedMessages = () => {
//   const [messages, setMessages] = useState<string[]>([]);
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setMessages((prev) => [
//         ...prev,
//         `New earning event at ${new Date().toLocaleTimeString()}`,
//       ]);
//     }, 5000); // 每5秒模拟一次收益增加
//     return () => clearInterval(interval);
//   }, []);
//   return messages;
// };
// --- 模拟结束 ---

export default function PreviewStepSix() {
  // 引用计时器，避免闭包问题
  const timersRef = useRef<NodeJS.Timeout[]>([]);
  const [messages, setMessages] = useState<EarningMessage[]>([]);
  const [previousTotal, setPreviousTotal] = useState(0);
  const [showTotalAnimation, setShowTotalAnimation] = useState(false);
  const earningsIncrease = 100;

  // 计算总收益
  const totalEarnings = messages.reduce(
    (sum, msg) => (msg.showYourMessage ? sum + msg.amount : sum),
    0
  );

  // 当总收益变化时触发动画
  // useEffect(() => {
  //   if (totalEarnings > previousTotal) {
  //     setShowTotalAnimation(true);
  //     const timer = setTimeout(() => {
  //       setShowTotalAnimation(false);
  //       setPreviousTotal(totalEarnings);
  //     }, 800); // 动画持续时间
  //     return () => clearTimeout(timer);
  //   }
  // }, [totalEarnings, previousTotal]);

  // 处理动画序列
  // useEffect(() => {
  //   // 清理之前的所有计时器
  //   timersRef.current.forEach((timer) => clearTimeout(timer));
  //   timersRef.current = [];

  //   // 创建5条初始消息（全部隐藏）
  //   const initialMessages: EarningMessage[] = [];
  //   for (let i = 0; i < 5; i++) {
  //     initialMessages.push({
  //       id: i,
  //       amount: earningsIncrease,
  //       showPlusAnimation: false,
  //       startCounterAnimation: false,
  //       minutesAgo: Math.floor(Math.random() * 15) + 1,
  //       showProjectMessage: false,
  //       showYourMessage: false,
  //     });
  //   }
  //   setMessages(initialMessages);

  //   // 为每条消息设置顺序显示的计时器
  //   for (let i = 0; i < 5; i++) {
  //     // 消息之间的间隔时间（秒）
  //     const messageDelay = i * 4000;

  //     // 1. 显示项目方消息
  //     const timer1 = setTimeout(() => {
  //       setMessages((prev) =>
  //         prev.map((msg, idx) =>
  //           idx === i ? { ...msg, showProjectMessage: true } : msg
  //         )
  //       );
  //     }, messageDelay);
  //     timersRef.current.push(timer1);

  //     // 2. 显示收益消息和+100动画
  //     const timer2 = setTimeout(() => {
  //       setMessages((prev) =>
  //         prev.map((msg, idx) =>
  //           idx === i
  //             ? {
  //                 ...msg,
  //                 showYourMessage: true,
  //                 showPlusAnimation: true,
  //               }
  //             : msg
  //         )
  //       );
  //     }, messageDelay + 1000);
  //     timersRef.current.push(timer2);

  //     // 3. 隐藏+100动画
  //     const timer3 = setTimeout(() => {
  //       setMessages((prev) =>
  //         prev.map((msg, idx) =>
  //           idx === i ? { ...msg, showPlusAnimation: false } : msg
  //         )
  //       );
  //     }, messageDelay + 1500);
  //     timersRef.current.push(timer3);

  //     // 4. 开始数字计数动画
  //     const timer4 = setTimeout(() => {
  //       setMessages((prev) =>
  //         prev.map((msg, idx) =>
  //           idx === i ? { ...msg, startCounterAnimation: true } : msg
  //         )
  //       );
  //     }, messageDelay + 1800);
  //     timersRef.current.push(timer4);
  //   }

  //   // 组件卸载时清理所有计时器
  //   return () => {
  //     timersRef.current.forEach((timer) => clearTimeout(timer));
  //   };
  // }, []);

  return (
    <div className="px-4 space-y-4 relative">
      {/* 固定在顶部的总数统计 */}
      {/* <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-sm rounded-md p-3 shadow mb-4">
        <h3 className="text-base mb-1 text-primary">总收入</h3>
        <div className="relative">
          <div className="text-3xl font-bold text-green-600 flex items-end gap-2">
            <CountUp
              from={previousTotal}
              to={totalEarnings}
              duration={0.8}
              separator=","
              className="font-bold"
            />
            <span className="text-secondary text-base font-bold">USDT</span>

            <AnimatePresence>
              {showTotalAnimation && (
                <motion.div
                  initial={{ opacity: 0, y: 0, scale: 0.8, x: 0 }}
                  animate={{ opacity: 1, y: -25, scale: 1.2, x: 5 }}
                  exit={{ opacity: 0, y: -50, scale: 0.5, x: 15 }}
                  transition={{ duration: 0.5 }}
                  className="absolute left-0 text-xl font-bold text-green-500"
                >
                  +{earningsIncrease}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div> */}

      {/* 对话消息列表 */}
      <div className="space-y-6">
        <MockMessage></MockMessage>
        {/* {messages.map((message) => (
          <div key={message.id} className="flex flex-col gap-4">
            <AnimatePresence>
              {message.showProjectMessage && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="w-full flex items-start gap-2"
                >
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                    <Image
                      className="w-full h-full object-cover"
                      src={avatar}
                      alt="avatar"
                      width={avatar.width}
                      height={avatar.height}
                    />
                  </div>
                  <div className="bg-background rounded-md px-2 py-2 w-full">
                    <p className="text-md text-gray-700">
                      The project team placed an order {message.minutesAgo}{" "}
                      minutes ago. Payment amount: 100 USDT
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {message.showYourMessage && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="flex items-start self-end"
                >
                  <div className="bg-green-50 rounded-lg rounded-tr-none px-4 py-2 relative">
                    <p className="text-md text-gray-700 flex items-center">
                      <span>profit: </span>
                      <div className="relative ml-1">
                        <div className="inline-block font-bold text-lg text-green-600">
                          <CountUp
                            from={0}
                            to={
                              message.startCounterAnimation ? message.amount : 0
                            }
                            duration={1}
                            separator=","
                            className="count-up-text font-bold"
                          />
                          <span className="ml-1 text-sm font-normal">USDT</span>
                        </div>

                        <AnimatePresence>
                          {message.showPlusAnimation && (
                            <motion.strong
                              key={`plus-animation-${message.id}`}
                              initial={{ opacity: 0, y: 0, scale: 0.8 }}
                              animate={{ opacity: 1, y: -30, scale: 1.2 }}
                              exit={{ opacity: 0, y: -50, scale: 0.5 }}
                              transition={{ duration: 0.3 }}
                              className="absolute left-0 top-0 font-bold text-green-500 whitespace-nowrap z-10"
                            >
                              +{message.amount}
                            </motion.strong>
                          )}
                        </AnimatePresence>
                      </div>
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))} */}
      </div>
      {/* {messages?.length && (
        <FloatingMessages
          messages={["+100 USDT", "+100 USDT", "+100 USDT"]}
        ></FloatingMessages>
      )} */}
    </div>
  );
}
