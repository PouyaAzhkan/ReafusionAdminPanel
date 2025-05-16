import { useQuery } from "@tanstack/react-query";
import Api from '../../../interceptor'

const GetBuildingList = () => {
  return useQuery({
     queryKey: ['GetBuildingList'],
     queryFn: async () => {
       const response = await Api.get(`/Building`);
       
       return response
     }
  })
}

export default GetBuildingList