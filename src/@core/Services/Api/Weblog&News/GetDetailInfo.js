import { useQuery } from "@tanstack/react-query";
import Api from '../../../../@core/Services/interceptor';

export const GetDetailInfo = (id) => {
   return useQuery({
     queryKey: ['GetDetailInfo', id],
     queryFn: async () => {
        const response = await Api.get(`/News/${id}`);
        console.log('API Response:', response);
        return response
     }
   })
}