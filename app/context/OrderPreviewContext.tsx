"use client";
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { OrderPreviewType } from '@/app/types/types';

interface OrderPreviewContextType {
  status: OrderPreviewType;
  setStatus: (status: OrderPreviewType) => void;
  tweetId: string;
  setTweetId: (tweetId: string) => void;
  tweetUrl: string;
  setTweetUrl: (tweetUrl: string) => void;
  isVerified: boolean;
  setIsVerified: (isVerified: boolean) => void;
  tweet: string;
  setTweet: (tweet: string) => void;
}

const OrderPreviewContext = createContext<OrderPreviewContextType | undefined>(undefined);

export function OrderPreviewProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<OrderPreviewType>(OrderPreviewType.POST_CONTENT);
  const [tweetId, setTweetId] = useState<string>("");
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [tweet, setTweet] = useState<string>("");
  const [tweetUrl, setTweetUrl] = useState<string>("");
  return (
    <OrderPreviewContext.Provider value={{ status, setStatus, tweetId, setTweetId, isVerified, setIsVerified, tweet, setTweet, tweetUrl, setTweetUrl }}>
      {children}
    </OrderPreviewContext.Provider>
  );
}

export function useOrderPreview() {
  const context = useContext(OrderPreviewContext);
  if (context === undefined) {
    throw new Error('useOrderPreview must be used within a OrderPreviewProvider');
  }
  return context;
} 