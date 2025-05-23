import { useMutation, useQuery } from "@tanstack/react-query";
import api from "../../interceptor/index";

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

// get dashboard user info
export const getAdminCourseList = (params) => {
  return useQuery({
    queryKey: ["GetAdminCourses", params],
    queryFn: async () => {
      try {
        const response = await api.get("/SharePanel/GetMyCourses", { params });
        return response;
      } catch (error) {
        console.error("Error fetching course list:", error);
        throw new Error("Failed to fetch course list");
      }
    },
  });
};

// edit admin profile info
export const editAdminProfileInfo = () => {
  return useMutation({
    mutationFn: async (adminData) => {
      try {
        const formData = new FormData();
        for (const key in adminData) {
          // مدیریت مقادیر null یا undefined
          formData.append(key, adminData[key] ?? "");
        }

        const response = await api.put(
          "/SharePanel/UpdateProfileInfo",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        return response.data;
      } catch (error) {
        console.error("خطا در ویرایش اطلاعات ادمین:", {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data,
        });
        throw error;
      }
    },
  });
};

// delete profile image
export const useDeleteProfileImage = () => {
  return useMutation({
    mutationFn: async (imageId) => {
      try {
        const formData = new FormData();
        formData.append("DeleteEntityId", imageId ?? "");

        const response = await api.delete("/SharePanel/DeleteProfileImage", {
          data: formData, // ارسال formData به‌عنوان بدنه
          // هدر Content-Type رو حذف می‌کنیم تا axios خودش تنظیم کنه
        });

        console.log("Raw Delete API Response:", response); // دیباگ پاسخ خام
        console.log("Delete Response Data:", response.data); // دیباگ داده‌های پاسخ

        // اگر response.data undefined است، خود response رو برگردون
        return response.data !== undefined ? response.data : response;
      } catch (error) {
        console.error("Error in delete profile image:", error); // دیباگ خطا
        throw new Error(`Failed to delete profile image: ${error.message}`);
      }
    },
    onError: (error) => {
      console.error("Mutation error in delete:", error); // دیباگ خطای mutation
    },
  });
};

// select profile image
export const useSelectProfileImage = () => {
  return useMutation({
    mutationFn: async (imageId) => {
      try {
        const formData = new FormData();
        formData.append("ImageId", imageId ?? "");

        const response = await api.post(
          "/SharePanel/SelectProfileImage",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data", // این خط ممکن است لازم نباشد
            },
          }
        );

        return response.data;
      } catch (error) {
        throw new Error(`Failed to select profile image: ${error.message}`);
      }
    },
  });
};

// add profile image
export const useAddProfileImage = () => {
  return useMutation({
    mutationFn: async (selectedImage) => {
      try {
        if (
          !selectedImage ||
          !(selectedImage instanceof File || selectedImage instanceof Blob)
        ) {
          throw new Error("فایل تصویر معتبر نیست!");
        }

        const formData = new FormData();
        formData.append("formFile", selectedImage);

        const response = await api.post(
          "/SharePanel/AddProfileImage",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        console.log("Raw API response:", response); // دیباگ پاسخ خام
        console.log("Response data:", response.data); // دیباگ داده‌های پاسخ

        // اگر response.data undefined است، مستقیماً response رو برگردون
        return response.data !== undefined ? response.data : response;
      } catch (error) {
        console.error("Error in useAddProfileImage:", error); // دیباگ خطا
        throw new Error(`خطا در افزودن تصویر پروفایل: ${error.message}`);
      }
    },
    onError: (error) => {
      console.error("Mutation error:", error); // دیباگ خطای mutation
    },
  });
};
