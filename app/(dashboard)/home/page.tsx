"use client";

import { Button } from "@/components/ui/button";
import { Bot } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppSelector } from "@/app/store/hooks";
import { useLoginDrawer } from "@/app/hooks/useLoginDrawer";
import { useEffect } from "react";
import { toast } from "sonner";
import { updateConfig } from "@/app/store/reducers/userSlice";
import { useAppDispatch } from "@/app/store/hooks";
import {
  getAbilityList,
  getAgentPriceList,
  getKOLInterface,
  getAgentLimit,
  getConstants,
} from "@/app/request/api";
export default function HomePage() {
  const router = useRouter();
  const isLoggedIn = useAppSelector((state) => state.userReducer.isLoggedIn);
  const { openDrawer } = useLoginDrawer();
  const userInfoDetails = useAppSelector((state) => state.userReducer.userInfo.details);

  const handleCreateKol = () => {
    if (isLoggedIn && userInfoDetails.agent.created < userInfoDetails.agent.total) {
      router.push("/home/create/kol");
    } else if (isLoggedIn && userInfoDetails.agent.created >= userInfoDetails.agent.total) {
      toast.warning("Create agent has reached the limit");
    } else {
      openDrawer();
    }
  };

  const params = useSearchParams();
  useEffect(() => {
    const oauth_token = params.get("oauth_token");
    if (oauth_token) {
      // 打开登录 twitter授权弹窗
      openDrawer();
    }
  }, [params]);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/home");
    } else {
      getConst();
    }
  }, [isLoggedIn]);

  const dispatch = useAppDispatch();
  const getConst = async () => {
    try {
      getConstants({
        c_type: "region",
      }).then((res) => {
        dispatch(updateConfig({ key: "region", value: res.data || [] }));
      });
      getConstants({
        c_type: "language",
      }).then((res) => {
        dispatch(updateConfig({ key: "language", value: res.data || [] }));
      });
      getConstants({
        c_type: "character",
      }).then((res) => {
        dispatch(updateConfig({ key: "character", value: res.data || [] }));
      });
      getConstants({
        c_type: "topics",
      }).then((res) => {
        dispatch(updateConfig({ key: "topics", value: res.data || [] }));
      });
      getAbilityList().then((res) => {
        dispatch(updateConfig({ key: "ability", value: res.data || [] }));
      });
      getAgentPriceList().then((res) => {
        dispatch(updateConfig({ key: "price", value: res.data || [] }));
      });
      getKOLInterface().then((res) => {
        dispatch(updateConfig({ key: "kols", value: res.data || [] }));
      });
      getAgentLimit().then((res) => {
        dispatch(updateConfig({ key: "limit", value: res.data || {} }));
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="text-primary w-full h-full">
      <div className="w-full h-full">
        <div className="w-full h-full relative z-1">
          <div className="flex justify-center items-center w-full h-full flex-col space-y-6">
            <Bot className="w-16 h-16 text-muted-foreground" />
            <dl className="text-center space-y-2">
              <dt className="text-2xl font-bold">The story starts here</dt>
              <dd className="text-base text-muted-foreground">
                Simply click the button above to create your first agent.
              </dd>
            </dl>
            <Button
              className="text-md"
              variant="primary"
              onClick={handleCreateKol}
            >
              Create your first agent
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
