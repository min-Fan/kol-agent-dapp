"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAccount } from "wagmi";
import EvmConnect from "@/app/components/evm-connect";

export default function SubscribeDialog({
  TriggerButton,
}: {
  TriggerButton: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const { address } = useAccount();

  // 处理连接钱包按钮点击
  const handleConnectClick = () => {
    // 先关闭当前对话框
    setIsOpen(false);

    // 可以添加一个短暂延迟，确保当前对话框已完全关闭
    // setTimeout(() => {
    //   // 这里可以添加任何需要在对话框关闭后执行的代码
    // }, 100);
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
      }}
      modal={true}
    >
      <DialogTrigger asChild>{TriggerButton}</DialogTrigger>
      <DialogContent
        className="w-full lg:w-[400px] text-primary p-0 overflow-hidden border-none"
        onPointerDownOutside={(e) => {
          // 阻止点击外部区域关闭对话框
          e.preventDefault();
        }}
        onInteractOutside={(e) => {
          // 阻止与外部区域交互关闭对话框
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>
            <h1 className="text-lg font-bold text-center p-6 bg-gradient-to-r from-[#0bbdb6]/90 to-[#00d179]/90 text-foreground">
              Add your Payment details
            </h1>
          </DialogTitle>
          <DialogDescription className="hidden"></DialogDescription>
        </DialogHeader>
        <div className="w-full flex flex-col items-center justify-center gap-2 p-4 pt-0">
          <div className="w-full border rounded-md p-4 flex items-center justify-between bg-slate-100 text-md">
            <span className="text-slate-500">Sliver - 1 mounths</span>
            <span className="font-bold">$100</span>
          </div>
          <div className="w-full flex flex-col items-center justify-center gap-2">
            <div className="w-full flex items-center justify-between">
              <span className="text-md">Total</span>
              <span className="text-secondary font-bold text-xl">100 USDT</span>
            </div>
          </div>
          <div className="w-full h-[1px] border border-dashed"></div>
          <div className="w-full mt-2">
            {address ? (
              <Button className="w-full font-bold" variant="primary">
                Subscribe
              </Button>
            ) : (
              // 包装EvmConnect组件，添加点击事件
              <div onClick={handleConnectClick}>
                <EvmConnect />
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
