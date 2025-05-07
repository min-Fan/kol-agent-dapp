"use client";
import TwitterView from "@/app/components/home/TwitterView";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronLeft, Zap } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Preview from "./compontents/preview";
import { useDispatch, useSelector } from "react-redux";
import { updateConfig, updateFrom } from "@/app/store/reducers/userSlice";
import { useAppSelector } from "@/app/store/hooks";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

export default function Layout({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const config = useSelector((state: any) => state.userReducer.config);

  const [selectAgent, setSelectAgent] = useState<string>("agent1");
  const [open, setOpen] = useState(false);

  // 快速创建函数
  const quickCreate = () => {
    const agent = templateList.find((item) => item.name === selectAgent);

    // // 步骤1默认值
    // const step1Default =  agent?.form.step1;

    // // 步骤2默认值
    // const step2Default =  agent?.form.step2;

    // // 步骤3默认值
    // const step3Default = {
    //   interactive: config.kols[0]?.name,
    // };

    // // 步骤4默认值
    // const step4Default = {
    //   topics: config.topics[0]?.name,
    // };
    setOpen(false);
    // 步骤5默认值
    const step5Default = {
      post: String(1),
      repost: String(1),
      quote: String(1),
      likes: String(1),
      reply: String(1),
      comment: String(1),
    };
    if (agent?.form) {
      dispatch(updateFrom({ key: "step1", value: agent.form.step1 }));
      dispatch(updateFrom({ key: "step2", value: agent.form.step2 }));
      dispatch(updateFrom({ key: "step3", value: agent.form.step3 }));
      dispatch(updateFrom({ key: "step4", value: agent.form.step4 }));
      dispatch(updateFrom({ key: "step5", value: step5Default }));
    }
    // 更新Redux状态

    // 设置当前步骤为第6步
    dispatch(updateConfig({ key: "currentStep", value: 5 }));
  
  };

  const isLoggedIn = useAppSelector(
    (state: any) => state.userReducer.isLoggedIn
  );
  const limit = useAppSelector((state) => state.userReducer.config.limit);
  const router = useRouter();
  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/home");
    }
    // if (!limit.agent) {
    //   toast.error("You have reached the maximum number of agents");
    //   router.push("/home");
    // }
  }, [isLoggedIn, limit]);

  const templateList = [
    {
      name: "agent1",
      form: {
        step1: {
          name: "Aria",
          gender: "female",
          character: "Smart and clever",
          region: "Afghanistan",
          language: "English",
        },
        step2: {
          ability:
            "Provide analysis of cryptocurrency price trends, interpretation of project fundamentals, and reminders of simple technical indicators.",
          name: "Cryptocurrency Analyst",
        },
        step3: {
          interactive: "Elon Musk",
        },
        step4: {
          topics: "web3,区块链,人工智能",
        },
      },
    },
    {
      name: "agent2",
      form: {
        step1: {
          name: "Alexander",
          gender: "male",
          character: "Smart and highly affable",
          region: "Singapore",
          language: "English",
        },
        step2: {
          ability:
            "Generate content such as horoscopes and tarot card interpretations within the realm of the occult.",
          name: "Mystical Divination",
        },
        step3: {
          interactive: "Elon Musk",
        },
        step4: {
          topics: "web3,区块链,人工智能",
        },
      },
    },
    {
      name: "agent3",
      form: {
        step1: {
          name: "Caleb",
          gender: "female",
          character: "Cheerful and outgoing",
          region: "Japan",
          language: "Japanese",
        },
        step2: {
          ability:
            "Generate various types of jokes and funny stories, ranging from dry humor to puns, catering to different senses of humor.",
          name: "Humor Master",
        },
        step3: {
          interactive: "Elon Musk",
        },
        step4: {
          topics: "web3,区块链,人工智能",
        },
      },
    },
    {
      name: "agent4",
      form: {
        step1: {
          name: "Isabella",
          gender: "female",
          character: "Introverted and focused",
          region: "South Korea",
          language: "Korean",
        },
        step2: {
          ability:
            "Conduct neutral analysis of Web3/technology projects, summarizing their strengths, weaknesses, and potential risks.",
          name: "Project Evaluator",
        },
        step3: {
          interactive: "Elon Musk",
        },
        step4: {
          topics: "web3,区块链,人工智能",
        },
      },
    },
  ];
  return (
    <div className="w-full h-full overflow-hidden grid grid-cols-24">
      <div className="col-span-16 h-full overflow-hidden flex flex-col flex-1 box-border p-2 md:p-4 lg:p-6">
        <div className="w-full flex items-center justify-between shadow-[0_10px_10px_20px_rgba(251,249,250,1)] pb-4">
          <Link href="/home">
            <div className="flex items-center gap-2">
              <ChevronLeft className="w-6 h-6" />
              <h1 className="text-base font-bold">Create Your Agent</h1>
            </div>
          </Link>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="flex gap-2"
                onClick={() => setOpen(true)}
              >
                <Zap className="w-4 h-4" />
                <span className="text-md">Create Quickly</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="w-lg min-w-[400px] text-primary">
              <DialogHeader>
                <DialogTitle className="text-lg font-bold">
                  Select Agent Template
                </DialogTitle>
                <DialogDescription>
                  Select a template to use for your Agent
                </DialogDescription>
              </DialogHeader>
              <div className="w-full max-h-[600px] space-y-4 overflow-auto">
                {templateList.map((item: any) => {
                  return (
                    <div
                      onClick={() => setSelectAgent(item.name)}
                      className={`bg-white  rounded-2xl p-6 space-y-2 border  hover:border-[#5C99F4] box-border cursor-pointer ${
                        item.name == selectAgent
                          ? "border-[#5C99F4]"
                          : "border-border"
                      }`}
                    >
                      <div className="flex justify-between">
                        <div className="text-base text-gray-800 space-x-2">
                          <span className="font-bold">
                            {item.form.step1.name} ({item.form.step2.name})
                          </span>
                          <div className="text-sm text-gray-500 space-x-1">
                            <span> {item.form.step1.gender}</span>
                            <span>{item.form.step1.region}</span>
                            <span>({item.form.step1.language})</span>
                          </div>
                        </div>
                        <div>
                          <Badge>{item.form.step1.character}</Badge>
                        </div>
                      </div>
                      <div className="text-md">{item.form.step2.ability}</div>
                      <div className=" space-x-1">
                        {item.form.step4.topics
                          .split(",")
                          .map((topic: string) => {
                            return <Badge>{topic}</Badge>;
                          })}
                      </div>
                    </div>
                  );
                })}
              </div>
              <Button variant="primary" onClick={quickCreate}>
                Next
              </Button>
            </DialogContent>
          </Dialog>
        </div>
        <div className="w-full flex-1 overflow-auto">{children}</div>
      </div>
      <div className="col-span-8 h-full overflow-hidden bg-foreground shadow-md">
        <Preview />
      </div>
    </div>
  );
}
