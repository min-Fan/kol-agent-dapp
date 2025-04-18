import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CountUp from "@/app/components/comm/CountUp";

interface EarningMessage {
  id: number;
  amount: number;
  showPlusAnimation: boolean;
  startCounterAnimation: boolean;
  minutesAgo: number;
}

const texts = [
  "CZ Agent发表话题关键次有：Layer2、Web3、RWA，发表的内容应该与Layer2、Web3、RWA行业相关，通过搜索该行业最新热点，撰写每日热点内容，发布话带有#Layer2、#Web3、#RWA标签",
  "CZ Agent发表话题关键次有：Layer2、Web3、RWA，发表的内容应该与Layer2、Web3、RWA行业相关，通过搜索该行业最新热点，撰写每日热点内容，发布话带有#Layer2、#Web3、#RWA标签",
];

// --- 模拟数据和逻辑 ---
// 在实际应用中，你需要从父组件或其他状态管理获取
const useSimulatedMessages = () => {
  const [messages, setMessages] = useState<string[]>([]);
  useEffect(() => {
    const interval = setInterval(() => {
      setMessages((prev) => [
        ...prev,
        `New earning event at ${new Date().toLocaleTimeString()}`,
      ]);
    }, 5000); // 每5秒模拟一次收益增加
    return () => clearInterval(interval);
  }, []);
  return messages;
};
// --- 模拟结束 ---

export default function PreviewStepSix() {
  const [messages, setMessages] = useState<EarningMessage[]>([]);
  const [previousTotal, setPreviousTotal] = useState(0);
  const [showTotalAnimation, setShowTotalAnimation] = useState(false);
  const earningsIncrease = 100;
  const plusAnimationDuration = 0.3 + 0.6;
  const counterDelay = plusAnimationDuration * 1000 * 0.7;

  // 计算总收益
  const totalEarnings = messages.reduce((sum, msg) => sum + msg.amount, 0);

  // 当总收益变化时触发动画
  useEffect(() => {
    if (totalEarnings > previousTotal) {
      setShowTotalAnimation(true);
      const timer = setTimeout(() => {
        setShowTotalAnimation(false);
        setPreviousTotal(totalEarnings);
      }, 800); // 动画持续时间
      return () => clearTimeout(timer);
    }
  }, [totalEarnings, previousTotal]);

  const addMessage = () => {
    const newMessageId = Date.now();
    // 生成一个 1 到 15 之间的随机分钟数
    const randomMinutes = Math.floor(Math.random() * 15) + 1;
    const newMessage: EarningMessage = {
      id: newMessageId,
      amount: earningsIncrease,
      showPlusAnimation: true,
      startCounterAnimation: false,
      minutesAgo: randomMinutes,
    };

    setMessages((prev) => [...prev, newMessage]);

    setTimeout(() => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === newMessageId ? { ...msg, showPlusAnimation: false } : msg
        )
      );
    }, plusAnimationDuration * 1000);

    setTimeout(() => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === newMessageId
            ? { ...msg, startCounterAnimation: true }
            : msg
        )
      );
    }, counterDelay);
  };

  useEffect(() => {
    addMessage();
    const interval = setInterval(addMessage, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="px-4 space-y-4">
      {/* 固定在顶部的总数统计 */}
      <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-sm rounded-md p-3 shadow mb-4">
        <h3 className="text-base mb-1 text-primary">Total Revenue</h3>
        <div className="relative">
          {/* 总数显示 */}
          <div className="text-3xl font-bold text-green-600 flex items-end gap-2">
            <CountUp
              from={previousTotal}
              to={totalEarnings}
              duration={0.8}
              separator=","
              className="font-bold"
            />
            <span className="text-secondary text-base font-bold">USDT</span>
            
            {/* 总数增加动画 */}
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
      </div>

      {/* 消息列表 */}
      <div className="space-y-3"> {/* 给列表项之间加点间距 */}
        {messages.map((message) => (
          <div
            key={message.id}
            className="bg-background rounded-md px-3 py-2 relative min-h-[40px] shadow-sm" // 增加内边距和阴影
          >
            <p className="inline text-md"> {/* 调整文本样式 */}
              The project team placed an order {message.minutesAgo} minutes ago. Payment:{" "} {/* 使用随机分钟数 */}
            </p>
            {/* +100 动画容器 */}
            <div className="inline-block relative w-0 h-6 align-middle mx-1"> {/* 调整宽度和边距 */}
              <AnimatePresence>
                {message.showPlusAnimation && (
                  <motion.strong
                    key={`plus-animation-${message.id}`}
                    initial={{ opacity: 0, y: 0, scale: 0.8, x: 0 }}
                    animate={{ opacity: 1, y: -25, scale: 1.2, x: 5 }}
                    exit={{ opacity: 0, y: -50, scale: 0.5, x: 15 }}
                    transition={{ duration: 0.3 }}
                    className="absolute left-0 top-0 font-bold text-green-500 whitespace-nowrap z-10"
                  >
                    +{message.amount}
                  </motion.strong>
                )}
              </AnimatePresence>
            </div>
            {/* 数字滚动 */}
            <div className="inline-block font-bold text-lg text-secondary">
              {/* 假设 CountUp 能通过 start 属性触发 */}
              <CountUp
                from={0} // 从0开始
                to={message.startCounterAnimation ? message.amount : 0} // 触发时滚动到目标值
                duration={1} // 滚动持续时间
                separator=","
                className="count-up-text font-bold"
              />
            </div>
            <p className="inline text-md text-muted-foreground"> USDT.</p> {/* 调整文本样式 */}
          </div>
        ))}
      </div>
    </div>
  );
}
