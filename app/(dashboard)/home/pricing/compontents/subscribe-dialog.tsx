"use client";
import React, { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  useAccount,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import EvmConnect from "@/app/components/evm-connect";
import {
  createBuyMemberOrder,
  getWalletReceiveAddress,
  payBuyMemberOrder,
} from "@/app/request/api";
import { toast } from "sonner";
import { erc20Abi } from "viem";
import { useAppSelector } from "@/app/store/hooks";
import { Loader2, ChevronRight } from "lucide-react";
import {
  pay_member_receiver_address,
  pay_member_token_address,
} from "@/app/constants/config";
import { useGetInfo } from "@/app/hooks/useGetInfo";
import { useGetConst } from "@/app/hooks/useGetConst";
import NumberStepper from "./numberStepper";
import { mathUtils } from "@/app/utils";
export default function SubscribeDialog({
  TriggerButton,
  item,
}: {
  TriggerButton: React.ReactNode;
  item: any;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const { address } = useAccount();
  const [loading, setLoading] = useState(false);
  const [month, setMonth] = useState(1); // 购买月数量
  const [orderId, setOrderId] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [orderLoading, setOrderLoading] = useState(false);

  // 处理连接钱包按钮点击
  const handleConnectClick = () => {
    // 先关闭当前对话框
    setIsOpen(false);
  };

  const { data: decimals, refetch: refetchDecimals } = useReadContract({
    address: pay_member_token_address as `0x${string}`,
    abi: erc20Abi,
    functionName: "decimals",
  });

  const {
    data: hash,
    writeContract: writeContractTransfer,
    isPending: isPendingTransfer,
    isError: isErrorTransfer,
    error: errorTransfer,
  } = useWriteContract();
  const {
    isLoading: isTransferring,
    isSuccess: isConfirmedTransfer,
    isError: isErrorWaitForTransactionReceiptTransfer,
    error: errorWaitForTransactionReceiptTransfer,
  } = useWaitForTransactionReceipt({
    hash: hash,
  });

  const info = useAppSelector((state) => state.userReducer.userInfo);
  const openDialog = async (open: boolean) => {
    try {
      if (!item.purchase)
        return toast.error("This plan is not available for purchase");
      
      if (open) {
        setIsOpen(open);
        // 初始化时重置月数，避免上次选择的值影响新订单
        setMonth(1);
        await orderCreate(1); // 创建默认1个月的订单
      } else {
        setIsOpen(open);
      }
    } catch (error: any) {
      setLoading(false);
      toast.error(error.message);
    }
  };

  const handleSubscribe = async () => {
    try {
      setLoading(true);

      const res = await getWalletReceiveAddress();
      if (res.code !== 200) return;
      // 转账代币
      await writeContractTransfer({
        address: pay_member_token_address,
        abi: erc20Abi,
        functionName: "transfer",
        args: [
          // pay_member_receiver_address,
          res.data.platform_receive_address, //钱包收款地址
          mathUtils.convertAmountToBigInt(amount, Number(decimals)),
        ],
      });
    } catch (error: any) {
      setLoading(false);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const { getConst } = useGetConst();
  const { getInfo } = useGetInfo();
  const handlePay = async () => {
    try {
      setLoading(true);
      const res = await payBuyMemberOrder({
        order_no: orderId,
        tx_hash: hash,
      });
      setLoading(false);
      if (res.code === 200) {
        toast.success("Subscribe successfully");
        getConst();
        getInfo();
        setIsOpen(false);
      } else {
        toast.error(res.msg);
      }
    } catch (error: any) {
      setLoading(false);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (isConfirmedTransfer) {
      handlePay();
    }
    if (isErrorWaitForTransactionReceiptTransfer) {
      setLoading(false);
      toast.error(errorWaitForTransactionReceiptTransfer?.message);
    }
    if (isPendingTransfer) {
      setLoading(true);
    }
    if (isErrorTransfer) {
      setLoading(false);
      // toast.error(errorTransfer?.message);
    }
  }, [isErrorTransfer, errorTransfer, isConfirmedTransfer, isPendingTransfer]);

  // 修改订单创建函数，接受月数参数
  const orderCreate = async (monthsToOrder = month) => {
    try {
      setOrderLoading(true);
      const order = await createBuyMemberOrder({
        member_id: item.id,
        month_num: monthsToOrder,
      });
      
      if (order && order.data) {
        setOrderId(order.data.order_no);
        setAmount(order.data.amount);
      } else {
        toast.error("Failed to create order");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to create order");
    } finally {
      setOrderLoading(false);
    }
  };

  // 处理月数变更，确保在变更后创建新订单
  const handleMonthChange = async (value: number) => {
    setMonth(value);
    await orderCreate(value); // 立即用新的月数创建订单
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => openDialog(open)}
      modal={true}
    >
      <DialogTrigger asChild>{TriggerButton}</DialogTrigger>
      <DialogContent
        className="w-full lg:w-[400px] text-primary p-0 overflow-hidden border-none"
        // onPointerDownOutside={(e) => {
        //   // 阻止点击外部区域关闭对话框
        //   e.preventDefault();
        // }}
        // onInteractOutside={(e) => {
        //   // 阻止与外部区域交互关闭对话框
        //   e.preventDefault();
        // }}
        showClose={false}
      >
        <DialogHeader>
          <DialogTitle>
            <p className="text-lg font-bold text-center p-6 bg-gradient-to-r from-[#0bbdb6]/90 to-[#00d179]/90 text-foreground">
              Add your Payment details
            </p>
          </DialogTitle>
          <DialogDescription className="hidden"></DialogDescription>
        </DialogHeader>
        <div className="w-full flex flex-col items-center justify-center gap-2 p-4 pt-0">
          <div className="w-full border rounded-md p-4 flex items-center justify-between bg-slate-100 text-md">
            <span className="text-slate-500 flex">{item.name} - {month} month{month > 1 ? 's' : ''}</span>
            <span className="font-bold ">${item.price}</span>
          </div>
          <div className="w-full flex flex-col items-center justify-center gap-2">
            <div className="w-full flex items-center justify-between">
              <span className="text-md">Month</span>
              <span className="font-bold text-xl">
                <NumberStepper
                  value={month}
                  min={1}
                  max={12}
                  onChange={handleMonthChange}
                  disabled={orderLoading} // 订单创建过程中禁用月数选择
                ></NumberStepper>
              </span>
            </div>
          </div>
          <div className="w-full flex flex-col items-center justify-center gap-2">
            <div className="w-full flex items-center justify-between">
              <span className="text-md">Total</span>
              <span className="text-secondary font-bold text-xl">
                {orderLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
                ) : (
                  <>
                    {amount || (item.price * month)} USDT
                  </>
                )}
              </span>
            </div>
          </div>
          <div className="w-full h-[1px] border border-dashed"></div>
          {info.member_id !== 4 && (
            <div className="w-full flex items-center p-2 border border-orange-100 bg-amber-100 rounded-md mt-2">
              <span className="text-orange-300 text-sm">
                Once you upgrade your membership, the premium version will fully
                subsume all the functions of the basic version, seamlessly
                inherit your existing benefits, and unlock more exclusive
                experiences.
              </span>
            </div>
          )}
          <div className="w-full">
            {address ? (
              <Button
                className="w-full font-bold"
                variant="primary"
                disabled={loading || orderLoading}
                onClick={handleSubscribe}
              >
                {loading || orderLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Subscribe"
                )}
              </Button>
            ) : (
              // 包装EvmConnect组件，添加点击事件
              <div onClick={handleConnectClick}>
                <EvmConnect />
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
