import { useQuery } from "@tanstack/react-query"
import Api from '../../interceptor'

export const GetDashboardReport = () => {
   return useQuery({
     queryKey: ["GetDashboardReport"],
     queryFn: async () => {
       const response = await Api.get(`/Report/DashboardReport`);

       return response
     }
   })
}