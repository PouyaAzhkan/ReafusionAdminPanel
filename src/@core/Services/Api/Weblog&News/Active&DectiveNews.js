import { useMutation } from "@tanstack/react-query";
import Api from '../../../../@core/Services/interceptor';

export const ActiveOrDectiveNews = () => {
   return useMutation({
      mutationKey: ['ActiveOrDectiveNews'],
      mutationFn: async (formData) => {
         const response = await Api.put(`/News/ActiveDeactiveNews`, formData);

         return response
      }
   })
}