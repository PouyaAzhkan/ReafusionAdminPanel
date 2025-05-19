import { useQuery } from "@tanstack/react-query";
import Api from "../../../../../interceptor";

const GetAssistanceWork = () => {
  return useQuery({
     queryKey: ['GetAssistanceWork'],
     queryFn: async () => {
        const response = await Api.get(`/AssistanceWork`);

        return response
     }
  })
}

export default GetAssistanceWork