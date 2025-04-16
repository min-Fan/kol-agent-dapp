"use client";
import Image from "next/image";
import { Link, CalendarDays } from "lucide-react";

import banner from "@/app/assets/image/banner.png";
import avatar from "@/app/assets/image/avatar.png";
import { OrderKol } from "@/app/types/types";
import { formatJoinedDate } from "@/app/utils/date-utils";

export default function OrderPreviewProfile({ info }: { info: OrderKol }) {
  return (
    <div className="text-md">
      <div className="h-30 relative bg-primary/10">
        <Image src={banner} alt="banner" fill className="object-cover" />
        <div className="absolute bottom-0 left-4 w-28 h-28 rounded-full bg-muted-foreground border-4 translate-y-1/2 border-background overflow-hidden">
          {info.profile_image_url ? (
            <img
              src={info.profile_image_url}
              alt=""
              className="w-full h-full object-cover"
            />
          ) : (
            <Image src={avatar} alt="avatar" fill />
          )}
        </div>
      </div>
      <div className="p-4 space-y-2">
        <div className="h-10"></div>
        <dl className="flex flex-col gap-1">
          <dt className="h-7">
            <h1 className="text-xl font-bold">{info.name}</h1>
          </dt>
          <dd className="text-muted-foreground h-4">
            <span className="text-md">@{info.username}</span>
          </dd>
        </dl>
        <div className="text-muted-foreground min-h-4">
          <p className="text-sm line-clamp-3 overflow-hidden text-ellipsis">
            {info.description}
          </p>
        </div>
        <ul className="flex space-x-4 items-center">
          <li className="flex items-center space-x-1">
            <CalendarDays className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              {formatJoinedDate(new Date(info.x_created_at))}
            </span>
          </li>
        </ul>
        <ul className="flex space-x-4 items-center">
          {/* <li className="space-x-1">
            <span>{info.like_count}</span>
            <span className="text-muted-foreground">Likes</span>
          </li> */}
          <li className="space-x-1 flex items-center">
            <div className="relative inline-flex items-center justify-center">
              <span>{info.followers_count}</span>
            </div>
            <span className="text-muted-foreground">Followers</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
