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

// get admin course list
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

// get admin job history
export const getAdminJobHistory = () => {
  return useQuery({
    queryKey: ["GetAdminJobHistory"],
    queryFn: async () => {
      try {
        const response = await api.get("/SharePanel/GetMyJobHistories");
        return response;
      } catch (error) {
        console.error("Error fetching job history :", error);
        throw new Error("Failed to fetch job history");
      }
    },
  });
};

// get admin reserved course
export const getAdminReservedCourseList = () => {
  return useQuery({
    queryKey: ["GetAdminReservedCourseList"],
    queryFn: async () => {
      try {
        const response = await api.get("/SharePanel/GetMyCoursesReserve");
        return response;
      } catch (error) {
        console.error("Error fetching job history :", error);
        throw new Error("Failed to fetch job history");
      }
    },
  });
};

// get admin favorite course
export const getAdminFavoriteCourseList = () => {
  return useQuery({
    queryKey: ["GetAdminFavoriteCourseList"],
    queryFn: async () => {
      try {
        const response = await api.get("/SharePanel/GetMyFavoriteCourses");
        return response;
      } catch (error) {
        console.error("Error fetching favorite course :", error);
        throw new Error("Failed to fetch favorite course");
      }
    },
  });
};

// get admin favorite news
export const getAdminFavoriteNewsList = () => {
  return useQuery({
    queryKey: ["GetAdminFavoriteNewsList"],
    queryFn: async () => {
      try {
        const response = await api.get("/SharePanel/GetMyFavoriteNews");
        return response;
      } catch (error) {
        console.error("Error fetching favorite news :", error);
        throw new Error("Failed to fetch favorite news");
      }
    },
  });
};

// get admin course comments
export const getAdminCourseComments = () => {
  return useQuery({
    queryKey: ["GetAdminCourseComments"],
    queryFn: async () => {
      try {
        const response = await api.get("/SharePanel/GetMyCoursesComments");
        return response;
      } catch (error) {
        console.error("Error fetching course comments :", error);
        throw new Error("Failed to fetch course comments");
      }
    },
  });
};

// get admin news comments
export const getAdminNewsComments = () => {
  return useQuery({
    queryKey: ["GetAdminNewsComments"],
    queryFn: async () => {
      try {
        const response = await api.get("/SharePanel/GetMyNewsComments");
        return response;
      } catch (error) {
        console.error("Error fetching news comments :", error);
        throw new Error("Failed to fetch news comments");
      }
    },
  });
};

// get admin security info
export const getAdminSecurityInfo = () => {
  return useQuery({
    queryKey: ["GetAdminSecurityInfo"],
    queryFn: async () => {
      try {
        const response = await api.get("/SharePanel/GetSecurityInfo");
        return response;
      } catch (error) {
        console.error("Error fetching security info :", error);
        throw new Error("Failed to fetch security info");
      }
    },
  });
};

// delete favorite news
export const useDeleteAdminFavoriteNews = () => {
  return useMutation({
    mutationFn: async (favoriteId) => {
      try {
        const response = await api.delete("/News/DeleteFavoriteNews", {
          data: { deleteEntityId: favoriteId }, // ارسال بدنه به صورت JSON
          headers: {
            "Content-Type": "application/json", // تنظیم هدر
          },
        });
        return true;
      } catch (error) {
        console.error(
          "خطا در حذف خبر از علاقه‌مندی:",
          error.response?.data || error.message
        );
        throw error;
      }
    },
  });
};

// delete favorite course
export const useDeleteAdminFavoriteCourse = () => {
  return useMutation({
    mutationFn: async (favoriteId) => {
      try {
        const formData = new FormData();
        formData.append("CourseFavoriteId", favoriteId ?? "");

        const response = await api.delete("/Course/DeleteCourseFavorite", {
          data: formData,
        });

        return response.data !== undefined ? response.data : response;
      } catch (error) {
        throw new Error(`Failed to delete profile image: ${error.message}`);
      }
    },
    onError: (error) => {
      console.error("Mutation error in delete:", error); // دیباگ خطای mutation
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

// change password
export const useChangeAdminPassword = () => {
  return useMutation({
    mutationFn: async ({ oldPassword, newPassword }) => {
      try {
        const response = await api.post(
          "/SharePanel/ChangePassword",
          {
            oldPassword,
            newPassword,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        return response.data;
      } catch (error) {
        console.error("خطا در تغییر رمز!", error);
        throw error;
      }
    },
  });
};

// change recovery
export const useChangeAdminRecovery = () => {
  return useMutation({
    mutationFn: async ({ twoStepAuth, recoveryEmail, baseUrl }) => {
      try {
        const response = await api.put(
          "/SharePanel/EditSecurity",
          {
            twoStepAuth,
            recoveryEmail,
            baseUrl,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        return response.data;
      } catch (error) {
        console.error("خطا در تغییر رمز!", error);
        throw error;
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
