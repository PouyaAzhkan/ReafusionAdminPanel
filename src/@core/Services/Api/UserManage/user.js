import { useMutation, useQuery } from "@tanstack/react-query";
import api from "../../interceptor/index";

// get user list
export const GetUserList = (params) => {
  return useQuery({
    queryKey: ["GetUserList", params],
    queryFn: async () => {
      try {
        const response = await api.get("/User/UserMannage", { params });
        return response; // یا response.data.data بسته به API
      } catch (error) {
        console.error("Error fetching user list:", error);
        throw new Error("Failed to fetch user list");
      }
    },
  });
};

// create user
export const useCreateUser = () => {
  return useMutation({
    mutationFn: async (data) => {
      try {
        const response = await api.post("/User/CreateUser", data);
        return response;
      } catch (error) {
        console.error("خطا در ایجاد کاربر:", error);
        throw error;
      }
    },
  });
};

// delete user
export const useDeleteUser = () => {
  return useMutation({
    mutationFn: async (userId) => {
      try {
        const response = await api.delete("/User/DeleteUser", {
          data: { userId },
        });
        return response;
      } catch (error) {
        console.error("خطا در حذف کاربر:", error);
        throw error;
      }
    },
  });
};

// get user detail
export const useUserDetail = (userId) => {
  return useQuery({
    queryKey: ["UserDetail", userId],
    queryFn: async () => {
      const response = await api.get(`/User/UserDetails/${userId}`);
      return response; // فقط داده اصلی رو برگردون، نه کل response
    },
    enabled: !!userId,
  });
};
