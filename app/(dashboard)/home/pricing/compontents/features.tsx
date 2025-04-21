import { Check } from "lucide-react";

export default function Features(props: { data: number[] }) {
  const { data } = props;

  return (
    <div className="p-4">
      <ul className="text-md space-y-4 text-muted-foreground">
        <li className="flex items-center justify-between space-x-2">
          <span>Number of created Agents</span>
          <span className="font-bold">{data[0]}</span>
        </li>
        <li className="flex items-center justify-between space-x-2">
          <span>Tweets</span>
          <span className="font-bold">{data[1]}</span>
        </li>
        <li className="flex items-center justify-between space-x-2">
          <span>Retweets</span>
          <span className="font-bold">{data[2]}</span>
        </li>
        <li className="flex items-center justify-between space-x-2">
          <span>Quotes</span>
          <span className="font-bold">{data[3]}</span>
        </li>
        <li className="flex items-center justify-between space-x-2">
          <span>Comments</span>
          <span className="font-bold">{data[4]}</span>
        </li>
        <li className="flex items-center justify-between space-x-2">
          <span>Replies</span>
          <span className="font-bold">{data[5]}</span>
        </li>
        <li className="flex items-center justify-between space-x-2">
          <span>Likes</span>
          <span className="font-bold">{data[6]}</span>
        </li>
        <li className="flex items-center justify-between space-x-2">
          <span>Number of tweets processed per day</span>
          <span className="font-bold">{data[7]}</span>
        </li>
      </ul>
    </div>
  );
}
