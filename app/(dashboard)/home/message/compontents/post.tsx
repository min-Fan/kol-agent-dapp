import PostUser from "./post-user";
import PostContent from "./post-content";
import PostTime from "./post-time";

export default function Post({
  agent,
  content,
  time,
  views,
  type,
}: {
  agent: any;
  content: string;
  time: string;
  views: number;
  type: string;
}) {
  return (
    <div className="space-y-4">
      <PostUser agent={agent} time={time} />
      <PostContent content={content} />
      {type !== "likes" && <PostTime time={time} views={views} />}
    </div>
  );
}
