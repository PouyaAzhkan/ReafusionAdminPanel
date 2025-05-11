import { useQuery } from "@tanstack/react-query";
import Api from '../../../../@core/Services/interceptor'

const GetReservedCourses = () => {
   return useQuery({
     queryKey: ['GetReservedCourses'],
     queryFn: async () => {
          const response = await Api.get(`/CourseReserve`);

          return response
     }
   })
}

export default GetReservedCourses