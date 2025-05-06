"use client";
import React, { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import OrderItem from "./compontents/order-item";
import { DatumOrder } from "@/app/types/types";
import { getOrderList } from "@/app/request/api";
import { NotepadTextDashed } from "lucide-react";
import OrderSkeleton from "./compontents/order-skeleton";
import { useAppSelector } from "@/app/store/hooks";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
export default function Page() {
  const [orderList, setOrderList] = useState<DatumOrder[]>([]);
  const [activeTab, setActiveTab] = useState<string>("pending");
  const [loading, setLoading] = useState<boolean>(false);
  const isLoggedIn = useAppSelector((state) => state.userReducer.isLoggedIn);
  const getOrders = async () => {
    try {
      setLoading(true);
      const res = await getOrderList({ kol_audit_status: activeTab });
      setLoading(false);
      if (res.code === 200) {
        setOrderList(res.data);
      } else {
        toast.error(res.msg);
        setOrderList([]);
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };
  useEffect(() => {
    getOrders();
  }, [activeTab, isLoggedIn]);

  const router = useRouter();
  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/home");
    }
  }, [isLoggedIn]);
  return (
    <div className="w-full h-full p-2 md:p-4 lg:p-6">
      <h1 className="text-lg font-bold mb-4">Order List</h1>
      <div className="w-full flex flex-col gap-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 w-full md:w-sm">
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="doing">Doing</TabsTrigger>
            <TabsTrigger value="finished">Finished</TabsTrigger>
            <TabsTrigger value="reject">Reject</TabsTrigger>
          </TabsList>
          {loading ? (
            Array.from({ length: 10 }).map((_, index) => (
              <OrderSkeleton key={index} />
            ))
          ) : orderList.length > 0 ? (
            <>
              <TabsContent value="pending">
                <div className="w-full flex flex-col gap-2">
                  {orderList.map((order) => (
                    <OrderItem key={order.id} order={order} />
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="doing">
                <div className="w-full flex flex-col gap-2">
                  {orderList.map((order) => (
                    <OrderItem key={order.id} order={order} />
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="finished">
                <div className="w-full flex flex-col gap-2">
                  {orderList.map((order) => (
                    <OrderItem key={order.id} order={order} />
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="reject">
                <div className="w-full flex flex-col gap-2">
                  {orderList.map((order) => (
                    <OrderItem key={order.id} order={order} />
                  ))}
                </div>
              </TabsContent>
            </>
          ) : (
            <div className="w-full h-full flex flex-col gap-2 items-center justify-center py-40">
              <NotepadTextDashed className="w-10 h-10 text-muted-foreground" />
              <span className="text-md text-muted-foreground">No data</span>
            </div>
          )}
        </Tabs>
      </div>
    </div>
  );
}
