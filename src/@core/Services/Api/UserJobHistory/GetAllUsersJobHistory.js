import { useQuery } from "@tanstack/react-query";
import api from "../../interceptor/index";

export const useAllUsersJobHistory = () => {
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
