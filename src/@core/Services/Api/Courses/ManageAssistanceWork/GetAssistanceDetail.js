import { useQuery } from "@tanstack/react-query";
import Api from '../../../interceptor'

const GetAssistanceDetail = (assistanceid) => {
  return useQuery({
    queryKey: ['GetAssistanceDetail', assistanceid],
    queryFn: async () => {
      const response = await Api.get(`/AssistanceWork/${assistanceid}`);
      return response;
    },
    enabled: !!assistanceid
  });
};

export default GetAssistanceDetail
