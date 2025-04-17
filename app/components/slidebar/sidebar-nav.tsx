"use client";

import { ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import { Bot, ReceiptText, ScrollText } from "lucide-react";
import clsx from "clsx";
import { usePathname, useRouter } from "next/navigation";
import { useAppSelector } from "@/app/store/hooks";
import { useLoginDrawer } from "@/app/hooks/useLoginDrawer";
import { getAgentList, getUserInfo } from "@/app/request/api";
import { toast } from "sonner";

const Routes = {
  CREATE: "/home/create/kol",
  ORDER_LIST: "/home/order",
};

const SidebarNavItem = (props: {
  icon: ReactNode;
  title: string;
  href: string;
  target?: string;
  isActive?: boolean;
  onLink?: (path: string) => void;
}) => {
  const { icon, title, href, target = "_self", isActive, onLink } = props;

  if (onLink) {
    return (
      <li>
        <div
          className={clsx(
            "flex items-center space-x-2 py-2 px-4 rounded-md hover:bg-background transition-colors cursor-pointer",
            isActive
              ? "text-foreground bg-gradient-to-r from-[#0bbdb6] to-[#00d179] hover:bg-gradient-to-r hover:from-[#0bbdb6] hover:to-[#00d179]"
              : "hover:text-foreground hover:bg-gradient-to-r hover:from-[#0bbdb6]/90 hover:to-[#00d179]/90"
          )}
          onClick={() => onLink(href)}
        >
          {icon}
          <span className="text-md capitalize whitespace-nowrap">{title}</span>
        </div>
      </li>
    );
  }

  return (
    <li>
      <Link
        className={clsx(
          "flex items-center space-x-2 py-2 px-4 rounded-md hover:bg-background transition-colors cursor-pointer",
          isActive
            ? "text-foreground bg-gradient-to-r from-[#0bbdb6] to-[#00d179] hover:bg-gradient-to-r hover:from-[#0bbdb6] hover:to-[#00d179]"
            : "hover:text-foreground hover:bg-gradient-to-r hover:from-[#0bbdb6]/90 hover:to-[#00d179]/90"
        )}
        href={href}
        target={target}
        prefetch={true}
      >
        {icon}
        <span className="text-md capitalize whitespace-nowrap">{title}</span>
      </Link>
    </li>
  );
};

export default function SidebarNav() {
  const router = useRouter();
  const pathname = usePathname();
  const isLoggedIn = useAppSelector((state) => state.userReducer.isLoggedIn);
  const userInfo = useAppSelector((state) => state.userReducer.userInfo);
  const { openDrawer } = useLoginDrawer();
  const [userData, setUserData] = useState<any>({});

  const getInfo = async () => {
    try {
      const res: any = await getUserInfo();
      if (res && res.code === 200) {
        setUserData(res.data);
      }
    } catch (error: any) {
      console.log(error);
    } finally {
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      getInfo();
    }
  }, [isLoggedIn]);

  const onLink = (path: string) => {
    if (isLoggedIn) {
      if (
        path === "/home/create/kol" &&
        userData.agent.created >= userData.agent.total
      ) {
        toast.warning("Create agent has reached the limit");
      } else {
        router.push(path);
      }
    } else {
      openDrawer();
    }
  };

  return (
    <div className="space-y-4 pt-4">
      <ul className="px-4 flex flex-col gap-1">
        <SidebarNavItem
          icon={<Bot className="size-5 min-w-5" />}
          title="create KOL agent"
          href={Routes.CREATE}
          isActive={pathname.includes(Routes.CREATE)}
          onLink={onLink}
        />
        <SidebarNavItem
          icon={<ScrollText className="size-5 min-w-5" />}
          title="Order List"
          href={Routes.ORDER_LIST}
          isActive={pathname.includes(Routes.ORDER_LIST)}
          onLink={onLink}
        />
      </ul>
      <div className="h-px bg-border"></div>
    </div>
  );
}
