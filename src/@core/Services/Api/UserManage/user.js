import { useQuery } from "@tanstack/react-query";
import Api from '../../interceptor/index'

export const GetUserList = () => {
   return useQuery({
      queryKey: ['GetUserList'],
      queryFn: async () => {
        const response = await Api.get(`/User/UserMannage`);

        return response
      }
   }) 
}