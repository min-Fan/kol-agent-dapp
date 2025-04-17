import React from "react";
import { OrderPreviewProvider } from "@/app/context/OrderPreviewContext";
export default function Layout({ children }: { children: React.ReactNode }) {
  return <div className="w-full h-full">
    <OrderPreviewProvider>
      {children}
    </OrderPreviewProvider>
    </div>;
}
