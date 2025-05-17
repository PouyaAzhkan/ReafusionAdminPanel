import { useQuery } from "@tanstack/react-query";
import Api from '../../../interceptor'

const GetDepartmantDetail = (id) => {
  return useQuery({
     queryKey: ['GetDepartmantDetail', id],
     queryFn: async () => {
       const response = await Api.get(`/Department/${id}`);

       return response
     }
  })
}

export default GetDepartmantDetail