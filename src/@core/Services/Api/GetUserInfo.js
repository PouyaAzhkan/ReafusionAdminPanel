import { useQuery } from "@tanstack/react-query";
import Api from '../interceptor'

export const GetUserInfo = () => {
   return useQuery({
      queryKey: ['GetUserInfo'],
      queryFn: async () => {
        const response = await Api.get(`/SharePanel/GetProfileInfo`);

        return response
      }
   }) 
}