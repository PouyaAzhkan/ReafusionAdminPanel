import { useQuery } from "@tanstack/react-query";
import api from "../../interceptor/index";

export const getUserPayList = (userId) => {
  return useQuery({
    queryKey: ["GetUserPayList"],
    queryFn: async () => {
      try {
        const response = await api.get(
          `/CoursePayment/UserPayList?StudentId=${userId}`
        );
        return response;
      } catch (error) {
        console.log("error is :", error);
        throw error;
      }
    },
  });
};
