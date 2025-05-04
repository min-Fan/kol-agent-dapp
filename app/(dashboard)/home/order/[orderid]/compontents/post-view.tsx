"use client";
import React, { useEffect, useState, useRef } from "react";
import { OrderDetail } from "@/app/types/types";
import { useOrderPreview } from "@/app/context/OrderPreviewContext";
import { LoaderCircle, RefreshCw } from "lucide-react";
import { checkPostRelevance, getPostDetail } from "@/app/request/api";
import { useParams } from "next/navigation";
import Markdown from "react-markdown";
import { Button } from "@/components/ui/button";

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
        setText(res.msg || "Failed to get post details");
        setIsVerified(false);
        return null;
      }
    } catch (error) {
      setIsVerified(false);
      setText("Error fetching post details");
      console.error(error);
      return null;
    }
  };

  const verifyTweet = async () => {
    if (!tweetId) {
      setText("No tweet ID provided");
      return;
    }
    
    try {
      setIsLoading(true);
      setTime(0);
      setText("Verifying post...");

      timerRef.current = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);

      const postResult = await getPost();
      
      // 如果没有获取到推文内容，提前结束
      if (!postResult) {
        clearTimer();
        setIsLoading(false);
        return;
      }
      
      const res = await checkPostRelevance({
        tweet: postResult.text,
        order_item_id: orderid,
      });

      clearTimer();
      setIsLoading(false);

      if (res.code === 200) {
        if (res.data.is_pass) {
          setIsVerified(true);
          setText("Verification successful");
        } else {
          setIsVerified(false);
          setText(res.data.reason || "Verification failed: Content doesn't match requirements");
        }
      } else {
        setIsVerified(false);
        setText(res.msg || "Verification API failed");
      }
    } catch (error) {
      setIsVerified(false);
      setIsLoading(false);
      setText("Error during verification");
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
      <div className="bg-background rounded-md px-2 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-1">
          {isLoading && <LoaderCircle className="w-4 h-4 animate-spin" />}
          <span className="text-md">
            {isLoading
              ? `Verifying... `
              : text
              ? `${text} `
              : `Verified `}
            {`(use time ${time}s)`}
          </span>
        </div>
        
        {/* 添加重新验证按钮 */}
        {!isLoading && tweetId && !isVerified && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={verifyTweet} 
            className="flex items-center gap-1"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Retry</span>
          </Button>
        )}
      </div>
      
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
      
      {/* 当验证失败时显示失败原因和建议 */}
      {!isVerified && !isLoading && tweetId && text.includes("failed") && (
        <div className="bg-red-50 border border-red-200 rounded-md px-4 py-3 text-sm text-red-800">
          <p className="font-semibold mb-1">Verification failed</p>
          <p>{text}</p>
          <p className="mt-2">Tips: Make sure your tweet contains the required content and matches the project requirements.</p>
        </div>
      )}
    </div>
  );
}
