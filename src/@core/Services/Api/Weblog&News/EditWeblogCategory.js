import { useMutation } from "@tanstack/react-query";
import Api from '../../../../@core/Services/interceptor';

export const EditCategoryWeblog = () => {
  return useMutation({
      mutationKey: ['EditCategoryWeblog'],
      mutationFn: async (formData) => {
         const response = await Api.put(`/News/UpdateNewsCategory`, formData);

         return response
      }
  })
}