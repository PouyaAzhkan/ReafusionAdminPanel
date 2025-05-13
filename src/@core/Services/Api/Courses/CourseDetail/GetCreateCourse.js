import { useQuery } from "@tanstack/react-query";
import Api from "../../../../../@core/Services/interceptor";

const GetCreateCourse = () => {
  return useQuery({
    queryKey: ['GetCreateCourse'],
    queryFn: async () => {
      const response = await Api.get(`/Course/GetCreate`);

      return response
    }
  })
}

export default GetCreateCourse