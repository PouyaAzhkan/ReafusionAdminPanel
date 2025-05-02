import { useQuery } from "@tanstack/react-query";
import Api from '../../interceptor'

export const GetClassRoomInfo = () => {
    return useQuery({
      queryKey: ['GetClassRoomInfo'],
      queryFn: async () => {
         const response = await Api.get(`/ClassRoom`);

         return response
      }
    })
}