import { useQuery } from "@tanstack/react-query";
import Api from "../../../../../@core/Services/interceptor";

const GetTeacherCourses = () => {
  return useQuery({
     queryKey: ['GetTeacherCourses'],
     queryFn: async () => {
       const response = await Api.get(`/Course/TeacherCourseList`);
       
       return response
     }
  })
}

export default GetTeacherCourses