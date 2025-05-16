import { useQuery } from "@tanstack/react-query";
import Api from '../../../interceptor'

const GetClassList = () => {
  return useQuery({
     queryKey: ['GetClassList'],
     queryFn: async () => {
       const response = await Api.get(`/ClassRoom`);
       
       return response
     }
  })
}

export default GetClassList