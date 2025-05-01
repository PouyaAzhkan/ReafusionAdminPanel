import { useQuery } from "@tanstack/react-query";
import Api from '../../interceptor'

export const GetLandingReport = () => {
    return useQuery({
      queryKey: ['GetLandingReport'],
      queryFn: async () => {
         const response = await Api.get(`/Home/LandingReport`);

         return response
      }
    })
}