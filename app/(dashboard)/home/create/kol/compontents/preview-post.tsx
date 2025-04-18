import PostUser from "./post-user";
import PostTools from "./post-tools";
import PostContent from "./post-content";
import PostTime from "./post-time";

export default function PreviewPost({ content }: { content?: string }) {
  return (
    <div className="bg-background rounded-md p-4 space-y-4">
      <PostUser />
      <PostContent content={content} />
      {/* <PostTime /> */}
      <div className="w-full h-px border-b border-border"></div>
      <PostTools />
    </div>
  );
}
