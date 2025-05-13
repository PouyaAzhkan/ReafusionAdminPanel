import { useQuery } from "@tanstack/react-query";
import Api from "../../../../../interceptor";

// استفاده از useQuery برای دریافت داده‌ها
const GetUserData = (id) => {
  return useQuery({
    queryKey: ['GetUserData', id], // افزودن id به queryKey برای مدیریت کش
    queryFn: async () => {
      const response = await Api.get(`/CourseReserve/${id}`);
      
      return response; 
    },
  });
};

export default GetUserData;
