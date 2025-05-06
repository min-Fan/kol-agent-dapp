"use client";
import React, { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronLeft, Play, Power } from "lucide-react";

import { Button } from "@/components/ui/button";

import TurnOffConfirmation from "../compontents/turn-off-confirmation";
import { useAppSelector } from "@/app/store/hooks";
import { useRouter, useParams } from "next/navigation";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { AgentStatus } from "@/app/store/reducers/typs";
import DeleteConfirmation from "../compontents/delete-confirmation";
import { Trash, Loader2 } from "lucide-react";
import { getOrderList } from "@/app/request/api";
import { DatumOrder } from "@/app/types/types";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
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

  const userAgent = useMemo(() => {
    return agents.find((agent) => agent.id === Number(agentId));
  }, [agentId]);

  return (
    <div className="w-full h-full overflow-hidden flex bg-[rgba(239,239,239,1)]">
      <div className="w-full h-full overflow-hidden flex flex-col flex-1 box-border">
        <div className="w-full min-h-[77px] bg-[rgba(255,255,255,0.75)]  flex items-center justify-between px-8 box-border gap-2">
          <div className="flex items-center gap-4">
            <div className="max-w-110 items-center flex gap-2">
              <img
                src={userAgent?.icon}
                alt=""
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="text-md font-bold text-slate-900">
                  {userAgent?.name} (@{userAgent?.x_username})
                </p>
                <p className="text-gray-500 text-sm "> {userAgent?.abilitys}</p>
              </div>
            </div>
            <div className="bg-[rgba(136,187,243,0.15)] rounded-md py-1 px-2 ">
              <div className="text-[#5c99f4] text-sm">
                {userAgent?.sex} | Smart and clever
              </div>
              <div className="flex">
                {userAgent?.characters.map((item: any) => {
                  return <Badge className="bg-[#5C99F4]">{item}</Badge>;
                })}
              </div>
            </div>
          </div>

          <TurnOffConfirmation
            isTurnOff={
              agents.find((agent) => agent.id == Number(agentId))?.status ===
              AgentStatus.RUNING
            }
          >
            <Switch
              className={cn(
                agents.find((agent) => agent.id == Number(agentId))?.status ===
                  AgentStatus.RUNING
                  ? "bg-[linear-gradient(90deg,_#88BBF3_0%,_#5C99F4_100%)]"
                  : "bg-[#e1e1e1]"
              )}
              checked={
                agents.find((agent) => agent.id == Number(agentId))?.status ===
                AgentStatus.RUNING
                  ? true
                  : false
              }
            ></Switch>
            {/* <Button
                variant="outline"
                className="flex gap-2 hover:bg-foreground hover:text-destructive-foreground w-full"
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
                  {agents.find((agent) => agent.id == Number(agentId))
                    ?.status === AgentStatus.RUNING
                    ? "Turn Off"
                    : "Turn On"}
                </span>
              </Button> */}
          </TurnOffConfirmation>
        </div>

        {/* <Link href="/home">
            <div className="flex items-center gap-2">
              <ChevronLeft className="w-6 h-6" />
              <h1 className="text-base font-bold">Message</h1>
            </div>
          </Link>
          <div className="flex items-center gap-2">
           
          </div> */}
        <div className="w-full flex-1 h-full overflow-hidden ">{children}</div>
      </div>
    </div>
  );
}
