import { useMutation, useQuery } from "@tanstack/react-query";
import api from "../../interceptor/index";

// get user list
export const GetUserList = (
  SortType,
  SortingCol,
  Query,
  PageNumber,
  RowsOfPage,
  IsActiveUser,
  IsDeletedUser,
  currentRole,
  dateFilter
) => {
  return useQuery({
    queryKey: [
      "GetUserList",
      SortType,
      SortingCol,
      Query,
      PageNumber,
      RowsOfPage,
      IsActiveUser,
      IsDeletedUser,
      currentRole?.value,
      dateFilter,
    ],
    queryFn: async () => {
      let queryString = "";

      const params = {
        SortType,
        SortingCol,
        Query,
        PageNumber,
        RowsOfPage,
        IsActiveUser,
        IsDeletedUser,
        roleId: currentRole?.value,
        dateFilter: dateFilter, // اضافه کردن تاریخ فیلتر
      };

      Object.keys(params).forEach((key) => {
        if (
          params[key] !== undefined &&
          params[key] !== null &&
          params[key] !== ""
        ) {
          queryString += `&${key}=${params[key]}`;
        }
      });

      const finalUrl = `/User/UserMannage${
        queryString ? "?" + queryString.slice(1) : ""
      }`;

      try {
        const response = await api.get(finalUrl);
        return response;
      } catch (error) {
        console.error("خطا در دریافت لیست کاربران:", error);
        throw error;
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
