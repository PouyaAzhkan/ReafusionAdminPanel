import { useQuery } from "@tanstack/react-query";
import Api from '../../interceptor'

export const GetBiuldingCount = () => {
   return useQuery({
     queryKey: ['GetBiuldingCount'],
     queryFn: async () => {
       const response = await Api.get(`/Building`);

       return response
     }
   })
}