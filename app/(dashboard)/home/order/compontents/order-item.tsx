import { Button } from "@/components/ui/button";
import {
  CircleCheckBig,
  CircleDashed,
  CircleX,
  LoaderCircle,
} from "lucide-react";
import React from "react";
import { DatumOrder } from "@/app/types/types";
import { formatDate } from "@/app/utils/date-utils";
import { useRouter } from "next/navigation";
import Image from "next/image";
import avatar from "@/app/assets/image/avatar.png";
export default function OrderItem({ order }: { order: DatumOrder }) {
  const router = useRouter();
  return (
    <div
      className="w-full p-3 rounded-lg bg-foreground shadow-sm flex flex-col gap-2 cursor-pointer hover:bg-slate-100 transition-all duration-300"
      onClick={() => {
        if (order.kol_audit_status === "pending" || order.kol_audit_status === "doing") {
          router.push(`/home/order/${order.id}`);
        }
      }}
    >
      <div className="w-full flex items-center justify-between border-b border-dashed pb-2">
        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <span className="text-sm font-medium">Order ID: {order.id}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden">
              <img
                src={order.kol.profile_image_url}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-sm font-bold">{order.kol.name}</span>
            <span className="text-sm text-muted-foreground">
              @{order.kol.username}
            </span>
          </div>
        </div>
        <div className="flex items-center">
          <span className="text-sm text-muted-foreground">
            {formatDate(Number(order.created_at) * 1000)}
          </span>
        </div>
      </div>
      <div className="w-full grid grid-cols-24 gap-2">
        <div className="col-span-4 w-full flex flex-col gap-1 items-center justify-start p-1">
          <span className="text-sm text-muted-foreground font-medium">
            Project
          </span>
          <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden">
            {order.buy_agent_order.project.icon ? (
              <img
                src={order.buy_agent_order.project.icon}
                alt=""
                className="w-10 h-10 object-cover"
              />
            ) : (
              <Image
                src={avatar}
                alt="avatar"
                className="w-10 h-10 object-cover"
              />
            )}
          </div>
          <span className="text-base font-bold my-auto">
            {order.buy_agent_order.project.name}
          </span>
        </div>
        <div className="col-span-6 w-full flex flex-col gap-1 items-center justify-center p-1">
          <span className="text-sm text-muted-foreground font-medium mb-auto">
            Payment Amount
          </span>
          <div className="text-lg w-full h-full flex items-center justify-center text-green-500 font-bold">
            {order.price}
          </div>
          <div className="flex items-end justify-center text-md mt-auto">
            <span className="text-md">USDT</span>
            <span className="text-xs text-muted-foreground">/tweet</span>
          </div>
        </div>
        <div className="col-span-10 w-full flex flex-col gap-1 items-start justify-center p-1">
          <span className="text-sm text-muted-foreground font-medium mb-auto">
            Promotional materials
          </span>
          <div className="text-md w-full h-full">
            <span className="text-sm line-clamp-4">
              {order.buy_agent_order.promotional_materials}
            </span>
          </div>
        </div>
        <div className="col-span-4 w-full flex flex-col gap-1 items-center justify-center p-1">
          {order.kol_audit_status === "pending" ? (
            <div className="w-full h-md flex items-center justify-end gap-1">
              <CircleDashed className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-500 font-bold">Pending</span>
            </div>
          ) : order.kol_audit_status === "doing" ? (
            <div className="w-full h-md flex items-center justify-end gap-1">
              <LoaderCircle className="w-4 h-4 text-orange-500 animate-spin" />
              <span className="text-sm text-orange-500 font-bold">Doing</span>
            </div>
          ) : order.kol_audit_status === "finished" ? (
            <div className="w-full h-md flex items-center justify-end gap-1">
              <CircleCheckBig className="w-4 h-4 text-green-500" />
              <span className="text-sm text-green-500 font-bold">Finished</span>
            </div>
          ) : order.kol_audit_status === "reject" ? (
            <div className="w-full h-md flex items-center justify-end gap-1">
              <CircleX className="w-4 h-4 text-red-500" />
              <span className="text-sm text-red-500 font-bold">Reject</span>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
