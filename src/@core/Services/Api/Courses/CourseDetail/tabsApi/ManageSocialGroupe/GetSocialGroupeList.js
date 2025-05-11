import { useQuery } from "@tanstack/react-query";
import Api from "../../../../../../../@core/Services/interceptor";

const GetSocialGroupeList = () => {
  return useQuery({
     queryKey: ['GetSocialGroupeList'],
     queryFn: async () => {
       const response = await Api.get(`/CourseSocialGroup`);

       return response
     }
  })
}

export default GetSocialGroupeList