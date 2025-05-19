import { useQuery } from "@tanstack/react-query";
import Api from "../../../../../@core/Services/interceptor";

const GetCourses = (initialParams, coursePageParams, params, apiParams) => {
  return useQuery({
    queryKey: ["GetCourses", initialParams, coursePageParams, params, apiParams],
    queryFn: async () => {
      const response = await Api.get("/Course/CourseList", {
        params: {
          ...initialParams, // پارامترهای اولیه
          ...coursePageParams, // پارامترهای صفحه‌بندی اضافی
          apiParams, 
          params
        },
      });
      return response; // فقط داده‌ها را برگردان
    },
  });
};

export default GetCourses;
