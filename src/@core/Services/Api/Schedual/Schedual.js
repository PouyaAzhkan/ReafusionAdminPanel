import { useMutation, useQuery } from "@tanstack/react-query";
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

// get teacher schedual
export const getTeacherSchedual = (params) => {
  return useQuery({
    queryKey: ["TeacherSchedual", params],
    queryFn: async () => {
      try {
        const response = await api.get("/Schedual/GetTeacherScheduals", {
          params,
        });
        return response;
      } catch (error) {
        console.log("error is: ", error);
        throw error;
      }
    },
  });
};

// get student schedual
export const getStudentSchedual = (params) => {
  return useQuery({
    queryKey: ["StudentSchedual", params],
    queryFn: async () => {
      try {
        const response = await api.get("/Schedual/GetStudentScheduals", {
          params,
        });
        return response;
      } catch (error) {
        console.log("error is: ", error);
        throw error;
      }
    },
  });
};

// add new schedual
export const useAddNewSchedule = (currentCurseId, scheduleData) => {
  return useMutation({
    mutationFn: async () => {
      try {
        if (!currentCurseId) {
          throw new Error("currentCurseId is required");
        }
        const response = await api.post(
          `/Schedual/AddSchedualSingle?currentCurseId=${encodeURIComponent(
            currentCurseId
          )}`,
          scheduleData,
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        return response.data;
      } catch (error) {
        console.log("Error in useAddNewSchedule:", {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          headers: error.response?.headers,
        });
        throw (
          error.response?.data?.errors ||
          error.response?.data?.message ||
          error.message
        );
      }
    },
  });
};
