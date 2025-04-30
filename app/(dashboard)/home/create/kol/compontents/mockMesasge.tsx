import PreviewPost from "./preview-post";
import avatar from "@/app/assets/image/avatar.png";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useState } from "react";
export default function MockMessage() {
  const [isAgree, setIsAgree] = useState<boolean>(false);

  const handleClick = () => {
    setIsAgree(true);
  };
  return (
    <div className="flex-1 p-4 space-y-8 overflow-y-auto ">
      <div className="flex items-start space-x-2">
        <div className="w-8 h-8 rounded-full bg-gray-300  overflow-hidden">
          <Image src={avatar} alt="avatar" />
        </div>
        <div className="bg-gray-200 text-gray-800 px-4 py-2 rounded-sm max-w-[70%]">
          <div>
            The project team of "Satoshi Nakamoto" requires you to conduct
            promotion and has already paid a commission of 500 USDT. Please
            accept the order.
          </div>
          <div className="space-x-2 mt-2">
            <Button variant="default" onClick={handleClick}>
              Agree
            </Button>

            <Button variant="ghost">Reject</Button>
          </div>
        </div>
      </div>

      {isAgree && (
        <>
          <div className="flex justify-end items-start space-x-2">
            <div className="bg-green-500  px-4 py-2   rounded-sm max-w-[70%]">
              <PreviewPost
                content={
                  "自从这篇文章发布以来，我听说很多骗子都用相同的名字制造了硬币。官方的 USD1 还不能交易。请不要上当受骗"
                }
              />
            </div>
            <div className="w-8 h-8 rounded-full bg-green-400 overflow-hidden">
              <Image src={avatar} alt="avatar" />
            </div>
          </div>

          <div className="flex justify-end items-start space-x-2">
            <div className="bg-green-500  px-4 py-2 rounded-sm max-w-[70%]">
              The promotion has been completed.
            </div>
            <div className="w-8 h-8 rounded-full bg-green-400 overflow-hidden">
              <Image src={avatar} alt="avatar" />
            </div>
          </div>

          <div className="flex items-start space-x-2">
            <div className="w-8 h-8 rounded-full bg-gray-300  overflow-hidden">
              <Image src={avatar} alt="avatar" />
            </div>
            <div className="bg-gray-200 text-gray-800 px-4 py-2 rounded-sm max-w-[70%]">
              Thankyou for your promotion. I'm willing to pay 500 USDT. I'm
              looking forward to our next cooperation.
            </div>
          </div>
          <div className="flex justify-end items-start space-x-2">
            <div className="bg-green-500  px-4 py-2 rounded-sm max-w-[70%]">
              Thank you. I have already received it.
            </div>
            <div className="w-8 h-8 rounded-full bg-green-400 overflow-hidden">
              <Image src={avatar} alt="avatar" />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
