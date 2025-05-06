import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import "@/app/assets/font/font.scss";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Toaster } from "@/components/ui/sonner";
import ReduxProvider from "./context/ReduxProvider";
import { LoginProvider } from "./hooks/useLoginDrawer";
import { CreateXauthProvider } from "./hooks/useCreateXauthDialog";
import WagmiProviderContext from "./context/WagmiProviderContext";
import "@rainbow-me/rainbowkit/styles.css";
export const metadata: Metadata = {
  title: "Linkol",
  description: "Linkol",
};

export const viewport: Viewport = {
  maximumScale: 1,
};

const manrope = Manrope({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // let userPromise = getUser();

  return (
    <html
      lang="en"
      className={`bg-white dark:bg-gray-950 text-primary dark:text-white ${manrope.className}`}
    >
      <body className="min-h-[100dvh] bg-gray-50">
        {/* <UserProvider userPromise={userPromise}>{children}</UserProvider> */}
        <ReduxProvider>
          <LoginProvider>
            <CreateXauthProvider>
              <WagmiProviderContext>
                <ScrollArea className="h-full w-full">{children}</ScrollArea>
                <Toaster />
              </WagmiProviderContext>
            </CreateXauthProvider>
          </LoginProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
