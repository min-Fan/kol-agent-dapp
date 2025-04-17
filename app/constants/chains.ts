import { Chain, optimism, sepolia } from "wagmi/chains";

// 扩展 Chain 类型以包含 iconUrl
interface ExtendedChain extends Chain {
  iconUrl?: string; // 可选属性
  iconBackground?: string;
}

export const chain: { [key: string]: ExtendedChain } = {
  "11155111": {
    id: 11155111,
    name: "Sepolia",
    iconUrl:
      "https://static.oklink.com/cdn/assets/imgs/234/394F7F0E5AA398F0.png",
    iconBackground: "#fff",
    nativeCurrency: { name: "Sepolia", symbol: "ETH", decimals: 18 },
    rpcUrls: {
      default: { http: ["https://sepolia.infura.io/v3/"] },
    },
    blockExplorers: {
      default: {
        name: "Etherscan Sepolia",
        url: "https://sepolia.etherscan.io",
      },
    },
    contracts: {},
  } as const satisfies ExtendedChain,
  "32382": {
    id: 32382,
    name: "Agent Chain",
    iconUrl:
      "https://scan.agtchain.net/static-img/5.png",
    iconBackground: "#fff",
    nativeCurrency: { name: "AGT", symbol: "AGT", decimals: 18 },
    rpcUrls: {
      default: { http: ["https://rpc.agtchain.net"] },
    },
    blockExplorers: {
      default: {
        name: "Agent Chain Explorer",
        url: "https://scan.agtchain.net",
      },
    },
    contracts: {},
  } as const satisfies ExtendedChain,
};
export const getChain = (chainId: number) => {
  return chain[chainId];
};

// 生成区块浏览器链接
export const getExplorerLink = (
  chainId: number,
  data: string,
  type: "transaction" | "address" = "transaction"
) => {
  if (!data || !chainId) return "";
  const currentChain = chain[chainId];
  if (!currentChain?.blockExplorers?.default?.url) {
    return "";
  }

  const baseUrl = currentChain.blockExplorers.default.url;
  const path = type === "transaction" ? "tx" : "address";
  return `${baseUrl}/${path}/${data}`;
};

// 支持的链配置
export const SUPPORTED_CHAINS = [chain["32382"]] as const;

// 获取支持的链ID数组
export const SUPPORTED_CHAIN_IDS = SUPPORTED_CHAINS.map((chain) => chain.id);

// 默认链
export const DEFAULT_CHAIN = chain["32382"];
