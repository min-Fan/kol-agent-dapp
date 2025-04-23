import { formatTimestamp } from "@/app/utils/date-utils";

export default function PostTime({ time, views }: { time: string, views: number }) {
  return (
    <div className="text-muted-foreground text-md">
      {formatTimestamp(new Date(time).getTime())} ·{" "}
      <strong className="font-bold text-primary">{views}</strong> Views
    </div>
  );
}
