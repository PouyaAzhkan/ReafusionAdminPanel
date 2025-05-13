import { useQuery } from "@tanstack/react-query";
import Api from "../../../../../@core/Services/interceptor";

const useGetCourseDetailInfo = (id) => {
  return useQuery({
    queryKey: ["GetCourseDetailInfo"],
    queryFn: async () => {
      const response = await Api.get(`/Course/${id}`);
      return response;
    },
    enabled: !!id, // فقط وقتی id وجود داره
  });
};

export default useGetCourseDetailInfo;
