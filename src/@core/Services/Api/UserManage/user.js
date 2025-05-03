import { useQuery } from "@tanstack/react-query";
import api from "../../interceptor/index";

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
        if (params[key] !== undefined && params[key] !== null && params[key] !== "") {
          queryString += `&${key}=${params[key]}`;
        }
      });

      const finalUrl = `/User/UserMannage${queryString ? "?" + queryString.slice(1) : ""}`;

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
