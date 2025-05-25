import { useMutation, useQuery } from "@tanstack/react-query";
import api from "../../interceptor/index";

// get session home work
export const getSessionHomeWorks = (SessionId) => {
  return useQuery({
    queryKey: ["GetSessionHomeWorks", SessionId],
    queryFn: async () => {
      try {
        const response = await api.get(
          `/Session/GetSessionHomeWork?SessionId=${SessionId}`
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

// add session home work
export const useAddSessionHomeWork = () => {
  return useMutation({
    mutationFn: async (homeWorkData) => {
      try {
        const response = await api.post(
          "/Session/AddSessionHomeWork",
          homeWorkData,
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
        console.error("خطا در افزودن جلسه:", error);
        throw error;
      }
    },
  });
};


