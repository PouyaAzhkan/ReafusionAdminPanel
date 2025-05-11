import { useMutation } from "@tanstack/react-query";
import Api from "../../../../../@core/Services/interceptor";

const EditCourses = () => {
  return useMutation({
    mutationKey: ['EditCourses'],
    mutationFn: async (formData) => {
       const response = await Api.put(`/Course`, formData);

       return response
    }
  })
}

export default EditCourses