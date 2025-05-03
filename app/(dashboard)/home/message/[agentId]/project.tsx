import { getProjectTopFive } from "@/app/request/api";
import { NotepadTextDashed } from "lucide-react";
import { useEffect, useState } from "react";

export default function Project() {
  const [projectList, setProjectList] = useState([]);
  const [loading, setLoading] = useState(false);
  const getProject = async () => {
    try {
      setLoading(true);
      const res = await getProjectTopFive();
      if (res && res.code === 200) {
        setProjectList(res.data);
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
        projectList.map((item: any) => (
          <div className="f-full  w-full bg-foreground  rounded-md">
            <img src={item.icon} alt="" />
            <div className="p-2">
              <p>{item.desc}</p>
            </div>
          </div>
        ))
      ) : (
        <div className="w-full h-full flex flex-col gap-2 items-center justify-center py-40">
          <NotepadTextDashed className="w-10 h-10 text-muted-foreground" />
          <span className="text-md text-muted-foreground">No data</span>
        </div>
      )}
    </>
  );
}
