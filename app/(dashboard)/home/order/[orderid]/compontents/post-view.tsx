"use client";
import React, { useEffect, useState, useRef } from "react";
import { OrderDetail } from "@/app/types/types";
import { useOrderPreview } from "@/app/context/OrderPreviewContext";
import { LoaderCircle } from "lucide-react";
import { checkPostRelevance, getPostDetail } from "@/app/request/api";
import { useParams } from "next/navigation";
import Markdown from "react-markdown";

export default function PostView({
  orderDetail,
}: {
  orderDetail: OrderDetail;
}) {
  const { tweetId, isVerified, setIsVerified } = useOrderPreview();
  const [isLoading, setIsLoading] = useState(false);
  const [time, setTime] = useState(0);
  const [post, setPost] = useState<any>(null);
  const { orderid } = useParams();
  const [text, setText] = useState<string>("Please verify the post");
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const getPost = async () => {
    try {
      const res: any = await getPostDetail({ tweet_id: tweetId });
      if (res.code === 200) {
        if (res.data.text) {
          setPost(res.data);
          setText("");
          return res.data;
        }
      } else {
        setText(res.msg);
        setIsVerified(false);
        return null;
      }
    } catch (error) {
      setIsVerified(false);
      console.error(error);
    }
  };

  const verifyTweet = async () => {
    try {
      setIsLoading(true);
      setTime(0);

      timerRef.current = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);

      const postResult = await getPost();
      const res = await checkPostRelevance({
        tweet: postResult.text,
        order_item_id: orderid,
      });

      clearTimer();
      setIsLoading(false);

      if (res.code === 200) {
        if (res.data.is_pass) {
          setIsVerified(true);
        } else {
          setIsVerified(false);
          setText("Verification failed");
        }
      } else {
        setIsVerified(false);
        setText("Verification failed");
      }
    } catch (error) {
      setIsVerified(false);
      setIsLoading(false);
      clearTimer();
      console.error(error);
    }
  };

  useEffect(() => {
    return () => {
      clearTimer();
    };
  }, []);

  useEffect(() => {
    if (tweetId) {
      verifyTweet();
    }
  }, [tweetId]);

  return (
    <div className="w-full h-full flex flex-col gap-2">
      {tweetId ? (
        <div className="bg-background rounded-md px-2 py-2 flex items-center space-x-1">
          {isLoading && <LoaderCircle className="w-4 h-4 animate-spin" />}
          <span className="text-md">
            {isLoading
              ? `Verifying... `
              : text
              ? `Verified: ${text}`
              : `Verified `}
            {`(use time ${time}s)`}
          </span>
        </div>
      ) : (
        <div className="bg-background rounded-md px-2 py-2 flex items-center space-x-1">
          <span className="text-md">Please verify the post</span>
        </div>
      )}
      {isVerified && post && (
        <div className="bg-background rounded-md px-2 py-2 text-md flex flex-col gap-2">
          <div className="w-full flex items-center gap-2">
            <div className="w-6 h-6 rounded-full overflow-hidden">
              <img src={orderDetail.kol.profile_image_url} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col gap-0">
              <span className="text-sm font-bold">{orderDetail.kol.name}</span>
              <span className="text-xs text-muted-foreground">@{orderDetail.kol.username}</span>
            </div>
          </div>
          <div className="w-full">
            <Markdown>{post.text}</Markdown>
            {post.medias && post.media_type === "photo" && (
              <div className="w-full">
                <img src={post.medias} alt="" className="w-full object-cover" />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
