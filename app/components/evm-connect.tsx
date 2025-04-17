/* This code snippet is a TypeScript React component that generates an SVG pattern based on a given
address string. Here's a breakdown of what it does: */
import {
  AvatarComponent,
  ConnectButton,
  useAccountModal,
} from "@rainbow-me/rainbowkit";
import React, { useEffect } from "react";
import { useDisconnect } from "wagmi";
import { useAppDispatch } from "../store/hooks";
import { SUPPORTED_CHAIN_IDS } from "../constants/chains";
import { generateColorFromAddress } from "../utils/avatar";
import AddressAvatar from "./address-avatar";
import { updateChain } from "../store/reducers/userSlice";
import { Button } from "@/components/ui/button";

interface ConnectButProps {
  onClick: () => void;
  className: string;
  children: React.ReactNode;
}

// 自定义按钮
const ConnectBut: React.FC<ConnectButProps> = ({
  onClick,
  className,
  children,
}) => {
  return (
    <div onClick={onClick} className={className}>
      {children}
    </div>
  );
};

// 自定义头像
const CustomAvatar: AvatarComponent = ({ address, ensImage, size }) => {
  const color = generateColorFromAddress(address);
  return ensImage ? (
    <img
      src={ensImage}
      width={size}
      height={size}
      style={{ borderRadius: 999 }}
    />
  ) : (
    <div
      className="rounded-full flex items-center justify-center"
      style={{
        backgroundColor: color,
        borderRadius: 999,
        height: size,
        width: size,
      }}
    >
      <AddressAvatar address={address} />
    </div>
  );
};

// 自定义连接按钮
export default function EvmConnect() {
  const dispatch = useAppDispatch();
  const { disconnect } = useDisconnect();

  return (
    <div className="w-full mx-auto">
      <ConnectButton.Custom>
        {({
          account,
          chain,
          openAccountModal,
          openChainModal,
          openConnectModal,
          mounted,
        }) => {
          useEffect(() => {
            if (chain) {
              // 检查是否是支持的链
              if (!SUPPORTED_CHAIN_IDS.includes(chain.id as any)) {
                // 如果不是支持的链，断开连接
                // 使用 setTimeout 来避免状态更新循环
                setTimeout(() => {
                  disconnect();
                }, 0);
                return;
              }
              // 更新当前链ID
              dispatch(updateChain(chain.id));
            }
          }, [chain, dispatch, disconnect]);

          return (
            <div className="w-full mx-auto">
              {!mounted || !account ? (
                <ConnectBut
                  onClick={openConnectModal}
                  className=""
                >
                  <Button variant="primary" className="w-full font-bold">
                    Connect Wallet
                  </Button>
                </ConnectBut>
              ) : (
                <div className="flex items-center gap-2">
                  {chain && (
                    <div
                      onClick={openChainModal}
                      className="flex items-center gap-[14px] bg-foreground shadow-sm border p-[3px] pr-[10px] sm:pr-[3px] rounded-[20px] text-[12px] font-gt cursor-pointer"
                    >
                      <img
                        src={chain.iconUrl}
                        alt=""
                        className="w-[24px] h-[24px] rounded-full"
                      />
                      <span className="text-[12px] sm:hidden">
                        {chain.name}
                      </span>
                    </div>
                  )}
                  <div
                    onClick={openAccountModal}
                    className="flex items-center gap-[14px] bg-foreground shadow-sm border p-[3px] pr-[10px] rounded-[20px] text-[12px] font-gt cursor-pointer"
                  >
                    <CustomAvatar
                      address={account.address}
                      ensImage={account.ensAvatar}
                      size={24}
                    />
                    {account.displayName}
                  </div>
                </div>
              )}
            </div>
          );
        }}
      </ConnectButton.Custom>
    </div>
  );
}
