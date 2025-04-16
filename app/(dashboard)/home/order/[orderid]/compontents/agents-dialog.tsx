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
import AnimatedList from "@/app/components/comm/AnimatedList";
import { getAgentList } from "@/app/request/api";
import { useAppSelector } from "@/app/store/hooks";
import { useEffect } from "react";
import { Mars, Power, PowerOff, Venus } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AgentsDialog({name, selectedAgent}: {name: string, selectedAgent: (agent: any) => void}) {
  const [agents, setAgents] = useState<any[]>([]);
  const isLoggedIn = useAppSelector((state) => state.userReducer.isLoggedIn);
  const getAgents = async () => {
    const res = await getAgentList();
    if (res && res.code === 200) {
      setAgents(res.data);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      getAgents();
    }
  }, [isLoggedIn]);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="primary" className="h-10 w-full">
          <span className="text-base font-bold">{name}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="w-lg min-w-[300px] text-primary">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">
            Select Agent
          </DialogTitle>
          <DialogDescription>
            Select a agent to use for your order
          </DialogDescription>
        </DialogHeader>
        <div className="w-full max-h-[400px]">
          <AnimatedList
            items={agents.map((agent: any) => (
              <div
                className={cn(
                  "w-full flex items-center justify-between bg-gray-100 rounded-md p-2 hover:bg-gray-200 cursor-pointer",
                  agent.status !== "RUNING" && "opacity-50 pointer-events-none"
                )}
                key={agent.id}
                onClick={() => selectedAgent(agent)}
              >
                <div className="flex flex-col gap-1 w-full">
                  <div className="text-md font-bold flex items-center gap-1">
                    {agent.name} {agent.sex === "male" ? <Mars className="w-4 h-4 text-blue-500" /> : <Venus className="w-4 h-4 text-pink-500" />} ({agent.region})
                  </div>
                  <span className="text-sm text-gray-500">{agent.abilitys}</span>
                </div>
                {agent.status == "RUNING" ? (
                  <Power className="size-4 min-w-4 text-green-500" />
                ) : (
                  <PowerOff className="size-4 min-w-4 text-red-500" />
                )}
              </div>
            ))}
            showGradients={true}
            enableArrowNavigation={true}
            displayScrollbar={true}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
