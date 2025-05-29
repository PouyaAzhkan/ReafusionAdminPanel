import { useQuery } from "@tanstack/react-query";
import Api from "../../../../../@core/Services/interceptor";

export const getListMyCoursesUser = (apiParams) => {
  return useQuery({
    queryKey: ["GetListMyCoursesUser", PageNumber, RowsOfPage, Query],
    queryFn: async () => {
      console.log("در حال دریافت لیست کاربر دوره‌ها با پارامترها:", apiParams);
      try {
        const response = await Api.get("/CourseUser/GetListMyCourseUser");
        console.log("پاسخ GetCoursesList:", response);
        return response;
      } catch (error) {
        console.error("خطای GetCoursesList:", error);
        throw error;
      }
    },
    enabled: !!apiParams,
    retry: 1,
    staleTime: 1000 * 60,
  });
};
