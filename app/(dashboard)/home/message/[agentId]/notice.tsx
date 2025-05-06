import { getKOLNotice } from "@/app/request/api";
import { Volume2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
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
    <div className="flex text-md space-x-2 ">
      <Volume2 className="w-10" />
      <div className="flex-1 flex-wrap">
        {noticeList.length ? (
          <Carousel
            orientation="vertical"
            opts={{
              loop: true,
            }}
            plugins={[plugin.current]}
          >
            <CarouselContent className="h-20">
              {noticeList.map((item: any) => (
                <CarouselItem className="text-md">{item.content}</CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        ) : (
          <div> no notice</div>
        )}
      </div>
    </div>
  );
}
