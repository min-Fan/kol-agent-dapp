"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Message from "./message";
import { AgentStatus } from "@/app/store/reducers/typs";
import DeleteConfirmation from "../compontents/delete-confirmation";
import { Trash, Loader2, Power, Play } from "lucide-react";
import { useAppSelector } from "@/app/store/hooks";
import { useRouter, useParams } from "next/navigation";
import TurnOffConfirmation from "../compontents/turn-off-confirmation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import Project from "./project";
import { Separator } from "@/components/ui/separator";
export default function page() {
  const agents = useAppSelector((state) => state.userReducer.agents);
  const { agentId } = useParams();
  return (
    <div className="flex gap-4 ">
      <div className="flex-1 space-y-4">
        <div className="flex flex-col xl:flex-row gap-4">
          <div className=" bg-foreground  rounded-md  xl:w-80 p-4">
            <div className="flex h-14 justify-center">
              <div className="text-lg w-full text-center">
                <p className=" font-bold">0</p>
                <p className="text-md">My reward points</p>
              </div>
              <Separator orientation="vertical" />
              <div className="text-lg w-full text-center ">
                <p className="font-bold">0</p>
                <p className="text-md">Invited KOLs</p>
              </div>
            </div>
          </div>
          <div className="flex-1 bg-foreground  rounded-md">
            <CardHeader>
              <CardTitle>Invitation Record</CardTitle>
            </CardHeader>

            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invited User</TableHead>
                    <TableHead>Reward Type</TableHead>
                    <TableHead>Reward Points</TableHead>
                    <TableHead>Reward Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">
                      <div className="flex justify-center items-center h-full w-full">
                        <span className="text-muted-foreground">No data</span>
                      </div>
                    </TableCell>
                  </TableRow>
                  {/* <TableRow>
                    <TableCell>INV001</TableCell>
                    <TableCell>Paid</TableCell>
                    <TableCell>Credit Card</TableCell>
                    <TableCell>$250.00</TableCell>
                  </TableRow> */}
                </TableBody>
              </Table>
            </CardContent>
          </div>
        </div>
        <Message></Message>
      </div>
      <div className="lg:w-[30%]">
        <div className="f-full  bg-foreground  rounded-md">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="text-md">
                <label className="text-md font-bold">Promote price</label>
                <Progress value={0} className="mt-2" />
              </div>

              {/* tips: 邀请用户赚取积分暂时不显示 */}
              {/* <div>
                <div className="flex space-x-4 justify-center h-10 ">
                  <Button className="flex-1">2158hf</Button>
                  <Separator orientation="vertical" />
                  <Button className="flex-1">Invite to Earn</Button>
                </div>
              </div> */}

              <Separator />

              <TurnOffConfirmation
                isTurnOff={
                  agents.find((agent) => agent.id == Number(agentId))
                    ?.status === AgentStatus.RUNING
                }
              >
                <Button
                  variant="outline"
                  className="flex gap-2 hover:bg-foreground hover:text-destructive-foreground w-full"
                >
                  {agents.find((agent) => agent.id == Number(agentId))
                    ?.status === AgentStatus.RUNING ? (
                    <Power className="size-4 min-w-4 text-destructive" />
                  ) : (
                    <Play className="size-4 min-w-4 text-secondary" />
                  )}
                  <span
                    className={cn(
                      "text-md font-bold",
                      agents.find((agent) => agent.id == Number(agentId))
                        ?.status === AgentStatus.RUNING
                        ? "text-destructive"
                        : "text-secondary"
                    )}
                  >
                    {agents.find((agent) => agent.id == Number(agentId))
                      ?.status === AgentStatus.RUNING
                      ? "Turn Off"
                      : "Turn On"}
                  </span>
                </Button>
              </TurnOffConfirmation>
              <DeleteConfirmation>
                <Button
                  variant="outline"
                  className="flex gap-2 hover:bg-foreground hover:text-destructive-foreground w-full"
                >
                  <Trash className="size-4 min-w-4 text-destructive" />
                  <span className="text-md font-bold text-destructive">
                    Delete
                  </span>
                </Button>
              </DeleteConfirmation>
            </div>
          </CardContent>
        </div>
        <Separator />
        <div className="space-y-4">
          <Project></Project>
        </div>
      </div>
    </div>
  );
}
