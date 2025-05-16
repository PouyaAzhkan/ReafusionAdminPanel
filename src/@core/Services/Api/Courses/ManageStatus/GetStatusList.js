import { useQuery } from "@tanstack/react-query";
import Api from '../../../interceptor'

const GetStatusList = () => {
  return useQuery({
     queryKey: ['GetStatusList'],
     queryFn: async () => {
       const response = await Api.get(`/Status`);

       return response
     }
  })
}

export default GetStatusList