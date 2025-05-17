import { useQuery } from "@tanstack/react-query";
import Api from '../../../interceptor'

const GetAssistanceList = () => {
  return useQuery({
     queryKey: ['GetAssistanceList'],
     queryFn: async () => {
       const response = await Api.get(`/AssistanceWork`);
       
       return response
     }
  })
}

export default GetAssistanceList
