"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { OrderDetail } from "@/app/types/types";
import {
  getOrderDetail,
  bindOrderOptionAgentId,
  uploadSelfPostLink,
  updateOrderOption,
  updateOrderOptionStatus,
} from "@/app/request/api";
import {
  CircleDashed,
  LoaderCircle,
  CircleCheckBig,
  CircleX,
} from "lucide-react";
import { formatDate } from "@/app/utils/date-utils";
import { Button } from "@/components/ui/button";
import AgentsDialog from "./compontents/agents-dialog";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";
import { Mars, Power, PowerOff, Venus } from "lucide-react";
import { toast } from "sonner";
import { useAppSelector } from "@/app/store/hooks";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import EvmConnect from "@/app/components/evm-connect";
import { useAccount } from "wagmi";
import { extractTweetId } from "@/app/utils/twitter-utils";
import { OrderPreviewType } from "@/app/types/types";
import { useOrderPreview } from "@/app/context/OrderPreviewContext";

export default function Page() {
  const { orderid } = useParams();
  const router = useRouter();
  const [orderDetail, setOrderDetail] = useState<OrderDetail>();
  const [selectedAgent, setSelectedAgent] = useState<any>();
  const agents = useAppSelector((state) => state.userReducer.agents);
  const isLoggedIn = useAppSelector((state) => state.userReducer.isLoggedIn);
  const [isPostLink, setIsPostLink] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const { address } = useAccount();
  const [tweetUrl, setTweetUrl] = useState("");

  const getDetail = async () => {
    try {
      const res = await getOrderDetail({ order_item_id: orderid });
      if (res.code === 200) {
        const data: OrderDetail = res.data[0];
        setOrderDetail(data);
        if (data.agent_id) {
          setSelectedAgent(
            agents.find((agent: any) => agent.id === data.agent_id)
          );
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      getDetail();
    } else {
      router.push("/home");
    }
  }, [orderid, isLoggedIn]);

  const changeAgent = async (agent: any) => {
    try {
      setSelectedAgent(agent);
      const res = await bindOrderOptionAgentId({
        order_item_id: orderid,
        agent_id: agent.id,
      });
      if (res.code === 200) {
        toast.success("Agent bind successfully");
      } else {
        toast.error("Failed to bind agent");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const { status, setStatus, setTweetId, tweetId, isVerified } =
    useOrderPreview();
  const [isUploading, setIsUploading] = useState(false);

  const uploadTweet = async () => {
    try {
      if (!tweetId) {
        toast.error("Please enter a valid tweet URL first");
        return;
      }

      if (!isVerified) {
        toast.error(
          "Please verify the post first. If verification failed, please check your content and retry verification."
        );
        return;
      }

      setIsUploading(true);
      const res = await uploadSelfPostLink({
        tweet_url: tweetUrl,
        wallet_address: address,
        order_item_id: orderid,
      });
      setIsUploading(false);

      if (res.code === 200) {
        const upd = await updateOrderOption({
          order_item_id: orderid,
          kol_audit_status: "finished",
        });
        if (upd.code === 200 && upd.data.result === "success") {
          toast.success("Tweet uploaded successfully");
          router.push(`/home/order`);
        } else {
          toast.error(upd.msg || "Failed to update order status");
        }
      } else {
        toast.error(res.msg || "Failed to upload tweet");
      }
    } catch (error) {
      console.error(error);
      setIsUploading(false);
      toast.error("An error occurred during upload");
    }
  };

  const handleTweetLinkSubmit = () => {
    const extractedTweetId = extractTweetId(tweetUrl);
    if (!extractedTweetId) {
      toast.error("Invalid tweet URL");
      return;
    }

    console.log("Tweet ID:", extractedTweetId);
    setTweetId(extractedTweetId);
    setTweetUrl(tweetUrl);
    setStatus(OrderPreviewType.POST_VIEW);
    setIsPostLink(false);
    setIsComplete(true);
  };

  const [isRejecting, setIsRejecting] = useState(false);
  const handleReject = async () => {
    try {
      if (!orderDetail) return;
      setIsRejecting(true);
      const res = await updateOrderOptionStatus({
        order_item_id: Number(orderid),
        kol_audit_status: "reject",
      });
      setIsRejecting(false);
      if (res.code === 200) {
        toast.success("Order rejected successfully");
        setOrderDetail({
          ...orderDetail,
          kol_audit_status: "reject",
        });
        router.push(`/home/order`);
      } else {
        toast.error(res.msg || "Failed to reject order");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to reject order");
      setIsRejecting(false);
    }
  };
  return (
    <div className="w-full h-full space-y-4">
      <div className="grid grid-cols-24 gap-1 p-4 bg-foreground shadow-sm rounded-md border">
        <div className="col-span-6">
          <div className="w-full h-full flex flex-col gap-2 items-start justify-center">
            <span className="text-sm font-bold text-gray-500 mb-auto">
              Project Name
            </span>
            <span className="text-base">
              {orderDetail?.buy_agent_order.project?.name || "-"}
            </span>
          </div>
        </div>
        <div className="col-span-7">
          <div className="w-full h-full flex flex-col gap-2 items-start justify-center">
            <span className="text-sm font-bold text-gray-500 mb-auto">
              Project Website
            </span>
            <span className="text-base">
              {orderDetail?.buy_agent_order.project?.website || "-"}
            </span>
          </div>
        </div>
        <div className="col-span-7">
          <div className="w-full h-full flex flex-col gap-2 items-start justify-center">
            <span className="text-sm font-bold text-gray-500 mb-auto">
              Create Time
            </span>
            <span className="text-base">{orderDetail?.created_at}</span>
          </div>
        </div>
        <div className="col-span-4 border-l">
          <div className="w-full h-full flex items-center justify-center">
            {orderDetail?.kol_audit_status === "pending" ? (
              <div className="w-full h-full flex flex-col gap-2 items-center justify-center pl-2">
                <div className="w-full h-md flex items-center justify-center gap-1">
                  <CircleDashed className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-500 font-bold">
                    Pending
                  </span>
                </div>
                <div className="w-full h-md flex items-center justify-center gap-1">
                  <Button
                    variant="destructive"
                    className="w-full h-full"
                    onClick={handleReject}
                    disabled={isRejecting}
                  >
                    {isRejecting ? (
                      <LoaderCircle className="w-4 h-4 animate-spin" />
                    ) : (
                      <span className="text-sm font-bold">Reject</span>
                    )}
                  </Button>
                </div>
              </div>
            ) : orderDetail?.kol_audit_status === "doing" ? (
              <div className="w-full h-full flex flex-col gap-2 items-center justify-center pl-2">
                <div className="w-full h-md flex items-center justify-center gap-1">
                  <LoaderCircle className="w-4 h-4 text-orange-500 animate-spin" />
                  <span className="text-sm text-orange-500 font-bold">
                    Doing
                  </span>
                </div>
                <div className="w-full h-md flex items-center justify-center gap-1">
                  <Button
                    variant="destructive"
                    className="w-full h-full"
                    onClick={handleReject}
                    disabled={isRejecting}
                  >
                    {isRejecting ? (
                      <LoaderCircle className="w-4 h-4 animate-spin" />
                    ) : (
                      <span className="text-sm font-bold">Reject</span>
                    )}
                  </Button>
                </div>
              </div>
            ) : orderDetail?.kol_audit_status === "finished" ? (
              <div className="w-full h-md flex items-center justify-center gap-1">
                <CircleCheckBig className="w-4 h-4 text-green-500" />
                <span className="text-sm text-green-500 font-bold">
                  Finished
                </span>
              </div>
            ) : orderDetail?.kol_audit_status === "reject" ? (
              <div className="w-full h-md flex items-center justify-center gap-1">
                <CircleX className="w-4 h-4 text-red-500" />
                <span className="text-sm text-red-500 font-bold">Reject</span>
              </div>
            ) : null}
          </div>
        </div>
      </div>
      {orderDetail?.buy_agent_order.project?.desc && (
        <div className="w-full flex flex-col gap-4">
          <h1 className="text-base font-bold pl-3 relative before:content-[''] before:w-1 before:h-full before:bg-secondary before:absolute before:left-0 before:rounded-none before:shadow-md before:shadow-secondary">
            Project Description
          </h1>
          <p className="text-md">{orderDetail?.buy_agent_order.project?.desc}</p>
        </div>
      )}
      {orderDetail?.buy_agent_order.promotional_materials && (
        <div className="w-full flex flex-col gap-4">
          <h1 className="text-base font-bold pl-3 relative before:content-[''] before:w-1 before:h-full before:bg-secondary before:absolute before:left-0 before:rounded-none before:shadow-md before:shadow-secondary">
            Promotional materials
          </h1>
          <p className="text-md">
            {orderDetail?.buy_agent_order.promotional_materials}
          </p>
        </div>
      )}

      <div className="w-full flex items-center justify-start my-6">
        <div className="flex flex-col items-center justify-center w-full md:w-[300px] shadow-sm rounded-md border overflow-hidden">
          <h1 className="w-full text-md font-bold p-2 text-center bg-foreground">
            Payment Amount
          </h1>
          <p className="text-lg p-2 text-white w-full font-bold text-center bg-gradient-to-r from-green-400 to-blue-500">
            <span className="text-2xl font-bold">{orderDetail?.price}</span>
            <span className="text-xs"> USDT(ERC20)</span>
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center gap-6">
        <AnimatePresence mode="wait">
          {selectedAgent ? (
            <motion.div
              key="selected-agent"
              className="w-full flex items-center justify-center"
              initial={{ opacity: 0, filter: "blur(10px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, filter: "blur(10px)" }}
              transition={{ duration: 0.3 }}
            >
              <div
                className={cn(
                  "w-full flex items-center justify-between bg-white rounded-md p-4 shadow-sm border",
                )}
                key={selectedAgent.id}
              >
                <div
                  className={cn(
                    "flex flex-col gap-1 w-full",
                    selectedAgent.status !== "RUNING" && "opacity-50"
                  )}
                >
                  <div className="text-md font-bold flex items-center gap-1">
                    <span className="text-md font-bold">
                      {selectedAgent.name}
                    </span>
                    {selectedAgent.sex === "male" ? (
                      <Mars className="w-3 h-3 text-blue-500" />
                    ) : (
                      <Venus className="w-3 h-3 text-pink-500" />
                    )}{" "}
                    <span className="text-md text-gray-500 pr-2 border-r border-gray-400">
                      ({selectedAgent.region})
                    </span>
                    {selectedAgent.characters.length > 0 &&
                      selectedAgent.characters.map((character: any) => (
                        <span className="text-sm text-gray-500 bg-gray-100 rounded-md px-2" key={character}>
                          {character}
                        </span>
                      ))}
                  </div>
                  <span className="text-sm text-gray-500">
                    {selectedAgent.abilitys}
                  </span>
                </div>
                <AgentsDialog
                  name="Change Agent"
                  ButtonClassName="w-auto rounded-full h-8"
                  selectedAgent={changeAgent}
                />
              </div>
            </motion.div>
          ) : isPostLink ? (
            <motion.div
              key="post-link"
              className="w-full flex items-center justify-center gap-6"
              initial={{ opacity: 0, filter: "blur(10px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, filter: "blur(10px)" }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-full flex items-center flex-col justify-center gap-2 p-2">
                <Input
                  placeholder="Enter Tweet Link"
                  className="w-full"
                  value={tweetUrl}
                  onChange={(e) => setTweetUrl(e.target.value)}
                />
                <div className="w-full flex items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    className="w-full hover:bg-foreground hover:text-primary"
                    onClick={() => {
                      setIsPostLink(false);
                      setStatus(OrderPreviewType.POST_CONTENT);
                    }}
                  >
                    <span className="text-base font-bold">Cancel</span>
                  </Button>
                  <Button
                    variant="primary"
                    className="w-full"
                    onClick={handleTweetLinkSubmit}
                  >
                    <span className="text-base font-bold">Add Tweet Link</span>
                  </Button>
                </div>
              </div>
            </motion.div>
          ) : isComplete ? (
            <motion.div
              key="complete"
              className="w-full flex items-center justify-center gap-6"
              initial={{ opacity: 0, filter: "blur(10px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, filter: "blur(10px)" }}
            >
              <div className="w-full flex items-center justify-between gap-2 bg-foreground shadow-sm border p-2 rounded-md">
                <EvmConnect />
                {address && (
                  <>
                    <Button
                      variant="outline"
                      className="w-auto rounded-full h-6 hover:bg-foreground hover:text-primary"
                      onClick={() => {
                        setIsPostLink(true);
                        setIsComplete(false);
                        setTweetUrl("");
                        setTweetId("");
                      }}
                    >
                      <span className="text-sm font-bold">Change Link</span>
                    </Button>
                    <Button
                      variant="primary"
                      className="w-auto rounded-full h-6"
                      onClick={uploadTweet}
                      disabled={isUploading}
                    >
                      {isUploading ? (
                        <LoaderCircle className="w-4 h-4 animate-spin" />
                      ) : (
                        <span className="text-sm font-bold">Confirm</span>
                      )}
                    </Button>
                  </>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="select-agent"
              className="w-full flex items-center justify-center gap-6"
              initial={{ opacity: 0, filter: "blur(10px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, filter: "blur(10px)" }}
              transition={{ duration: 0.3 }}
            >
              <AgentsDialog name="Select Agent" selectedAgent={changeAgent} />
              <Button
                variant="outline"
                className="h-10 w-full flex gap-2 hover:bg-foreground hover:text-primary"
                onClick={() => {
                  setIsPostLink(true);
                  setStatus(OrderPreviewType.POST_VIEW);
                  setTweetUrl("");
                  setTweetId("");
                }}
              >
                <span className="text-base font-bold">
                  Already prepared the tweet
                </span>
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
