import { getKOLNotice } from "@/app/request/api";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Notifications from "@/app/assets/image/Notifications.png";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
export default function Notice() {
  const plugin = useRef(Autoplay({ delay: 2000, stopOnInteraction: true }));
  const [noticeList, setNotice] = useState([]);
  const [login, setLogin] = useState(false);
  const init = async () => {
    try {
      setLogin(true);
      const res = await getKOLNotice({
        msg_type: "kol_completed",
        limit: 10,
      });
      if (res && res.code == 200) {
        setNotice(res.data);
      }
    } catch (error) {
    } finally {
      setLogin(false);
    }
  };

  useEffect(() => {
    init();
  }, []);
  return (
    <div className="bg-[rgba(255,149,0,0.1)] rounded-xl p-2 box-border ">
      <div className="text-[#FF9500] text-sm flex items-center gap-1">
        <Image src={Notifications} alt="" className="w-7"></Image>
        <span>Notifications</span>
      </div>
      <Carousel
        orientation="vertical"
        opts={{
          loop: true,
        }}
        plugins={[plugin.current]}
      >
        <CarouselContent className="h-19  space-y-2 mt-2">
          {noticeList.map((item: any) => (
            <CarouselItem className="bg-[rgba(255,255,255,1)] p-2 box-border rounded-xl flex flex-col items-stretch justify-between">
              <div className="text-sm flex justify-between  text-[#999999]">
                <span>Price notification</span>
                <span>{item.msg_at}</span>
              </div>
              <div className="text-sm"> {item.content}</div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* <div className="flex-1 flex-wrap">
        {noticeList.length ? (
          <Carousel
            orientation="vertical"
            opts={{
              loop: true,
            }}
            plugins={[plugin.current]}
          >
            <CarouselContent className="h-20">
             
            </CarouselContent>
          </Carousel>
        ) : (
          <div> no notice</div>
        )}
      </div> */}
    </div>
  );
}
