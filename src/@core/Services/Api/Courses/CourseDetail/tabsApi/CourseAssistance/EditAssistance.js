import { useMutation } from "@tanstack/react-query";
import Api from "../../../../../interceptor";

const EditAssistance = () => {
  return useMutation({
     mutationKey: ['EditAssistance'],
     mutationFn: async (data) => {
        const response = await Api.put(`/CourseAssistance`, data);
       
        return response
     }
  })
}

export default EditAssistance