import { useQuery } from "@tanstack/react-query";
import Api from "../../../../../@core/Services/interceptor";

const GetCategorys = () => {
  return useQuery({
     queryKey: ['GetCategorys'],
     queryFn: async () => {
       const response = await Api.get(`/Home/GetTechnologies`);
       
       return response
     }
  })
}

export default GetCategorys