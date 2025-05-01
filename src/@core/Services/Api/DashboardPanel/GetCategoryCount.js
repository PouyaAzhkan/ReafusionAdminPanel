import { useQuery } from "@tanstack/react-query";
import Api from '../../interceptor'

export const GetCategoryCount = () => {
   return useQuery({
     queryKey: ['GetCategoryCount'],
     queryFn: async () => {
       const response = await Api.get(`/Report/DashboardTechnologyReport`);

       return response
     }
   })
}