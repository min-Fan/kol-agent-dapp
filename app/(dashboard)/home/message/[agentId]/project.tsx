import { getProjectTopFive } from "@/app/request/api";
import { NotepadTextDashed } from "lucide-react";
import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
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

  return (
    <>
      {projectList.length && !loading ? (
        <div className="bg-foreground p-6">
          <h1 className="mb-2 font-bold">Project</h1>
          {projectList.map((item: any) => (
            <>
              <div className="f-full  w-full ">
                <img src={item.icon} alt="" className="w-full" />
                <div className="p-2 text-md">
                  <p>{item.desc}</p>
                </div>
              </div>
              <Separator />
            </>
          ))}
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
