export interface UserInfo {
  id: number;
  username: string;
  email: string;
  identity: string;
  member_id: number;
  member_name: string;
  token: string;
}

export type Config = {
  region: any[];
  language: any[];
  character: any[];
  topics: any[];
}
