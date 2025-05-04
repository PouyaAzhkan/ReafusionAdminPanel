import { useMutation } from "@tanstack/react-query";
import Api from '../../../../@core/Services/interceptor';

export const EditWeblogDetail = () => {
  return useMutation({
      mutationKey: ['EditWeblogDetail'],
      mutationFn: async (formData) => {
         const response = await Api.get(`/News/UpdateNews`, formData);

         return response
      }
  })
}