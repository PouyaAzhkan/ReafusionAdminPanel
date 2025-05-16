import { useMutation } from "@tanstack/react-query";
import Api from '../../../interceptor'

const EditCourseLevel = () => {
  return useMutation({
     mutationKey: ['EditCourseLevel'],
     mutationFn: async (data) => {
       const response = await Api.put(`/CourseLevel`, data);
       
       return response
     }
  })
}

export default EditCourseLevel

