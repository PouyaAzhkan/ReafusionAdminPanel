import { useMutation } from "@tanstack/react-query";
import Api from '../../../../@core/Services/interceptor';

export const AddCategory = () => {
   return useMutation({
     mutationKey: ['AddCategory'],
     mutationFn: async (formData) => {
        const response = await Api.post(`/News/CreateNewsCategory`, formData);

        return response
     }
   })
}