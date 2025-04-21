import clsx from "clsx";

import { Button } from "@/components/ui/button";
import SubscribeDialog from "./subscribe-dialog";
export default function Subscribe(props: {
  title: string;
  price: string;
  yearPrice?: string;
  discount: string;
  isHighlight?: boolean;
  isActive?: boolean;
}) {
  const {
    title,
    price,
    yearPrice,
    discount,
    isHighlight = false,
    isActive = false,
  } = props;

  return (
    <div
      className={clsx(
        "space-y-4 text-center p-4 py-8 relative",
        isHighlight
          ? "bg-gradient-to-r from-[#0bbdb6]/90 to-[#00d179]/90 text-foreground"
          : "bg-foreground border-b border-border"
      )}
    >
      <h3
        className={clsx(
          "text-2xl font-semibold",
          isHighlight ? "text-foreground" : "text-muted-foreground"
        )}
      >
        {title}
      </h3>
      <dl className="">
        <dt className="text-md font-bold">
          <span className="text-4xl font-bold">{price}</span>/month
        </dt>
        {/* <dd className="text-md">
          <span
            className={clsx(
              isHighlight ? "text-foreground" : "text-muted-foreground"
            )}
          >
            {yearPrice}
          </span>
          /年
        </dd> */}
      </dl>
      {isHighlight ? (
        isActive ? (
          <Button
            variant="outline"
            className="hover:bg-foreground text-[#0bbdb6]/90 hover:text-[#0bbdb6]/90"
          >
            <span className="text-base font-bold">Active</span>
          </Button>
        ) : (
          <SubscribeDialog
            TriggerButton={
              <Button
                variant="outline"
                className="hover:bg-foreground text-[#0bbdb6]/90 hover:text-[#0bbdb6]/90"
              >
                <span className="text-base font-bold">Subscribe</span>
              </Button>
            }
          />
        )
      ) : isActive ? (
        <Button variant="primary">
          <span className="text-base font-bold">Active</span>
        </Button>
      ) : (
        <SubscribeDialog
          TriggerButton={
            <Button variant="primary">
              <span className="text-base font-bold">Subscribe</span>
            </Button>
          }
        />
      )}
      {/* <div
        className={clsx(
          "absolute top-0 right-0 font-semibold text-md rounded-bl-md px-4 py-1",
          isHighlight
            ? "bg-foreground/90 text-[#0bbdb6]/90"
            : "bg-gradient-to-r from-[#0bbdb6]/90 to-[#00d179]/90 text-foreground"
        )}
      >
        {discount} 折扣
      </div> */}
    </div>
  );
}
