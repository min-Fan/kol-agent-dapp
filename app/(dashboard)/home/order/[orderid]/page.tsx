"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { OrderDetail } from "@/app/types/types";
import { getOrderDetail } from "@/app/request/api";
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

export default function Page() {
  const { orderid } = useParams();
  const [orderDetail, setOrderDetail] = useState<OrderDetail>();
  const [selectedAgent, setSelectedAgent] = useState<any>();
  const getDetail = async () => {
    try {
      console.log(orderid);
      const res = await getOrderDetail({ order_item_id: orderid });
      if (res.code === 200) {
        const data: OrderDetail = res.data[0];
        setOrderDetail(data);
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    getDetail();
  }, [orderid]);
  return (
    <div className="w-full h-full space-y-4">
      <div className="grid grid-cols-24 gap-1 p-4 bg-foreground shadow-sm rounded-md border">
        <div className="col-span-6">
          <div className="w-full h-full flex flex-col gap-2 items-start justify-center">
            <span className="text-sm font-bold text-gray-500 mb-auto">
              Project Name
            </span>
            <span className="text-base">
              {orderDetail?.buy_agent_order.project.name}
            </span>
          </div>
        </div>
        <div className="col-span-7">
          <div className="w-full h-full flex flex-col gap-2 items-start justify-center">
            <span className="text-sm font-bold text-gray-500 mb-auto">
              Project Website
            </span>
            <span className="text-base">
              {orderDetail?.buy_agent_order.project.website}
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
              <div className="w-full h-md flex items-center justify-center gap-1">
                <CircleDashed className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-500 font-bold">Pending</span>
              </div>
            ) : orderDetail?.kol_audit_status === "doing" ? (
              <div className="w-full h-md flex items-center justify-center gap-1">
                <LoaderCircle className="w-4 h-4 text-orange-500 animate-spin" />
                <span className="text-sm text-orange-500 font-bold">Doing</span>
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
      {orderDetail?.buy_agent_order.project.desc && (
        <div className="w-full flex flex-col gap-4">
          <h1 className="text-base font-bold pl-3 relative before:content-[''] before:w-1 before:h-full before:bg-secondary before:absolute before:left-0 before:rounded-none before:shadow-md before:shadow-secondary">
            Project Description
          </h1>
          <p className="text-md">{orderDetail?.buy_agent_order.project.desc}</p>
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

      <div className="w-full flex items-center justify-center my-6">
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
              className="w-full flex items-center justify-center"
              initial={{ opacity: 0, filter: "blur(10px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, filter: "blur(10px)" }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex flex-col items-center justify-center w-full md:w-[300px] shadow-sm rounded-md border overflow-hidden">
                <h1 className="w-full text-md font-bold p-2 text-center bg-foreground">
                  Agent
                </h1>
                <p className="text-lg p-2 text-white w-full font-bold text-center bg-gradient-to-r from-green-400 to-blue-500">
                  <span className="text-2xl font-bold">
                    {selectedAgent.name}
                  </span>
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              className="w-full flex items-center justify-center gap-6"
              initial={{ opacity: 0, filter: "blur(10px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, filter: "blur(10px)" }}
              transition={{ duration: 0.3 }}
            >
              <AgentsDialog
                name="Select Agent"
                selectedAgent={(agent) => {
                  setSelectedAgent(agent);
                }}
              />
              <Button
                variant="outline"
                className="h-10 w-full flex gap-2 hover:bg-foreground hover:text-primary"
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
