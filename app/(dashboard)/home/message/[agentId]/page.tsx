"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

import avatar from "@/app/assets/image/avatar.png";
import Post from "../compontents/post";
import Repost from "../compontents/repost";
import Reply from "../compontents/reply";
import { useParams } from "next/navigation";
import { getKolMessage, getAgentList } from "@/app/request/api";
import { useAppSelector } from "@/app/store/hooks";
import { formatDate } from "@/app/utils/date-utils";
import { LoaderCircle, MessageSquareDashed } from "lucide-react";
export default function page() {
  const { agentId } = useParams();
  const [messageList, setMessageList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const isLoggedIn = useAppSelector((state) => state.userReducer.isLoggedIn);

  const agents = useAppSelector((state) => state.userReducer.agents);

  // 获取kol message
  const getKolMessageList = async () => {
    try {
      setLoading(true);
      const res = await getKolMessage({ agent_id: agentId });
      setLoading(false);
      if (res && res.code === 200) {
        if (res.data.length > 0) {
          setMessageList(res.data);
        } else {
          setMessageList([
            `Hi～ I’m the smart assistant you just created!
            I’m currently “booting up the task system” 🔧 and will help you with:
            ✅ Monitor Twitter updates
            ✅ Schedule tweets to engage with your followers and KOLs
            Tasks are in progress—go grab a coffee ☕️ and I’ll take it from here!`,
          ]);
        }
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getKolMessageList();
  }, [agentId]);
  return (
    <div className="w-full h-full">
      <ScrollArea className="w-full h-full">
        {loading ? (
          <div className="w-full h-full flex items-center justify-center">
            <LoaderCircle className="w-10 h-10 animate-spin text-secondary" />
          </div>
        ) : messageList.length === 0 ? (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2">
            <MessageSquareDashed className="w-10 h-10 text-muted-foreground" />
            <span className="text-muted-foreground text-md">No messages</span>
          </div>
        ) : (
          messageList.map((item: any, index: number) => (
            <div className="space-y-8 pb-1" key={index}>
              {typeof item === "string" && (
                <div className="flex space-x-4">
                  <div className="min-w-8 size-8 rounded-full overflow-hidden">
                    {agents.find((agent) => agent.id == Number(agentId))
                      ?.icon ? (
                      <img
                        src={
                          agents.find((agent) => agent.id == Number(agentId))
                            ?.icon
                        }
                        alt="avatar"
                        className="w-10 h-10 object-cover"
                      />
                    ) : (
                      <Image src={avatar} alt="avatar" className="w-10 h-10" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <dl className="flex items-baseline space-x-2">
                      <dt className="text-base font-bold leading-8">
                        {agents.find((agent) => agent.id == Number(agentId))
                          ?.name || "Agent"}
                      </dt>
                      <dd className="text-md text-muted-foreground">Now</dd>
                    </dl>
                    <div className="text-md text-muted-foreground bg-foreground shadow-sm rounded-md p-4 whitespace-pre-line">
                      {item}
                    </div>
                  </div>
                </div>
              )}
              {item.msg_type === 'string' && (
                <div className="flex space-x-4">
                  <div className="min-w-8 size-8 rounded-full overflow-hidden">
                    {agents.find((agent) => agent.id == Number(agentId))
                      ?.icon ? (
                      <img
                        src={
                          agents.find((agent) => agent.id == Number(agentId))
                            ?.icon
                        }
                        alt="avatar"
                        className="w-10 h-10 object-cover"
                      />
                    ) : (
                      <Image src={avatar} alt="avatar" className="w-10 h-10" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <dl className="flex items-baseline space-x-2">
                      <dt className="text-base font-bold leading-8">
                        {agents.find((agent) => agent.id == Number(agentId))
                          ?.name || "Agent"}
                      </dt>
                      <dd className="text-md text-muted-foreground">
                        {formatDate(item.created_at)}
                      </dd>
                    </dl>
                    <div className="text-md text-muted-foreground bg-foreground shadow-sm rounded-md p-4">
                      Advertised co-op request from {item.detail.user}, paid{" "}
                      {item.detail.amount}USDT, paid on{" "}
                      {formatDate(item.detail.pay_at * 1000)}, platform gets{" "}
                      {item.detail.platform_percent}% commission,{" "}
                      {item.detail.platform_amount}USDT, you can get{" "}
                      {item.detail.agent_amount}USDT, item name “
                      {item.detail.user}. ”
                    </div>
                  </div>
                </div>
              )}

              {item.msg_type === 'task' && (
                <div className="flex space-x-4">
                  <div className="min-w-8 size-8 rounded-full overflow-hidden">
                    {agents.find((agent) => agent.id == Number(agentId))
                      ?.icon ? (
                      <img
                        src={
                          agents.find((agent) => agent.id == Number(agentId))
                            ?.icon
                        }
                        alt="avatar"
                        className="w-10 h-10 object-cover"
                      />
                    ) : (
                      <Image src={avatar} alt="avatar" className="w-10 h-10" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <dl className="flex items-baseline space-x-2">
                      <dt className="text-base font-bold leading-8">
                        {agents.find((agent) => agent.id == Number(agentId))
                          ?.name || "Agent"}
                      </dt>
                      <dd className="text-md text-muted-foreground">
                        {formatDate(item.created_at)}
                      </dd>
                    </dl>
                    <div className="text-md text-muted-foreground bg-foreground shadow-sm rounded-md p-4">
                      <Post
                        agent={agents.find(
                          (agent) => agent.id == Number(agentId)
                        )}
                        content={item.detail.content}
                        time={item.created_at}
                        views={item.detail.view}
                        type={item.detail.task_type}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* <div className="flex space-x-4">
                <div className="min-w-8 size-8 rounded-full overflow-hidden">
                  <Image src={avatar} alt="avatar" className="w-10 h-10" />
                </div>
                <div className="space-y-1">
                  <dl className="flex items-baseline space-x-2">
                    <dt className="text-base font-bold leading-8">John Doe</dt>
                    <dd className="text-md text-muted-foreground">
                      2025-03-28 10:00
                    </dd>
                  </dl>
                  <div className="text-md text-muted-foreground bg-foreground shadow-sm rounded-md p-4">
                    来自于XXX的广告上合作需求，已付款100USDT，付款时间2025年3月28日，平台获取20%佣金，20USDT，您可以获取80USDT，项目名称“xxx”,项目介绍“xxxx”
                  </div>
                  <div className="space-x-2 pt-2">
                    <Button variant="primary">
                      <span>Accept</span>
                    </Button>
                    <Button variant="destructive">
                      <span>Reject</span>
                    </Button>
                  </div>
                </div>
              </div> */}
              {/* <div className="flex space-x-4">
            <div className="min-w-8 size-8 rounded-full overflow-hidden">
              <Image src={avatar} alt="avatar" className="w-10 h-10" />
            </div>
            <div className="space-y-1">
              <dl className="flex items-baseline space-x-2">
                <dt className="text-base font-bold leading-8">John Doe</dt>
                <dd className="text-md text-muted-foreground">
                  2025-03-28 10:00
                </dd>
              </dl>
              <div className="text-md text-muted-foreground bg-foreground shadow-sm rounded-md p-4">
                <Repost />
              </div>
            </div>
              </div> */}
              {/* <div className="flex space-x-4">
            <div className="min-w-8 size-8 rounded-full overflow-hidden">
              <Image src={avatar} alt="avatar" className="w-10 h-10" />
            </div>
            <div className="space-y-1">
              <dl className="flex items-baseline space-x-2">
                <dt className="text-base font-bold leading-8">John Doe</dt>
                <dd className="text-md text-muted-foreground">
                  2025-03-28 10:00
                </dd>
              </dl>
              <div className="text-md text-muted-foreground bg-foreground shadow-sm rounded-md p-4">
                <Reply />
              </div>
            </div>
              </div> */}
            </div>
          ))
        )}
      </ScrollArea>
    </div>
  );
}
