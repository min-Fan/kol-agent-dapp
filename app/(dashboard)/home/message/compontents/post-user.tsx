import Image from "next/image";

import avatar from "@/app/assets/image/avatar.png";
import { formatDate } from "@/app/utils/date-utils";
export default function PostUser({
  agent,
  time,
}: {
  agent: any;
  time: string;
}) {
  return (
    <div className="flex items-center space-x-2">
      <div className="w-10 h-10 overflow-hidden rounded-md">
        {agent.icon ? (
          <img src={agent.icon} alt="avatar" className="w-full h-full object-cover" />
        ) : (
          <Image
            src={avatar}
            alt="avatar"
            width={avatar.width}
            height={avatar.height}
          />
        )}
      </div>
      <dl className="text-md">
        <dt className="font-bold">{agent.name}</dt>
        <dd className="text-muted-foreground">
          @{agent.x_username} · {formatDate(time)}
        </dd>
      </dl>
    </div>
  );
}
