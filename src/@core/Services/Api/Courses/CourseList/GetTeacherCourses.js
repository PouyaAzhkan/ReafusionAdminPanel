import { useQuery } from "@tanstack/react-query";
import Api from "../../../../../@core/Services/interceptor";

const GetTeacherCourses = (paramsTab4) => {
  return useQuery({
    queryKey: ['GetTeacherCourses', paramsTab4],
    queryFn: async () => {
      const response = await Api.get('/Course/TeacherCourseList', { params: paramsTab4 });
      return response;
    }
  });
};


export default GetTeacherCourses