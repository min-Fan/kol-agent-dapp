import PostUser from "./post-user";
import PostContent from "./post-content";
import PostTime from "./post-time";

export default function Post({
  agent,
  content,
  time,
  views,
  type,
  medias,
}: {
  agent: any;
  content: string;
  time: string;
  views: number;
  type: string;
  medias: any;
}) {
  return (
    <div className="space-y-4">
      <PostUser agent={agent} time={time} />
      <PostContent content={content} medias={medias} />
      <PostTime time={time} views={views} />
    </div>
  );
}
