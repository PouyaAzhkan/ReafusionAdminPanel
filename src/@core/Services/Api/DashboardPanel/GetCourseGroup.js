import { useQuery } from "@tanstack/react-query"
import Api from '../../interceptor'

export const GetCourseGroup = () => {
   return useQuery({
     queryKey: ["GetCourseGroup"],
     queryFn: async () => {
       const response = await Api.get(`/CourseGroup?PageNumber=1&RowsOfPage=10&SortingCol=DESC&SortType=Expire&Query=`);

       return response
     }
   })
}