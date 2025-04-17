import { UserInfoData } from "@/app/types/types";

export interface UserInfo {
  id: number;
  username: string;
  email: string;
  identity: string;
  member_id: number;
  member_name: string;
  is_x_authorizationed: boolean;
  screen_name: string;
  profile_image_url: string;
  description: string | null;
  token: string;
  details: UserInfoData;
}

export type Config = {
  region: any[];
  language: any[];
  character: any[];
  topics: any[];
  ability: any[];
  price: any[];
  kols: any[];
  limit: {
    post: number;
    repost: number;
    likes: number;
    quote: number;
    reply: number;
    comment: number;
    agent: number;
  };
  currentStep: number;
}

export type From = {
  step1: any;
  step2: any;
  step3: any;
  step4: any;
  step5: any;
  step6: any; 
}

export enum AgentStatus {
  RUNING = "RUNING",
  CLOSE = "CLOSE",
}
export interface Agent {
  /**
   * 能力
   */
  abilitys: string;
  characters: string[];
  /**
   * 头像
   */
  icon?: string;
  /**
   * agent id
   */
  id: number;
  /**
   * agent名字
   */
  name?: string;
  /**
   * 地区
   */
  region: string;
  /**
   * 状态，RUNING 是运行中，CLOSE是关闭了
   */
  status: AgentStatus;
  /**
   * 推特名
   */
  x_username?: string;
}