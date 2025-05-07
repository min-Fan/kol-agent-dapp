"use client";
// import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import StepOne from "./compontents/step1";
import StepTwo from "./compontents/step2";
import StepThree from "./compontents/step3";
import StepFour from "./compontents/step4";
import StepFive from "./compontents/step5";
import StepSix from "./compontents/step6";
import Stepper, { Step } from "@/app/components/comm/Stepper";
import { ScrollArea } from "@/components/ui/scroll-area";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  getAbilityList,
  getAgentLimit,
  getAgentPriceList,
  getConstants,
  getKOLInterface,
} from "@/app/request/api";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { updateConfig, clearFrom, updateTwitterFullProfile } from "@/app/store/reducers/userSlice";
import { useRouter } from "next/navigation";
import { useCreateXauthDialog } from "@/app/hooks/useCreateXauthDialog";
import { useSearchParams } from "next/navigation";
import { useGetAgents } from "@/app/hooks/useGetAgents";
import dynamic from 'next/dynamic'
// import type { DotLottieReactProps } from '@lottiefiles/dotlottie-react'
const DotLottieReact = dynamic(() => import('@lottiefiles/dotlottie-react').then(mod => mod.DotLottieReact), {
  ssr: false,
})
const CreateSuccess = () => {
  const { getAgents } = useGetAgents();
  const dispatch = useAppDispatch();
  const router = useRouter();
  return (
    <>
      <DotLottieReact
        className="w-full h-full fixed top-0 left-0 z-[1]"
        src="/lottie/celebrations.lottie"
        autoplay
      />
      <div className="w-full flex items-center justify-center flex-col gap-4 text-primary">
        <div className="w-full h-full top-0 left-0">
          <DotLottieReact
            className="w-full"
            src="/lottie/checked.lottie"
            autoplay
          />
        </div>
        <Button
          variant="primary"
          className="w-auto font-bold relative z-10"
          onClick={() => {
            getAgents();
            dispatch(updateTwitterFullProfile(null));
            router.push("/home");
          }}
        >
          Go to Home
        </Button>
      </div>
    </>
  );
};

export default function Page() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const isLoggedIn = useAppSelector(
    (state: any) => state.userReducer.isLoggedIn
  );

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/home");
    }
  }, [isLoggedIn]);

  const currentStep = useAppSelector(
    (state: any) => state.userReducer.config.currentStep
  );

  const { openCreateXauthDialog } = useCreateXauthDialog();
  const params = useSearchParams();
  useEffect(() => {
    dispatch(clearFrom());
    dispatch(updateTwitterFullProfile(null));
    dispatch(
      updateConfig({
        key: "currentStep",
        value: 1,
      })
    );
    const oauth_token = params.get("oauth_token");
    if (oauth_token) {
      // 打开twitter授权弹窗
      dispatch(
        updateConfig({
          key: "currentStep",
          value: 6,
        })
      );
      setTimeout(() => {
        openCreateXauthDialog();
      }, 500);
    }
  }, []);

  return (
    <div className="w-full h-full flex max-w-2xl mx-auto">
      <div className="w-full h-full">
        <Stepper
          initialStep={currentStep || 1}
          stepText={[
            "1. Info",
            "2. Ability",
            "3. Interactive",
            "4. Topics",
            "5. Configuration",
            "6. Profit",
          ]}
          onStepChange={(step) => {
            console.log(step);
          }}
          onFinalStepCompleted={() => console.log("All steps completed!")}
          backButtonText="Previous"
          nextButtonText="Next"
          completedContent={<CreateSuccess />}
        >
          <Step>
            <ScrollArea className="w-full">
              <StepOne />
            </ScrollArea>
          </Step>
          <Step>
            <StepTwo />
          </Step>
          <Step>
            <StepThree />
          </Step>
          <Step>
            <StepFour />
          </Step>
          <Step>
            <ScrollArea className="w-full">
              <StepFive />
            </ScrollArea>
          </Step>
          <Step>
            <ScrollArea className="w-full">
              <StepSix />
            </ScrollArea>
          </Step>
        </Stepper>
      </div>
    </div>
  );
}
