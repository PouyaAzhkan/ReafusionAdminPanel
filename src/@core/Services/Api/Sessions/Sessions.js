import api from "../../interceptor/index";
import { useMutation, useQuery } from "@tanstack/react-query";

// add session to schedual
export const useAddSession = () => {
  return useMutation({
    mutationFn: async (sessionData) => {
      try {
        const response = await api.post("/Session/AddSession", sessionData, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        console.log("پاسخ خام API:", response);
        console.log("داده‌های بازگشتی:", response.data);
        return response;
      } catch (error) {
        console.error("خطا در افزودن جلسه:", error);
        throw error;
      }
    },
  });
};

// add session file with url
export const useAddSessionFileWithUrl = () => {
  return useMutation({
    mutationFn: async (params) => {
      try {
        // تبدیل پارامترها به Query String
        const queryParams = new URLSearchParams({
          SessionId: params.SessionId,
          Url: params.Url,
          FileName: params.FileName,
          FileFormat: params.FileFormat,
        }).toString();

        // ارسال درخواست POST با Query Parameters
        const response = await api.post(
          `/Session/AddSessionFileWithUrl?${queryParams}`
        );
        return response;
      } catch (error) {
        console.error("خطا در افزودن فایل با url:", error);
        throw error;
      }
    },
  });
};

// edit session
export const useEditSession = () => {
  return useMutation({
    mutationFn: async (sessionData) => {
      try {
        const response = await api.put("/Session/UpdateSession", sessionData, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        return response;
      } catch (error) {
        console.error("خطا در ویرایش جلسه:", error);
        throw error;
      }
    },
  });
};

// get session detail
export const getSessionDetail = (SessionId) => {
  return useQuery({
    queryKey: ["GetSessionDetail", SessionId],
    queryFn: async () => {
      try {
        const response = await api.get(
          `/Session/SessionDetail?SessionId=${SessionId}`
        );
        return response;
      } catch (error) {
        console.log("error is : ", error);
        throw error;
      }
    },
    enabled: !!SessionId,
  });
};
