import { useMutation } from "@tanstack/react-query";
import Api from "../../../../../@core/Services/interceptor";

const AddCourse = () => {
   return useMutation({
     mutationKey: ['AddCourse'],
     mutationFn: async (formData) => {
       const response = await Api.post(`/Course`, formData);
       
       return response
     }
   })
}

export default AddCourse