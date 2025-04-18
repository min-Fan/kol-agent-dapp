"use client";
import React, { useState } from "react";
import Link from "next/link";
import { ChevronLeft, Play, Power } from "lucide-react";

import { Button } from "@/components/ui/button";

import TurnOffConfirmation from "../compontents/turn-off-confirmation";
import { useAppSelector } from "@/app/store/hooks";
import { useRouter, useParams } from "next/navigation";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { AgentStatus } from "@/app/store/reducers/typs";
export default function Layout({ children }: { children: React.ReactNode }) {
  const agents = useAppSelector((state) => state.userReducer.agents);
  const { agentId } = useParams();
  const isLoggedIn = useAppSelector(
    (state: any) => state.userReducer.isLoggedIn
  );
  const router = useRouter();
  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/home");
    }
  }, [isLoggedIn]);
  return (
    <div className="w-full h-full overflow-hidden flex">
      <div className="w-full h-full overflow-hidden flex flex-col flex-1 box-border p-2 md:p-4 lg:p-6">
        <div className="w-full flex items-center justify-between shadow-[0_10px_10px_20px_rgba(251,249,250,1)] pb-4">
          <Link href="/home">
            <div className="flex items-center gap-2">
              <ChevronLeft className="w-6 h-6" />
              <h1 className="text-base font-bold">Message</h1>
            </div>
          </Link>
          <TurnOffConfirmation
            isTurnOff={
              agents.find((agent) => agent.id == Number(agentId))?.status ===
              AgentStatus.RUNING
            }
          >
            <Button
              variant="outline"
              className="flex gap-2 hover:bg-foreground hover:text-destructive-foreground"
            >
              {agents.find((agent) => agent.id == Number(agentId))?.status ===
              AgentStatus.RUNING ? (
                <Power className="size-4 min-w-4 text-destructive" />
              ) : (
                <Play className="size-4 min-w-4 text-secondary" />
              )}
              <span
                className={cn(
                  "text-md font-bold",
                  agents.find((agent) => agent.id == Number(agentId))
                    ?.status === AgentStatus.RUNING
                    ? "text-destructive"
                    : "text-secondary"
                )}
              >
                {agents.find((agent) => agent.id == Number(agentId))?.status ===
                AgentStatus.RUNING
                  ? "Turn Off"
                  : "Turn On"}
              </span>
            </Button>
          </TurnOffConfirmation>
        </div>
        <div className="w-full flex-1 overflow-auto">{children}</div>
      </div>
    </div>
  );
}
