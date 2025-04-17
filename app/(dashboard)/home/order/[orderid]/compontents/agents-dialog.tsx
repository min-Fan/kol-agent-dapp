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

export default function AgentsDialog({
  name,
  selectedAgent,
  ButtonClassName,
}: {
  name: string;
  selectedAgent: (agent: any) => void;
  ButtonClassName?: string;
}) {
  const [open, setOpen] = useState(false);
  const agents = useAppSelector((state) => state.userReducer.agents);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="primary"
          className={cn("h-10 w-full", ButtonClassName)}
        >
          <span className="text-md font-bold">{name}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="w-lg min-w-[300px] text-primary">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">Select Agent</DialogTitle>
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
                onClick={() => {
                  selectedAgent(agent);
                  setOpen(false);
                }}
              >
                <div className="flex flex-col gap-1 w-full">
                  <div className="text-md font-bold flex items-center gap-1">
                    <span className="text-md font-bold whitespace-nowrap">
                      {agent.name}
                    </span>
                    {agent.sex === "male" ? (
                      <Mars className="w-3 h-3 text-blue-500" />
                    ) : (
                      <Venus className="w-3 h-3 text-pink-500" />
                    )}{" "}
                    <span className="text-md text-gray-500 pr-2 border-r border-gray-400">
                      ({agent.region})
                    </span>
                    <div className="flex items-center gap-1 flex-wrap">
                      {agent.characters.length > 0 &&
                        agent.characters.map((character: any) => (
                          <span className="text-sm text-gray-500 bg-white rounded-md px-2">
                            {character}
                          </span>
                        ))}
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">
                    {agent.abilitys}
                  </span>
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
