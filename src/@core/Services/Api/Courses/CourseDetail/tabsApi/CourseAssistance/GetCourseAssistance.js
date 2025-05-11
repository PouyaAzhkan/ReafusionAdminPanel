import { useQuery } from "@tanstack/react-query";
import Api from "../../../../../interceptor";

const GetCourseAssistance = () => {
  return useQuery({
     queryKey: ['GetCourseAssistance'],
     queryFn: async () => {
         const response = await Api.get(`/CourseAssistance`);

         return response
     }
  })
}

export default GetCourseAssistance