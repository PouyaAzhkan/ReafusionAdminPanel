import { useQuery } from "@tanstack/react-query";
import Api from '../../../interceptor'

const GetCategoryList = () => {
  return useQuery({
     queryKey: ['GetCategoryList'],
     queryFn: async () => {
       const response = await Api.get(`/Technology`);

       return response
     }
  })
}

export default GetCategoryList