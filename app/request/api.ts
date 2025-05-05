import request from "./request";

// 聊天
export async function chat(params: any) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/kol/api/v1/chat`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "text/event-stream",
        },
        body: JSON.stringify(params),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response;
  } catch (error) {
    console.error("聊天失败:", error);
    throw error;
  }
}

// 发送邮箱验证码
export async function sendEmailCode(data: any) {
  try {
    const res = await request.get("/kol/api/v1/email/code", { ...data });
    return res;
  } catch (error: any) {
    console.log(error);
    return error;
  }
}

// 注册
export async function register(data: any) {
  try {
    const res = await request.post("/kol/api/v1/register", { ...data });
    return res;
  } catch (error: any) {
    console.log(error);
    return error;
  }
}

// 登录
export async function login(data: any) {
  try {
    const res = await request.post("/kol/api/v1/login", { ...data });
    return res;
  } catch (error: any) {
    console.log(error);
    return error;
  }
}

// 获取用户可以购买的会员
export async function getUserCanBuyMember() {
  try {
    const res = await request.get("/kol/api/v1/all/members");
    return res;
  } catch (error: any) {
    console.log(error);
    return error;
  }
}
// 重置密码
export async function resetPassword(data: any) {
  try {
    const res = await request.post("/kol/api/v1/user/resetpwd", { ...data });
    return res;
  } catch (error: any) {
    console.log(error);
    return error;
  }
}

// 获取用户信息
export async function getUserInfo() {
  try {
    const res = await request.get("/kol/api/v1/user/info");
    return res;
  } catch (error: any) {
    console.log(error);
    return error;
  }
}

// 获取常量
export async function getConstants(params: any) {
  try {
    const res = await request.get("/kol/api/v1/constants", { ...params });
    return res;
  } catch (error: any) {
    console.log(error);
    return error;
  }
}

// 创建Agent
export async function createAgent(data: any) {
  try {
    const res = await request.post("/kol/api/v1/agents/", { ...data });
    return res;
  } catch (error: any) {
    console.log(error);
    return error;
  }
}

// agent 列表
export async function getAgentList() {
  try {
    const res = await request.get("/kol/api/v1/agents/self/");
    return res;
  } catch (error: any) {
    console.log(error);
    return error;
  }
}

// 获取能力列表
export async function getAbilityList() {
  try {
    const res = await request.get("/kol/api/v1/abilities/");
    return res;
  } catch (error: any) {
    console.log(error);
    return error;
  }
}

// 创建agent的时候，获取agent的定价套餐
export async function getAgentPriceList() {
  try {
    const res = await request.get("/kol/api/v1/agent/menus");
    return res;
  } catch (error: any) {
    console.log(error);
    return error;
  }
}

// 获取KOL的接口
export async function getKOLInterface() {
  try {
    const res = await request.get("/kol/api/v1/kols");
    return res;
  } catch (error: any) {
    console.log(error);
    return error;
  }
}

// 创建agent时，获取六项动作的限制数，以及还可以创建几个agent
export async function getAgentLimit() {
  try {
    const res = await request.get("/kol/api/v1/limit");
    return res;
  } catch (error: any) {
    console.log(error);
    return error;
  }
}

// login 1. 获取twitter授权链接
export async function getTwitterAuthLink(params: any) {
  try {
    const res = await request.get("/kol/api/v1/x/koluser/authorization/", {
      ...params,
    });
    return res;
  } catch (error: any) {
    console.log(error);
    return error;
  }
}

// login 2. 授权回调调用
export async function getTwitterAuthCallback(data: any) {
  try {
    const res = await request.post("/kol/api/v1/x/get_access_token/", {
      ...data,
    });
    return res;
  } catch (error: any) {
    console.log(error);
    return error;
  }
}

// login 3. 获取用户信息
export async function getUserInfoByTwitter(data: any) {
  try {
    const res = await request.get("/kol/api/v1/x/profile/", { ...data });
    return res;
  } catch (error: any) {
    console.log(error);
    return error;
  }
}

// login 4. 授权完成后的回调
export async function getTwitterAuthCompleteCallback(data: any) {
  try {
    const res = await request.post("/kol/api/v1/x/koluser/callback/", {
      ...data,
    });
    return res;
  } catch (error: any) {
    console.log(error);
    return error;
  }
}

// create 1. 获取twitter授权链接
export async function getCreateTwitterAuthLink(params: any) {
  try {
    const res = await request.get("/kol/api/v1/x/authorization/", {
      ...params,
    });
    return res;
  } catch (error: any) {
    console.log(error);
    return error;
  }
}

// create 2. 授权回调调用
export async function getCreateTwitterAuthCallback(data: any) {
  try {
    const res = await request.post("/kol/api/v1/x/get_access_token/", {
      ...data,
    });
    return res;
  } catch (error: any) {
    console.log(error);
    return error;
  }
}

// create 3. 获取用户信息
export async function getCreateUserInfoByTwitter(data: any) {
  try {
    const res = await request.get("/kol/api/v1/x/profile/", { ...data });
    return res;
  } catch (error: any) {
    console.log(error);
    return error;
  }
}

// create 4. 授权完成后的回调
export async function getCreateTwitterAuthCompleteCallback(data: any) {
  try {
    const res = await request.post("/kol/api/v1/x/callback/", { ...data });
    return res;
  } catch (error: any) {
    console.log(error);
    return error;
  }
}

// 获取 kol message
export async function getKolMessage(params: any) {
  try {
    const res = await request.get("/kol/api/v1/kol/msglist", { ...params });
    return res;
  } catch (error: any) {
    console.log(error);
    return error;
  }
}

// 获取订单列表
export async function getOrderList(params: any) {
  try {
    const res = await request.get("/kol/api/v1/kol/order/list", { ...params });
    return res;
  } catch (error: any) {
    console.log(error);
    return error;
  }
}

// 获取订单详情
export async function getOrderDetail(params: any) {
  try {
    const res = await request.get("/kol/api/v1/kol/order/detail", {
      ...params,
    });
    return res;
  } catch (error: any) {
    console.log(error);
    return error;
  }
}

// 修改订单选项审核状态或agent_id接口
export async function updateOrderOption(params: any) {
  try {
    const res = await request.post("/kol/api/v1/kol/order/item/edit", {
      ...params,
    });
    return res;
  } catch (error: any) {
    console.log(error);
    return error;
  }
}

// 上传自己发的推文链接
export async function uploadSelfPostLink(params: any) {
  try {
    const res = await request.post("/kol/api/v1/submit/tweets/", { ...params });
    return res;
  } catch (error: any) {
    console.log(error);
    return error;
  }
}

// 订单选项关联agent_id 接口
export async function bindOrderOptionAgentId(params: any) {
  try {
    const res = await request.post("/kol/api/v1/kol/order/item/agent/bind", {
      ...params,
    });
    return res;
  } catch (error: any) {
    console.log(error);
    return error;
  }
}

// 修改订单选项审核状态
export async function updateOrderOptionStatus(params: any) {
  try {
    const res = await request.post("/kol/api/v1/kol/order/item/edit", {
      ...params,
    });
    return res;
  } catch (error: any) {
    console.log(error);
    return error;
  }
}

// 生成推文内容
export async function generatePostContent(params: any) {
  try {
    const res = await request.post("/kol/api/v1/tweets/content/gen", {
      ...params,
    });
    return res;
  } catch (error: any) {
    console.log(error);
    return error;
  }
}

// 手动发推
export async function sendPost(params: any) {
  try {
    const res = await request.post("/kol/api/v1/tweets/post", { ...params });
    return res;
  } catch (error: any) {
    console.log(error);
    return error;
  }
}

// 推文相关性检查
export async function checkPostRelevance(params: any) {
  try {
    const res = await request.post("/kol/api/v1/verify/tweets/", { ...params });
    return res;
  } catch (error: any) {
    console.log(error);
    return error;
  }
}

// 更新agent的运行状态
export async function updateAgentStatus(agent_id: string, params: any) {
  try {
    const res = await request.post(`/kol/api/v1/agent/status/${agent_id}/`, {
      ...params,
    });
    return res;
  } catch (error: any) {
    console.log(error);
    return error;
  }
}

// 通过推文ID获取推文
export async function getPostDetail(params: any) {
  try {
    const res = await request.get("/kol/api/v1/get/tweets/", { ...params });
    return res;
  } catch (error: any) {
    console.log(error);
    return error;
  }
}

// 购买会员下单接口
export async function createBuyMemberOrder(params: any) {
  try {
    const res = await request.post("/kol/api/v1/member/order", { ...params });
    return res;
  } catch (error: any) {
    console.log(error);
    return error;
  }
}

// 购买会员支付接口
export async function payBuyMemberOrder(params: any) {
  try {
    const res = await request.post("/kol/api/v1/member/pay", { ...params });
    return res;
  } catch (error: any) {
    console.log(error);
    return error;
  }
}

// 删除Agent
export async function deleteAgent(agent_id: string) {
  try {
    const res = await request.delete(`/kol/api/v1/agents/${agent_id}/`);
    return res;
  } catch (error: any) {
    console.log(error);
    return error;
  }
}

//下单金额最多的5个project
export async function getProjectTopFive() {
  try {
    const res = await request.get(`/kol/api/v1/top-projects/`);
    return res;
  } catch (error: any) {
    console.log(error);
    return error;
  }
}

// 获取钱包收款地址
export async function getWalletReceiveAddress() {
  try {
    const res = await request.get(
      `/kol/api/v1/platform/wallet/receive/address`
    );
    return res;
  } catch (error: any) {
    console.log(error);
    return error;
  }
}

//查询平台信息
export async function getKOLNotice(params:any) {
  try {
    const res = await request.get(`/kol/api/v1/platform/msg`, params);
    return res;
  } catch (error: any) {
    console.log(error);
    return error;
  }
}
