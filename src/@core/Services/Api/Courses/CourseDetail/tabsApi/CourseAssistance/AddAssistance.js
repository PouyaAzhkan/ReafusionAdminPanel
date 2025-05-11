import { useMutation, useQuery } from "@tanstack/react-query";
import Api from "../../../../../interceptor";

const AddAssistance = () => {
  return useMutation({
     mutationKey: ['AddAssistance'],
     mutationFn: async (data) => {
        const response = await Api.post(`/CourseAssistance`, data);
       
        return response
     }
  })
}

export default AddAssistance