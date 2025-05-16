import { useQuery } from "@tanstack/react-query";
import Api from '../../../interceptor'

const GetClassDetail = (id) => {
  return useQuery({
     queryKey: ['GetClassDetail'],
     queryFn: async () => {
       const response = await Api.get(`/ClassRoom/${id}`);
       
       return response
     }
  })
}

export default GetClassDetail