import { useQuery } from "@tanstack/react-query";
import Api from '../../../../@core/Services/interceptor'

const GetAllCoursePayment = (courseId) => {
  return useQuery({
    queryKey: ['GetAllCoursePayment', courseId],
    queryFn: async () => {
      const response = await Api.get(`/CoursePayment?CourseId=${courseId}`);
      
      return response
    }
  })
}

export default GetAllCoursePayment