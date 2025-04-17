"use client";

import React, { useEffect, useState } from "react";
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
import { updateAgentStatus } from "@/app/request/api";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { updateAgentItem } from "@/app/store/reducers/userSlice";
import { Agent, AgentStatus } from "@/app/store/reducers/typs";
export default function TurnOffConfirmation(props: {
  children: React.ReactNode;
  isTurnOff: boolean;
}) {
  const { children, isTurnOff } = props;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpen, setOpen] = useState<boolean>(false);
  const { agentId } = useParams();
  const agents = useAppSelector((state) => state.userReducer.agents);
  const dispatch = useAppDispatch();

  const handleCancel = () => {
    setOpen(false);
  };

  const handleConfirm = async () => {
    try {
      setIsLoading(true);
      const res = await updateAgentStatus(agentId + "", {
        status: isTurnOff ? "CLOSE" : "RUNING",
      });
      setIsLoading(false);
      if (res && res.code === 200) {
        dispatch(
          updateAgentItem({
            ...agents.find((agent) => agent.id == Number(agentId)),
            status: isTurnOff ? AgentStatus.CLOSE : AgentStatus.RUNING,
          } as Agent)
        );
        setOpen(false);
        toast.success("Agent status updated successfully");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to update agent status");
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-xs min-w-[200px] text-primary">
        <DialogHeader>
          <DialogTitle className="text-center text-primary font-bold text-xl capitalize">
            {isTurnOff ? "turn off confirmation" : "turn on confirmation"}
          </DialogTitle>
          <DialogDescription className="text-center text-gray-500 text-sm">
            {isTurnOff
              ? "Turning off will terminate any currently running tasks. Are you sure you want to proceed?"
              : "Turning on will resume any currently running tasks. Are you sure you want to proceed?"}
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-center space-x-4">
          <Button variant="outline" onClick={handleCancel}>
            <span className="capitalize">cancel</span>
          </Button>
          <Button
            variant="primary"
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="size-4 min-w-4 animate-spin" />
            ) : (
              <span className="capitalize">
                {!isTurnOff ? "turn on" : "turn off"}
              </span>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
