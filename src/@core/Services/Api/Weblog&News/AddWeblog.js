import { useMutation } from "@tanstack/react-query";
import Api from '../../../../@core/Services/interceptor';

export const AddWeblog = () => {
   return useMutation({
    mutationKey: ['AddWeblog'],
    mutationFn: async (formData) => {
       const response = await Api.post(`/News/CreateNews`, formData);

       return response
    }
   })
}