import { useQuery } from "@tanstack/react-query";
import Api from "../../../../../interceptor";


const useGetCourseComment = (id) => {
  return useQuery({
     queryKey: ['GetCourseComment', id],
     queryFn: async () => {
        const response = await Api.get(`/Course/GetCourseCommnets/${id}`);
        
        return response
     }
  })
}

export default useGetCourseComment