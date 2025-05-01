import { useQuery } from "@tanstack/react-query";
import Api from '../../interceptor'

export const GetCommentCount = () => {
    return useQuery({
      queryKey: ['GetCommentCount'],
      queryFn: async () => {
         const response = await Api.get(`/Course/CommentManagment?PageNumber=1&RowsOfPage=10&SortingCol=DESC&SortType=InsertDate&Query=`);

         return response
      }
    })
}