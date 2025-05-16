import { useQuery } from "@tanstack/react-query";
import Api from '../../../interceptor'

const GetCourseLevelList = () => {
  return useQuery({
     queryKey: ['GetCourseLevelList'],
     queryFn: async () => {
       const response = await Api.get(`/CourseLevel/GetAllCourseLevel`);

       return response
     }
  })
}

export default GetCourseLevelList