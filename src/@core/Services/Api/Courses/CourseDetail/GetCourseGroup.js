import { useQuery } from "@tanstack/react-query";
import Api from "../../../../../@core/Services/interceptor";

const GetCourseGroup = (id, teacherId) => {
  return useQuery({
     queryKey: ['GetCourseGroup', id, teacherId],
     queryFn: async () => {
       const response = await Api.get(`/CourseGroup/GetCourseGroup?TeacherId=${teacherId}&CourseId=${id}`);
       
       return response 
     }
  })
}

export default GetCourseGroup