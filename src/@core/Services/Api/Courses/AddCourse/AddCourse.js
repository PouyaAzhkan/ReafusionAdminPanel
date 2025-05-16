import { useMutation } from "@tanstack/react-query";
import Api from "../../../../../@core/Services/interceptor";

const AddCourses = () => {
   return useMutation({
     mutationKey: ['AddCourses'],
     mutationFn: async (formData) => {
       const response = await Api.post(`/Course`, formData);
       
       return response
     }
   })
}

export default AddCourses