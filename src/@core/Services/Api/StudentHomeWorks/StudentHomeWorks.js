import { useMutation } from "@tanstack/react-query";
import api from "../../interceptor/index";

// add session to schedual
export const useAddStudentHomeWork = () => {
  return useMutation({
    mutationFn: async (HomeWorkData) => {
      try {
        const response = await api.post(
          "/Session/AddCourseUserHomeWork",
          HomeWorkData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        console.log("پاسخ خام API:", response);
        console.log("داده‌های بازگشتی:", response.data);
        return response;
      } catch (error) {
        console.error("خطا در افزودن تکلیف:", error);
        throw error;
      }
    },
  });
};
