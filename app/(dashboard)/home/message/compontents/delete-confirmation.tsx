"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { deleteAgent } from "@/app/request/api";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useGetAgents } from "@/app/hooks/useGetAgents";
import { useGetInfo } from "@/app/hooks/useGetInfo";
import { useGetConst } from "@/app/hooks/useGetConst";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function DeleteConfirmation(props: {
  children: React.ReactNode;
}) {
  const { children } = props;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpen, setOpen] = useState<boolean>(false);
  const { agentId } = useParams();
  const { getAgents } = useGetAgents();
  const { getInfo } = useGetInfo();
  const { getConst } = useGetConst();
  const router = useRouter();

  const handleCancel = () => {
    setOpen(false);
  };

  const handleConfirm = async () => {
    try {
      setIsLoading(true);
      const res = await deleteAgent(agentId + "");
      setIsLoading(false);
      if (res && res.code === 200) {
        toast.success("Agent deleted successfully");
        getConst();
        getAgents();
        getInfo();
        router.push("/home");
        setOpen(false);
      } else {
        toast.warning(
          <div className="flex gap-2 items-center justify-between">
            <div className="flex flex-col gap-2">
              {/* <p>You currently have incomplete orders that cannot be deleted.</p> */}
              <p>{res?.msg}</p>
            </div>
            <Link href={`/home/order`}>
              <Button variant="outline">
                <span className="capitalize">View</span>
              </Button>
            </Link>
          </div>
        );
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete agent");
      setIsLoading(false);
    }
  };

  // 处理点击删除按钮事件
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();

    // 检查订单列表是否为空
    // if (!orderList || orderList.length === 0) {
    //   // 订单列表为空，打开删除确认弹窗
    //   setOpen(true);
    // } else {
    // 订单列表不为空，显示提示消息
  };

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-xs min-w-[200px] text-primary">
        <DialogHeader>
          <DialogTitle className="text-center text-primary font-bold text-xl capitalize">
            Are you sure you want to delete?
          </DialogTitle>
          <DialogDescription className="text-center text-gray-500 text-sm">
            Once deleted, the Agent will stop working and cannot be restored.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-center space-x-4">
          <Button variant="outline" onClick={handleCancel}>
            <span className="capitalize">Cancel</span>
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="size-4 min-w-4 animate-spin" />
            ) : (
              <span className="capitalize">Delete</span>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
