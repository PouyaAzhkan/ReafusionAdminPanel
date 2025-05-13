import { useQuery } from "@tanstack/react-query";
import Api from "../../../../../interceptor";

const GetAssistanceDetail = (accId) => {
  return useQuery({
     queryKey: ['GetAssistanceDetail'],
     queryFn: async () => {
         const response = await Api.get(`/CourseAssistance/${accId}`);

         return response
     }
  })
}

export default GetAssistanceDetail