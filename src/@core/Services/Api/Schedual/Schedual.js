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
export const useAddNewSchedule = (currentCurseId) => {
  return useMutation({
    mutationFn: async (scheduleData) => {
      try {
        if (!currentCurseId) {
          throw new Error("currentCurseId is required");
        }
        const response = await api.post(
          `/Schedual/AddSchedualSingle?currentCurseId=${currentCurseId}`,
          scheduleData,
          {
            headers: {
              "Content-Type": "application/json",
            },
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

// get course group detail
export const getCourseGroupDetail = (Id, options = {}) => {
  const isValidId = Id && Number.isInteger(Number(Id)) && Number(Id) > 0;

  return useQuery({
    queryKey: ["GroupDetail", Id],
    queryFn: async () => {
      if (!isValidId) {
        throw new Error("Invalid courseGroupId");
      }
      try {
        const response = await api.get("/CourseGroup/Details", {
          params: { Id },
        });
        return response; // فقط داده‌ها رو برگردون
      } catch (error) {
        console.error("Error in getCourseGroupDetail:", error);
        throw error;
      }
    },
    enabled: options.enabled !== false && isValidId, // فقط وقتی Id معتبره و enabled صراحتاً false نیست
    ...options,
  });
};

// update schedual
export const useUpdateSchedule = (currentCurseId) => {
  return useMutation({
    mutationFn: async (scheduleData) => {
      try {
        if (!currentCurseId) {
          throw new Error("currentCurseId is required");
        }
        const response = await api.post(
          `/Schedual/UpdateSchedualSingle?currentCurseId=${currentCurseId}`,
          scheduleData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        return response;
      } catch (error) {
        console.log("error", error);
      }
    },
  });
};

// edit forming
export const useEditFroming = () => {
  return useMutation({
    mutationFn: async ({ id, active }) => {
      try {
        const response = await api.put("/Schedual/SchedualFroming", {
          id,
          active,
        });
        return response.data;
      } catch (error) {
        console.error("خطا در تغییر حالت دوره:", error);
        throw error;
      }
    },
  });
};

// edit lock to rasie
export const useEditLockToRiase = () => {
  return useMutation({
    mutationFn: async ({ id, active }) => {
      try {
        const response = await api.put("/Schedual/LockToRiase", { id, active });
        return response.data;
      } catch (error) {
        console.error("خطا در تغییر حضور:", error);
        throw error;
      }
    },
  });
};
