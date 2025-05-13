import { useMutation } from "@tanstack/react-query";
import Api from "../../../../../@core/Services/interceptor";

const ChangeStatus = () => {
  return useMutation({
    mutationKey: ['ChangeStatus'],
    mutationFn: async (formData) => {
       const response = await Api.put(`/Course/UpdateCourseStatus`, formData);

       return response
    }
  })
}

export default ChangeStatus