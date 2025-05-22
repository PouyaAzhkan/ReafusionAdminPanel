import { useQuery } from "@tanstack/react-query";
import Api from '../../../../@core/Services/interceptor';

const GetCategoryList2 = () => {
  return useQuery({
      queryKey: ['GetCategoryList2'],
      queryFn: async () => {
         const response = await Api.get(`/News/GetListNewsCategory`);

         return response
      }
  })
}

export default GetCategoryList2