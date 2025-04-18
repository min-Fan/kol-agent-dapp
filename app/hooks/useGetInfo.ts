import { useState } from 'react';
import { getUserInfo } from '@/app/request/api';
import { useAppDispatch } from '@/app/store/hooks';
import { updateDetails } from '@/app/store/reducers/userSlice';
import { toast } from 'sonner';

export const useGetInfo = () => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();

  const getInfo = async () => {
    try {
      setIsLoading(true);
      const res: any = await getUserInfo();
      if (res && res.code === 200) {
        dispatch(updateDetails(res.data));
        return {
          data: res.data,
          progress: (res.data.agent.created / res.data.agent.total) * 100
        };
      } else {
        toast.error(res.msg);
        return null;
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { getInfo, isLoading };
}; 