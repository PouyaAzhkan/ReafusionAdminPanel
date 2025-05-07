import { useMutation, useQuery } from "@tanstack/react-query";
import api from "../../interceptor/index";

// get all users job history
export const getAllUsersJobHistory = () => {
  return useQuery({
    queryKey: ["UsersJobHistory"],
    queryFn: async () => {
      try {
        const response = await api.get("/SharePanel/GetJobHistoriesAdmin");
        return response;
      } catch (error) {
        console.log("error is : ", error);
      }
    },
  });
};

// delete job history
export const useDeleteJobHistory = () => {
  return useMutation({
    mutationFn: async (historyId) => {
      try {
        const response = await api.delete(
          `/SharePanel/DeleteJobHistory?HistoryId=${historyId}`
        );
        console.log("API Response:", response); // برای دیباگ
        if (response.status === 200) {
          return { message: "درخواست حذف انجام شد 200 و مشکل از بک‌اند است" };
        }
        // اگر کد 200 نبود، به جای خطا، یک پیام دیگر برگردانید
        return {
          message: "درخواست با موفقیت ارسال شد، اما سرور پاسخ غیرمنتظره‌ای داد",
        };
      } catch (error) {
        console.error("Error deleting job history:", error.message);
        // به جای پرتاب خطا، پیام را برگردانید
        return { message: "خطایی در ارتباط با سرور رخ داد: " + error.message };
      }
    },
  });
};

// create job history
export const useCreateJobHistory = () => {
  return useMutation({
    mutationFn: async (data) => {
      try {
        const response = await api.post("/SharePanel/CreateJobHistory", data);
        return response;
      } catch (error) {
        console.error("خطا در ایجاد سابقه شغلی:", error);
        throw error;
      }
    },
  });
};

// edit job history
export const useEditJobHistory = () => {
  return useMutation({
    mutationFn: async (userData) => {
      try {
        // فیلتر کردن فیلدها، اما نگه‌داشتن id حتی اگر null یا undefined باشه
        const filteredData = Object.fromEntries(
          Object.entries(userData).filter(
            ([key, value]) =>
              key === "id" || (value !== undefined && value !== null)
          )
        );

        const response = await api.post(
          "/SharePanel/UpdateJobHistory",
          filteredData
        );
        return response.data;
      } catch (error) {
        console.error("خطا در ویرایش سابقه شغلی:", {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data,
        });
        throw error;
      }
    },
  });
};
