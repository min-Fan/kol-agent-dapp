"use client";
import TwitterView from "@/app/components/home/TwitterView";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronLeft, Zap } from "lucide-react";
import Link from "next/link";
import React from "react";
import Preview from "./compontents/preview";
import { useDispatch, useSelector } from "react-redux";
import { updateConfig, updateFrom } from "@/app/store/reducers/userSlice";

export default function Layout({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const config = useSelector((state: any) => state.userReducer.config);

  // 快速创建函数
  const quickCreate = () => {
    // 步骤1默认值
    const step1Default = {
      name: "Kol Agent",
      gender: "male",
      character: config.character[0]?.name,
      region: config.region[0]?.id || 1,
      language: config.language[0]?.name || "English",
    };

    // 步骤2默认值
    const step2Default = {
      ability: config.ability[0]?.desc,
    };

    // 步骤3默认值
    const step3Default = {
      interactive: config.kols[0]?.name,
    };

    // 步骤4默认值
    const step4Default = {
      topics: config.topics[0]?.name,
    };

    // 步骤5默认值
    const step5Default = {
      post: String(1),
      repost: String(1),
      quote: String(1),
      likes: String(1),
      reply: String(1),
      comment: String(1),
    };

    // 更新Redux状态
    dispatch(updateFrom({ key: "step1", value: step1Default }));
    dispatch(updateFrom({ key: "step2", value: step2Default }));
    dispatch(updateFrom({ key: "step3", value: step3Default }));
    dispatch(updateFrom({ key: "step4", value: step4Default }));
    dispatch(updateFrom({ key: "step5", value: step5Default }));

    // 设置当前步骤为第6步
    dispatch(updateConfig({ key: "currentStep", value: 6 }));
  };

  return (
    <div className="w-full h-full overflow-hidden grid grid-cols-24">
      <div className="col-span-16 h-full overflow-hidden flex flex-col flex-1 box-border p-2 md:p-4 lg:p-6">
        <div className="w-full flex items-center justify-between shadow-[0_10px_10px_20px_rgba(251,249,250,1)] pb-4">
          <Link href="/home">
            <div className="flex items-center gap-2">
              <ChevronLeft className="w-6 h-6" />
              <h1 className="text-base font-bold">Create Your Agent</h1>
            </div>
          </Link>
          <Button
            variant="outline"
            className="flex gap-2"
            onClick={quickCreate}
          >
            <Zap className="w-4 h-4" />
            <span className="text-md">Create Quickly</span>
          </Button>
        </div>
        <div className="w-full flex-1 overflow-auto">{children}</div>
      </div>
      <div className="col-span-8 h-full overflow-hidden bg-foreground shadow-md">
        <Preview />
      </div>
    </div>
  );
}
