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

// get dashboard user info
export const GetDashboardUserInfo = () => {
  return useQuery({
    queryKey: ["GetUserInfo"],
    queryFn: async () => {
      const response = await api.get(`/SharePanel/GetProfileInfo`);

      return response;
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

// Add User Role
export const addUserRole = () => {
  return useMutation({
    mutationFn: async ({ userId, roleId }) => {
      try {
        const response = await api.post(
          "/User/AddUserAccess",
          {
            roleId: roleId,
            userId: userId,
            Enable: true,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        return response.data;
      } catch (error) {
        console.error(
          `خطا در دادن نقش برای userId: ${userId} و roleId: ${roleId}`,
          error
        );
        throw error;
      }
    },
  });
};

// change user activity
export const changeUserActivity = () => {
  return useMutation({
    mutationFn: async ({ userId }) => {
      try {
        console.log("Sending userId:", userId); // لاگ userId برای دیباگ
        const response = await api.put(
          "/User/ReverseToActiveUser",
          { userId },
          { headers: { "Content-Type": "application/json" } }
        );
        return response.data;
      } catch (error) {
        console.error("Error changing user activity:", {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data, // جزئیات خطای سرور (مثل ErrorType و ErrorMessage)
          config: error.config, // تنظیمات درخواست برای دیباگ
        });
        throw error;
      }
    },
  });
};

// edit user info
export const editUserInfo = () => {
  return useMutation({
    mutationFn: async (userData) => {
      try {
        // فیلتر کردن فیلدها، اما نگه‌داشتن id حتی اگر null یا undefined باشه
        const filteredData = Object.fromEntries(
          Object.entries(userData).filter(
            ([key, value]) =>
              key === "id" || (value !== undefined && value !== null)
          )
        );

        const response = await api.put("/User/UpdateUser", filteredData);
        return response.data;
      } catch (error) {
        console.error("خطا در ویرایش اطلاعات کاربر:", {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data,
        });
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
