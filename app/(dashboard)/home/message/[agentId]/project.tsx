import { getProjectTopFive } from "@/app/request/api";
import { NotepadTextDashed } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import banner from "@/app/assets/image/banner.png";
import Autoplay from "embla-carousel-autoplay";
import Projects from "@/app/assets/image/Projects.png";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
export default function Project() {
  const [projectList, setProjectList] = useState([]);
  const [loading, setLoading] = useState(false);
  const getProject = async () => {
    try {
      setLoading(true);
      const res = await getProjectTopFive();
      console.log(res);
      if (res && res.code === 200) {
        setProjectList(res.data.results);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProject();
  }, []);
  const plugin = useRef(Autoplay({ delay: 2000, stopOnInteraction: true }));
  return (
    <>
      {projectList.length && !loading ? (
        <div className="bg-[rgba(111,109,232,0.1)] rounded-xl p-2 box-border ">
          <div className="text-[#6F6DE8] text-sm flex items-center gap-1">
            <Image src={Projects} alt="" className="w-7"></Image>
            <span>Projects</span>
          </div>
          <Carousel
            opts={{
              loop: true,
            }}
            plugins={[plugin.current]}
            className="mt-2"
          >
            <CarouselContent>
              {projectList.map((item: any) => (
                <CarouselItem className="w-full h-40 ">
                  <div className="relative w-full h-full">
                    {item.icon ? (
                      <img src={item.icon} alt="" className="w-full h-full" />
                    ) : (
                      <Image
                        src={banner}
                        alt=""
                        className="w-full h-full"
                      ></Image>
                    )}
                    <div className="text-md text-white absolute bottom-0 left-0 bg-[rgba(0,0,0,0.55)] w-full p-2">
                      {item.desc}
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      ) : (
        <div className="w-full h-full flex flex-col gap-2 bg-foreground items-center justify-center py-40">
          <NotepadTextDashed className="w-10 h-10 text-muted-foreground" />
          <span className="text-md text-muted-foreground">No data</span>
        </div>
      )}
    </>
  );
}
