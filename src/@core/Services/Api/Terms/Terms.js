import { Mutation, useMutation, useQuery } from "@tanstack/react-query";
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

// get all departments
export const getAllDepartments = () => {
  return useQuery({
    queryKey: ["GetAllDepartments"],
    queryFn: async () => {
      try {
        const response = await api.get("/Department");
        return response;
      } catch (error) {
        console.log("error is : ", error);
        throw error;
      }
    },
  });
};

// add term
export const useAddTerm = () => {
  return useMutation({
    mutationFn: async (termData) => {
      try {
        const response = await api.post("/Term", termData);
        return response;
      } catch (error) {
        throw error;
      }
    },
    onError: (error) => {
      console.error("Failed to add term:", error);
    },
  });
};

// edit term
export const useEditTerm = () => {
  return useMutation({
    mutationFn: async (termData) => {
      try {
        const response = await api.put("/Term", termData);
        return response;
      } catch (error) {
        throw error;
      }
    },
    onError: (error) => {
      console.error("Failed to edit term:", error);
    },
  });
};

// add time
export const useAddTermTime = () => {
  return useMutation({
    mutationFn: async (termTimeData) => {
      try {
        const response = await api.post("/Term/AddTermCloseDate", termTimeData);
        return response;
      } catch (error) {
        throw error;
      }
    },
    onError: (error) => {
      console.error("Failed to add term:", error);
    },
  });
};

// edit term
export const useEditTermTime = () => {
  return useMutation({
    mutationFn: async (termTimeData) => {
      try {
        const response = await api.put(
          "/Term/UpdateTermCloseDate",
          termTimeData
        );
        return response;
      } catch (error) {
        throw error;
      }
    },
    onError: (error) => {
      console.error("Failed to edit term:", error);
    },
  });
};
