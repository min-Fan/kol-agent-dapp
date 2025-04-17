import { useAppDispatch } from "@/app/store/hooks";
import { updateConfig } from "@/app/store/reducers/userSlice";
import {
  getConstants,
  getAbilityList,
  getAgentPriceList,
  getKOLInterface,
  getAgentLimit,
} from "@/app/request/api";

export const useGetConst = () => {
  const dispatch = useAppDispatch();

  const getConst = async () => {
    try {
      getConstants({ c_type: "region" }).then((res) => {
        dispatch(updateConfig({ key: "region", value: res.data || [] }));
      });
      getConstants({ c_type: "language" }).then((res) => {
        dispatch(updateConfig({ key: "language", value: res.data || [] }));
      });
      getConstants({ c_type: "character" }).then((res) => {
        dispatch(updateConfig({ key: "character", value: res.data || [] }));
      });
      getConstants({ c_type: "topics" }).then((res) => {
        dispatch(updateConfig({ key: "topics", value: res.data || [] }));
      });
      getAbilityList().then((res) => {
        dispatch(updateConfig({ key: "ability", value: res.data || [] }));
      });
      getAgentPriceList().then((res) => {
        dispatch(updateConfig({ key: "price", value: res.data || [] }));
      });
      getKOLInterface().then((res) => {
        dispatch(updateConfig({ key: "kols", value: res.data || [] }));
      });
      getAgentLimit().then((res) => {
        dispatch(updateConfig({ key: "limit", value: res.data || {} }));
      });
    } catch (error) {
      console.log(error);
    }
  };

  return { getConst };
}; 