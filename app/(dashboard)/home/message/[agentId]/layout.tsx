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
import DeleteConfirmation from "../compontents/delete-confirmation";
import { Trash, Loader2 } from "lucide-react";
import { getOrderList } from "@/app/request/api";
import { DatumOrder } from "@/app/types/types";
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
    <div className="w-full h-full overflow-hidden flex ">
      <div className="w-full h-full overflow-hidden flex flex-col flex-1 box-border p-2 md:p-4 lg:p-6">
        <div className="w-full flex items-center justify-between  pb-4">
          <Link href="/home">
            <div className="flex items-center gap-2">
              <ChevronLeft className="w-6 h-6" />
              <h1 className="text-base font-bold">Message</h1>
            </div>
          </Link>
          <div className="flex items-center gap-2">
           
          </div>
        </div>
        <div className="w-full flex-1 overflow-auto">{children}</div>
      </div>
    </div>
  );
}
