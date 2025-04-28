"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import avatar from "@/app/assets/image/avatar.png";
import banner from "@/app/assets/image/Cover.png";
import Post from "../compontents/post";
import Repost from "../compontents/repost";
import Reply from "../compontents/reply";
import { useParams } from "next/navigation";
import { getKolMessage, getAgentList } from "@/app/request/api";
import { useAppSelector } from "@/app/store/hooks";
import { formatDate } from "@/app/utils/date-utils";
import {
  LoaderCircle,
  MessageSquareDashed,
  SquareArrowOutUpRight,
} from "lucide-react";
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
            `<strong>Dear ${
              agents.find((agent) => agent.id == Number(agentId))?.name
            }</strong>:

            <strong>🎉 Congratulations on creating a new Agent!</strong>
            KOL Agent is a one-stop platform focused on efficient Agent operation management and project-side KOL resource docking, dedicated to building a value bridge between creators and brands.
            Core Platform Advantages

            <strong>🔗 Precision Resource Matching</strong>
            Covering massive high-quality project resources in cutting-edge Web3 fields such as public chains, DeFi, Meme, and NFT, with millions of cooperation orders updated in real time. Through intelligent algorithms, we precisely match your content style, fan demographics, and business needs to maximize traffic value.

            <strong>🧩 End-to-End Operational Efficiency: Agents handle the entire "order acceptance - execution - review" process</strong>
            ▫️ Smart Filtering: Automatically filters out low-matching orders (e.g., budget mismatches, irrelevant fields), leaving only high-value cooperation demands.
            ▫️ One-click Synchronization: After receiving an order, promotion requirements (copy style, posting time, image specifications) are automatically synced to the Agent workspace, eliminating repetitive communication.
            ▫️ Progress Tracking: Real-time visibility into all nodes of the process: "order confirmation - tweet posting - data report."

            <strong>🤖 AI Tool-Driven Productivity</strong>

            ✅ Create Agent roles on demand (click to select templates or customize), such as content creation Agents, fan growth Agents, and interaction Agents.
            ✅ Freely configure Agent operation strategies, including tweeting frequency, interaction frequency, and retweet frequency.
            ✅ Enable different Agents to collaborate: content Agents publish high-quality content, traffic Agents capture hot topics for reach, and project evaluation Agents conduct project reviews.
            
            With the KOL Agent platform, you can efficiently manage your Twitter account, accelerate the conversion of traffic value, and wait for project parties to proactively send you collaboration offers!`,
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
      {/* <div className="w-[600px] relative bg-primary/10">
        <Image src={banner} alt="avatar" className="w-full" />
        <div className="w-20 h-20 size-8 rounded-full overflow-hidden  absolute bottom-0">
          <Image src={avatar} alt="avatar" />
        </div>
      </div> */}
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
            <div
              className="w-[500px]  mb-4  py-2  border-1 border-gray-200 rounded-md"
              key={index}
            >
              {typeof item === "string" && (
                <div className="flex space-x-4 w-full">
                  <div className="space-y-1">
                    <div
                      className="text-md text-muted-foreground bg-foreground  rounded-md p-4 whitespace-pre-line"
                      dangerouslySetInnerHTML={{ __html: item }}
                    />
                  </div>
                </div>
              )}
              {item.msg_type === "string" && (
                <div className="flex space-x-4 w-full">
                  <div className="space-y-1">
                    <div className="text-md text-muted-foreground bg-foreground  rounded-md p-4">
                      Advertised co-op request from {item.detail.user}, paid{" "}
                      {item.detail.amount}USDT, paid on{" "}
                      {formatDate(item.detail.pay_at * 1000)}, platform gets{" "}
                      {item.detail.platform_percent}% commission,{" "}
                      {item.detail.platform_amount}USDT, you can get{" "}
                      {item.detail.agent_amount}USDT, item name "
                      {item.detail.user}. "
                    </div>
                    <dl className="flex items-baseline space-x-2 justify-end  px-4">
                      <dd className="text-md text-muted-foreground">
                        {formatDate(item.created_at)}
                      </dd>
                    </dl>
                  </div>
                </div>
              )}

              {item.msg_type === "task" &&
                item.detail.task_type === "comment" && (
                  <div className="flex space-x-4 w-full">
                    <div className="space-y-1">
                      <div className="text-md text-muted-foreground bg-foreground  rounded-md p-4">
                        <Post
                          agent={agents.find(
                            (agent) => agent.id == Number(agentId)
                          )}
                          content={item.detail.content}
                          time={item.created_at}
                          views={item.detail.view}
                          type={item.detail.task_type}
                          medias={null}
                        />
                      </div>
                      <dl className="flex items-baseline space-x-2 justify-end  px-4">
                        {/* <dt className="text-base font-bold leading-8">
                          {agents.find((agent) => agent.id == Number(agentId))
                            ?.name || "Agent"}
                        </dt> */}
                        <dd className="text-md text-muted-foreground">
                          {formatDate(item.created_at)}
                        </dd>
                      </dl>
                    </div>
                  </div>
                )}

              {item.msg_type === "task" &&
                (item.detail.task_type === "likes" ||
                  item.detail.task_type === "quote" ||
                  item.detail.task_type === "repost" ||
                  item.detail.task_type === "reply" ||
                  item.detail.task_type === "post") && (
                  <div className="flex space-x-4 w-full">
                    {/* <div className="min-w-8 size-8 rounded-full overflow-hidden">
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
                        <Image
                          src={avatar}
                          alt="avatar"
                          className="w-10 h-10"
                        />
                      )}
                    </div> */}
                    <div className="space-y-1 w-full">
                      <div className="text-md text-muted-foreground bg-foreground   rounded-md p-4 relative">
                        <Post
                          agent={
                            item.detail.target_tweetinfo ||
                            agents.find((agent) => agent.id == Number(agentId))
                          }
                          content={
                            item.detail.target_tweetinfo?.content ||
                            item.detail.content
                          }
                          time={
                            item.detail.target_tweetinfo?.create_time ||
                            item.created_at
                          }
                          views={
                            item.detail.target_tweetinfo?.views ||
                            item.detail.view
                          }
                          type={item.detail.task_type}
                          medias={item.detail.target_tweetinfo?.medias || null}
                        />
                        {item.detail.target_tweetinfo?.x_id && (
                          <div
                            className="absolute top-2 right-2"
                            onClick={() => {
                              window.open(
                                `https://x.com/${item.detail.target_tweetinfo?.user_screen_name}/status/${item.detail.target_tweetinfo?.x_id}`,
                                "_blank"
                              );
                            }}
                          >
                            <SquareArrowOutUpRight className="w-4 h-4 hover:text-secondary cursor-pointer" />
                          </div>
                        )}
                      </div>
                      <dl className="flex items-baseline space-x-2 justify-end  px-4">
                        {/* <dt className="text-base font-bold leading-8">
                          {agents.find((agent) => agent.id == Number(agentId))
                            ?.name || "Agent"}
                        </dt> */}
                        <dd className="text-md text-muted-foreground">
                          {formatDate(item.created_at)}
                        </dd>
                      </dl>
                    </div>
                  </div>
                )}
            </div>
          ))
        )}
      </ScrollArea>
    </div>
  );
}
