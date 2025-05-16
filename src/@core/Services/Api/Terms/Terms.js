import { useQuery } from "@tanstack/react-query";
import api from "../../interceptor/index";

// get all terms
export const getAllTerms = () => {
  return useQuery({
    queryKey: ["GetAllTerms"],
    queryFn: async () => {
      try {
        const response = await api.get("/Term");
        return response;
      } catch (error) {
        console.log("error is : ", error);
        throw error;
      }
    },
  });
};
