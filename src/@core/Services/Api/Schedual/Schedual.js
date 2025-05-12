import { useQuery } from "@tanstack/react-query";
import api from "../../interceptor/index";

// get Admin schedual
export const getAdminSchedual = (params) => {
  return useQuery({
    queryKey: ["AdminSchedual", params],
    queryFn: async () => {
      try {
        const response = await api.get("/Schedual/GetAdminScheduals", {
          params,
        });
        return response;
      } catch (error) {
        console.log("error : ", error);
        throw error;
      }
    },
  });
};
