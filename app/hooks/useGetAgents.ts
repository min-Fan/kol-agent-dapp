import { useAppDispatch } from "@/app/store/hooks";
import { updateAgents } from "@/app/store/reducers/userSlice";
import { getAgentList } from "@/app/request/api";

export const useGetAgents = () => {
  const dispatch = useAppDispatch();

  const getAgents = async () => {
    try {
      const res = await getAgentList();
      if (res && res.code === 200) {
        dispatch(updateAgents(res.data));
        return res.data;
      }
      return [];
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  return { getAgents };
}; 