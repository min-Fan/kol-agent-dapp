"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { useAppSelector } from "@/app/store/hooks";
import { useRouter } from "next/navigation";
import OrderPreview from "./compontents/order-preview";
import { OrderDetail, OrderPreviewType } from "@/app/types/types";
import { getOrderDetail } from "@/app/request/api";
import { useParams } from "next/navigation";
export default function Layout({ children }: { children: React.ReactNode }) {
  const isLoggedIn = useAppSelector(
    (state: any) => state.userReducer.isLoggedIn
  );
  const { orderid } = useParams();
  const [orderDetail, setOrderDetail] = useState<OrderDetail>();
  const getDetail = async () => {
    try {
      const res = await getOrderDetail({ order_item_id: orderid });
      console.log(res);
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

  const router = useRouter();
  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/home");
    }
  }, [isLoggedIn]);
  return (
    <div className="w-full h-full overflow-hidden grid grid-cols-24">
      <div className="col-span-16 h-full overflow-hidden flex flex-col flex-1 box-border p-2 md:p-4 lg:p-6">
        <div className="w-full flex items-center justify-between shadow-[0_10px_10px_20px_rgba(251,249,250,1)] pb-4">
          <Link href="/home/order">
            <div className="flex items-center gap-2">
              <ChevronLeft className="w-6 h-6" />
              <h1 className="text-base font-bold">Order Details</h1>
            </div>
          </Link>
        </div>
        <div className="w-full flex-1 overflow-auto">{children}</div>
      </div>

      <div className="col-span-8 h-full overflow-hidden bg-foreground shadow-md">
        {orderDetail && <OrderPreview kol={orderDetail.kol} orderDetail={orderDetail} />}
      </div>
    </div>
  );
}
