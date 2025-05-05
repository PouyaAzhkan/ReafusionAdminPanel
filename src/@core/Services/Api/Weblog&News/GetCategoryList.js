import { useQuery } from "@tanstack/react-query";
import Api from '../../../../@core/Services/interceptor';

export const GetCategoryList = () => {
  return useQuery({
      queryKey: ['GetCategoryList'],
      queryFn: async () => {
         const response = await Api.get(`/News/GetListNewsCategory`);

         return response
      }
  })
}