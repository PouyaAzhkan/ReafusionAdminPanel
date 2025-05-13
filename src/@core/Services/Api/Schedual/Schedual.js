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
        const response = await api.post(
          `/Schedual/AddSchedualAutomatic?currentCurseId=${currentCurseId}`,
          scheduleData // آرایه‌ای از اشیاء که در بدنه درخواست ارسال می‌شود
        );
        return response.data; // فرض می‌کنم پاسخ API در response.data است
      } catch (error) {
        console.log("error is: ", error);
        throw error;
      }
    },
  });
};
