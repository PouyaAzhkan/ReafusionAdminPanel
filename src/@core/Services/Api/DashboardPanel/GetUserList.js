import { useQuery } from "@tanstack/react-query";
import Api from '../../interceptor'

export const GetUserList = () => {
   return useQuery({
     queryKey: ['GetUserList'],
     queryFn: async () => {
       const response = await Api.get(`/User/UserMannage?PageNumber=0&RowsOfPage=0&SortingCol=DESC&SortType=InsertDate`);

       return response
     }
   })
}