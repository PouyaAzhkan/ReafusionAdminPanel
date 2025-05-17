import { useQuery } from "@tanstack/react-query";
import Api from "../../../../../@core/Services/interceptor";

const GetCoursesList = (apiParams) => {
  const { PageNumber, RowsOfPage, Query } = apiParams || {};

  return useQuery({
    queryKey: ["GetCoursesList", PageNumber, RowsOfPage, Query],
    queryFn: async () => {
      console.log("در حال دریافت لیست دوره‌ها با پارامترها:", apiParams);
      try {
        const response = await Api.get("/Course/CourseList", { params: apiParams });
        console.log("پاسخ GetCoursesList:", response);
        return response; // فرض: { courseDtos: array, totalCount: number }
      } catch (error) {
        console.error("خطای GetCoursesList:", error);
        throw error;
      }
    },
    enabled: !!apiParams, // فقط اگه apiParams تعریف شده باشه اجرا بشه
    retry: 1,
    staleTime: 1000 * 60, // کش برای ۱ دقیقه
  });
};

export default GetCoursesList;