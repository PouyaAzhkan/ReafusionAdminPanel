import { useQuery } from "@tanstack/react-query";
import Api from '../../../interceptor'

const GetDepartmantList = () => {
  return useQuery({
     queryKey: ['GetDepartmantList'],
     queryFn: async () => {
       const response = await Api.get(`/Department`);

       return response
     }
  })
}

export default GetDepartmantList