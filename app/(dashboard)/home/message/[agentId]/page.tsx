"use client";

import Message from "./message";

import { useAppSelector } from "@/app/store/hooks";
import { useParams } from "next/navigation";
import Image from "next/image";
import fire from "@/app/assets/image/fire.png";

import { Progress } from "@/components/ui/progress";
import Notice from "./notice";
import Project from "./project";
import { useMemo } from "react";
export default function page() {
  const agents = useAppSelector((state) => state.userReducer.agents);
  const { agentId } = useParams();

  const userAgent = useMemo(() => {
    return agents.find((agent) => agent.id === Number(agentId));
  }, [agentId]);

  //计算价格占比
  const ratio = useMemo(() => {
    const agent = agents.find((agent) => agent.id === Number(agentId));
    return ((agent?.price || 0) / (agent?.max_price || 0)) * 100 || 0;
  }, [agentId]);

  return (
    <div className="flex  h-full">
      <div className="flex-1 overflow-auto  p-2 md:p-4 lg:p-6 ">
        <Message></Message>
      </div>
      <div className="w-78 f-full  bg-foreground shadow-[-2px_4px_12px_0px_rgba(0,0,0,0.05)] p-4 box-border  space-y-4 ">
        <div className="bg-[rgba(219,90,234,0.1)] rounded-xl p-2 box-border">
          <div className="text-[#DB5AEA] text-sm flex items-center gap-1">
            <Image src={fire} alt="" className="w-7"></Image>
            <span>Promote price</span>
          </div>

          <div className="relative pb-14">
            <Progress
              value={ratio}
              className="mt-2  bg-[rgba(118,118,128,0.12)] [&>*]:bg-[#DB5AEA]"
            ></Progress>
            {/* 当前价格 */}
            {userAgent?.price && (
              <div
                className={`absolute top-4 text-sm lef-0`}
                style={{ left: `${ratio}%` }}
              >
                <p className="text-[#DB5AEA]">${userAgent?.price}</p>
                <p className="text-[rgba(127,127,127,0.5)]">/tweet</p>
              </div>
            )}
            {/* 最大价格 */}
            {userAgent?.max_price && (
              <div className="absolute right-[0] top-4 text-sm ">
                <p className="text-[#DB5AEA]">${userAgent?.max_price}</p>
                <p className="text-[rgba(127,127,127,0.5)]">/tweet</p>
              </div>
            )}
          </div>
        </div>

        {/* <div className="flex gap-2  ">
          <div className="bg-[rgba(92,153,244,0.1)] rounded-xl p-2 box-border  flex-1 ">
            <div className="text-[#5C99F4] text-sm flex items-center gap-1">
              <Image src={FocusScore} alt="" className="w-7"></Image>
              <span>Focus score</span>
            </div>
            <div className="text-transparent font-sans bg-clip-text bg-[linear-gradient(90deg,_#88BBF3_0%,_#5C99F4_100%)] text-5xl flex  justify-end items-end mt-7">
              100
            </div>
          </div>
          <div className="bg-[rgba(1,207,127,0.1)] rounded-xl p-2 box-border flex-1 ">
            <div className="text-[#01CF7F] text-sm flex items-center gap-1">
              <Image src={Performance} alt="" className="w-7"></Image>
              <span>Performance</span>
            </div>
          </div>
        </div> */}

        <Notice></Notice>

        <Project></Project>
        {/* <div>
          <div className="text-md p-6">
            <label className="text-md font-bold">Promote price</label>
            <Progress value={0} className="mt-2" />
          </div>

          <div>
                <div className="flex space-x-4 justify-center h-10 ">
                  <Button className="flex-1">2158hf</Button>
                  <Separator orientation="vertical" />
                  <Button className="flex-1">Invite to Earn</Button>
                </div>
              </div>

          <Separator />
          <div className="p-6 space-y-4">
            <Notice></Notice>

            <DeleteConfirmation>
              <Button
                variant="outline"
                className="flex gap-2 hover:bg-foreground hover:text-destructive-foreground w-full"
              >
                <Trash className="size-4 min-w-4 text-destructive" />
                <span className="text-md font-bold text-destructive">
                  Delete
                </span>
              </Button>
            </DeleteConfirmation>
          </div>
        </div>
        <Separator />
        <div className="space-y-4 ">
          <Project></Project>
        </div> */}
      </div>
    </div>
  );
}
