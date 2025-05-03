import Image from "next/image";

import post from "@/app/assets/image/post.png";

export default function PostContent({ content, medias }: { content: string, medias: any }) {
  return (
    <div className="space-y-2">
      <div className="space-y-2 text-base">
        {/* <p>{content}</p> */}
        <div
          className="text-md text-muted-foreground whitespace-pre-line"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
      {medias && medias.length > 0 && (
        <div className="w-full aspect-video  overflow-hidden rounded-md">
          <img src={medias[0].media_url_https} alt="post" className="w-full h-full object-cover" />
        </div>
      )}
    </div>
  );
}
