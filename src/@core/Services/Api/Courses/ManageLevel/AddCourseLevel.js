import { useMutation } from "@tanstack/react-query";
import Api from '../../../interceptor'

const AddCourseLevel = () => {
  return useMutation({
     mutationKey: ['AddCourseLevel'],
     mutationFn: async (data) => {
       const response = await Api.post(`/CourseLevel`, data);
       
       return response
     }
  })
}

export default AddCourseLevel

