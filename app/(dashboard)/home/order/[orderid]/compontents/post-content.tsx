"use client";
import React, { useState, useEffect, useRef } from "react";
import { LoaderCircle, PencilLine, Check, X } from "lucide-react";
import { generatePostContent, sendPost } from "@/app/request/api";
import { OrderDetail, OrderPreviewType } from "@/app/types/types";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useOrderPreview } from "@/app/context/OrderPreviewContext";
import { toast } from "sonner";
import Markdown from "react-markdown";
import { useRouter } from "next/navigation";
export default function PostContent({
  orderDetail,
}: {
  orderDetail: OrderDetail;
}) {
  const { setStatus, setTweetId } = useOrderPreview();
  const [isLoading, setIsLoading] = useState(false);
  const [postLoading, setPostLoading] = useState<number | null>(null);
  const [time, setTime] = useState(0);
  const [posts, setPosts] = useState<any[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editedContent, setEditedContent] = useState("");

  const getPosts = async () => {
    try {
      if (!orderDetail.buy_agent_order.project?.id) return toast.error("Project not found");
      setIsLoading(true);
      setTime(0); // 重置计时器
      // 启动计时器
      timerRef.current = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);

      const res = await generatePostContent({
        project_id: orderDetail.buy_agent_order.project.id,
        agent_id: orderDetail.agent_id,
      });

      // 请求完成，清除计时器
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      setIsLoading(false);
      if (res.code === 200) {
        setPosts(res.data);
      }
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      // 发生错误时也要清除计时器
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  // 组件卸载时清除计时器
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    getPosts();
  }, [orderDetail, orderDetail.buy_agent_order.project?.id]);

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setEditedContent(posts[index]);
  };

  const handleSave = (index: number) => {
    const newPosts = [...posts];
    newPosts[index] = editedContent;
    setPosts(newPosts);
    setEditingIndex(null);
    // 这里可以添加API调用来保存修改后的内容
  };

  const handleCancel = () => {
    setEditingIndex(null);
    setEditedContent("");
  };

  const router = useRouter();
  const handlePostTweet = async (content: string, index: number) => {
    try {
      setPostLoading(index);
      const res = await sendPost({
        order_item_id: orderDetail.id,
        content: content
      });
      
      if (res.code === 200) {
        toast.success("Post sent successfully");
        router.push(`/home/order`);
        // setTweetId(res.data.tweets_id);
        // 切换到验证视图
        // setStatus(OrderPreviewType.POST_VIEW);
      } else {
        setPostLoading(null);
        toast.error(res.msg || "Failed to send post");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to send post");
      setPostLoading(null);
    }
  };

  return (
    <div className="w-full h-full flex flex-col gap-4">
      <div className="bg-background rounded-md px-2 py-2 flex items-center space-x-1">
        {isLoading && <LoaderCircle className="w-4 h-4 animate-spin" />}
        <span className="text-md">
          {isLoading ? `Content is being edited... ` : `Content is ready `}
          {`(use time ${time}s)`}
        </span>
      </div>
      <div className="w-full flex flex-col gap-2">
        {posts.map((post, index) => (
          <div className="w-full flex flex-col gap-1" key={index}>
            <div className="w-full flex items-center gap-2 pl-2">
              <span className="text-md font-bold pr-2 border-r border-border">
                Twitter Case {index + 1}
              </span>
              <Button 
                variant="link" 
                className="p-0 text-secondary"
                onClick={() => handlePostTweet(post, index)}
                disabled={postLoading === index}
              >
                {postLoading === index ? (
                  <LoaderCircle className="w-4 h-4 animate-spin mr-2" />
                ) : null}
                <span>Post this tweet</span>
              </Button>
              {editingIndex === index ? (
                <div className="ml-auto flex items-center gap-2">
                  <div
                    className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-green-100 cursor-pointer"
                    onClick={() => handleSave(index)}
                  >
                    <Check className="w-3 h-3 text-green-600" />
                  </div>
                  <div
                    className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-red-100 cursor-pointer"
                    onClick={handleCancel}
                  >
                    <X className="w-3 h-3 text-red-600" />
                  </div>
                </div>
              ) : (
                <div
                  className="ml-auto w-6 h-6 flex items-center justify-center rounded-full hover:bg-slate-100 cursor-pointer"
                  onClick={() => handleEdit(index)}
                >
                  <PencilLine className="w-3 h-3" />
                </div>
              )}
            </div>
            <div className="w-full bg-background rounded-md px-2 py-2">
              {editingIndex === index ? (
                <>
                  <Textarea
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    className="min-h-[100px] w-full border-none focus-visible:ring-0 !text-md shadow-none p-0"
                    maxLength={280}
                    placeholder="Edit your content..."
                  />
                  <span className="text-sm text-muted-foreground">
                    {editedContent.length} / 280
                  </span>
                </>
              ) : (
                <div className="w-full text-md">
                  <Markdown>{post}</Markdown>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
