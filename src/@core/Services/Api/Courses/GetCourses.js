// فایل: GetCourses.js
import { useQuery } from "@tanstack/react-query";
import Api from "../../../../@core/Services/interceptor";

const GetCourses = (initialParams, coursePageParams, params) => {
  return useQuery({
    queryKey: ["GetCourses", initialParams, coursePageParams, params],
    queryFn: async () => {
      const response = await Api.get("/Course/CourseList", {
        params: {initialParams, coursePageParams, params }, 
      });
      return response; // فقط داده‌ها رو برگردون
    },

  });
};

export default GetCourses;