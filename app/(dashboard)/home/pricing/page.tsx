"use client";
import Image from "next/image";
import star from "@/app/assets/image/star.png";

import Tab from "./compontents/tab";
import Subscribe from "./compontents/subscribe";
import Features from "./compontents/features";
import { useState, useEffect } from "react";
import { getUserCanBuyMember } from "@/app/request/api";
import { useAppSelector } from "@/app/store/hooks";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function page() {
  const [subscribes, setSubscribes] = useState<any[]>([]);
  const info = useAppSelector((state) => state.userReducer.userInfo);

  const getSubscribe = async () => {
    try {
      const res = await getUserCanBuyMember();
      if (res.code === 200) {
        setSubscribes(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getSubscribe();
  }, []);

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
    <div className="w-full h-auto p-12">
      <div className="flex flex-col items-center max-w-6xl mx-auto space-y-12">
        <div className="flex flex-col justify-center items-center space-y-4 text-center">
          <h3 className="text-4xl font-semibold">
            Linkol: 24/7 Social Media Lead Generation
          </h3>
          <p className="text-xl text-muted-foreground break-all">
            支持 o3-mini & o1, DeepSeek, GPT-4o, Claude 3.5 Sonnet
          </p>
        </div>
        <div className="flex justify-center items-center gap-x-16 gap-y-4 text-center text-base">
          <dl>
            <dt className="text-xl font-bold">4.9</dt>
            <dd className="flex items-center space-x-0.5">
              <Image src={star} alt="star" width={20} height={20} />
              <Image src={star} alt="star" width={20} height={20} />
              <Image src={star} alt="star" width={20} height={20} />
              <Image src={star} alt="star" width={20} height={20} />
              <Image src={star} alt="star" width={20} height={20} />
            </dd>
          </dl>
          <dl>
            <dt className="text-xl font-bold">100K+</dt>
            <dd>5 Star Reviews</dd>
          </dl>
          <dl>
            <dt className="text-xl font-bold">10M+</dt>
            <dd>Active Users</dd>
          </dl>
        </div>
        {/* <Tab /> */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full">
          {subscribes.map((item) => (
            <div
              className={cn(
                "shadow-sm rounded-md bg-foreground overflow-hidden border border-border hover:border-secondary transition-colors",
                item.id === 3 && "border-secondary"
              )}
              key={item.id}
            >
              <Subscribe
                title={item.name}
                price={`$${item.price}`}
                isActive={item.id === info.details.current_member?.id}
                discount={"0"}
                isHighlight={item.id === 3}
                item={item}
              />
              <Features
                data={[
                  item.agent_limit,
                  item.order_post,
                  item.repost,
                  item.quote,
                  item.comment,
                  item.reply,
                  item.likes,
                  item.order_post,
                ]}
              />
            </div>
          ))}
          {/* <div className="shadow-sm rounded-md bg-foreground overflow-hidden border border-border hover:border-secondary transition-colors">
            <Subscribe
              title="Basic"
              price="$9.3"
              yearPrice="$100"
              discount="29%"
            />
            <Features data={[1, 4, 2, 2, 3, 3, 20, 2]} />
          </div>
          <div className="shadow-sm rounded-md bg-foreground overflow-hidden border border-secondary hover:border-secondary transition-colors">
            <Subscribe
              title="Enterprise"
              price="$25"
              yearPrice="$300"
              discount="44%"
              isHighlight={true}
            />
            <Features data={[3, 15, 8, 9, 18, 10, 60, 10]} />
          </div>
          <div className="shadow-sm rounded-md bg-foreground overflow-hidden border border-border hover:border-secondary transition-colors">
            <Subscribe
              title="Premium"
              price="$16.6"
              yearPrice="$199"
              discount="41%"
            />
            <Features data={[2, 8, 3, 3, 6, 4, 40, 8]} />
          </div> */}
        </div>
      </div>
    </div>
  );
}
