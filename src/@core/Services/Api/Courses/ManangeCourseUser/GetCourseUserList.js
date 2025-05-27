import { useQuery } from "@tanstack/react-query";
import Api from "../../../../../@core/Services/interceptor";

const GetCourseUserList = (params) => {
  const { CourseId, PageNumber, RowsOfPage, Query } = params || {};

  return useQuery({
    queryKey: ["GetCourseUserList", CourseId, PageNumber, RowsOfPage, Query],
    queryFn: async () => {
      console.log("در حال دریافت لیست کاربران با پارامترها:", params);
      try {
        const response = await Api.get("/CourseUser/GetCourseUserList", {
          params,
        });
        console.log("پاسخ GetCourseUserList:", response);
        return response; // فرض: { totalCount: number, users: array }
      } catch (error) {
        console.error("خطای GetCourseUserList:", error);
        throw error;
      }
    },
    enabled: !!CourseId, // فقط اگه CourseId معتبر باشه اجرا بشه
    retry: 1,
    staleTime: 1000 * 60, // کش برای ۱ دقیقه
  });
};

export default GetCourseUserList;
