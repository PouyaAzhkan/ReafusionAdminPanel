import { useQuery } from "@tanstack/react-query";
import Api from '../../../interceptor'

const GetTexnologyList = () => {
  return useQuery({
     queryKey: ['GetTecnolojyList'],
     queryFn: async () => {
       const response = await Api.get(`/Technology`);

       return response
     }
  })
}

export default GetTexnologyList