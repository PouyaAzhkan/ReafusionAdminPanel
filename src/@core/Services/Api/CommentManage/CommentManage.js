import { useMutation, useQuery } from "@tanstack/react-query";
import api from "../../interceptor/index";

// get comment list
export const GetCommentList = (params) => {
  return useQuery({
    queryKey: ["CommentList", params],
    queryFn: async () => {
      try {
        const response = await api.get("/Course/CommentManagment", { params });
        return response; // یا response.data.data بسته به API
      } catch (error) {
        console.error("Error fetching comment list:", error);
        throw new Error("Failed to fetch comment list");
      }
    },
  });
};

// delete comment
export const useDeleteComment = () => {
  return useMutation({
    mutationFn: async (CourseCommandId) => {
      try {
        const response = await api.delete(
          `/Course/DeleteCourseComment?CourseCommandId=${CourseCommandId}`
        );
        return response.data;
      } catch (error) {
        console.error("Error deleting comment:", error);
        throw error;
      }
    },
  });
};

// accept comment
export const useAcceptComment = () => {
  return useMutation({
    mutationFn: async (CommentCourseId) => {
      try {
        const response = await api.post(
          `/Course/AcceptCourseComment?CommentCourseId=${CommentCourseId}`
        );
        return response.data;
      } catch (error) {
        console.error("Error accept comment:", error);
        throw error;
      }
    },
  });
};

// reject comment
export const useRejectComment = () => {
  return useMutation({
    mutationFn: async (CommentCourseId) => {
      try {
        const response = await api.post(
          `/Course/RejectCourseComment?CommentCourseId=${CommentCourseId}`
        );
        return response;
      } catch (error) {
        console.error("Error reject comment:", error);
        throw error;
      }
    },
  });
};

// add reply comment
export const useAddReplyComment = () => {
  return useMutation({
    mutationFn: async ({ commentId, courseId, title, describe }) => {
      console.log("داده‌های دریافتی در mutationFn:", {
        commentId,
        courseId,
        title,
        describe,
      });
      if (!commentId || !courseId || !title || !describe) {
        throw new Error(
          "داده‌های ارسالی ناقص هستند: " +
            JSON.stringify({ commentId, courseId, title, describe })
        );
      }

      const formData = new FormData();
      formData.append("CommentId", commentId);
      formData.append("CourseId", courseId);
      formData.append("Title", title);
      formData.append("Describe", describe);

      const response = await api.post(
        "/Course/AddReplyCourseComment",
        formData,
        {
          headers: {
            // هدر Content-Type به صورت خودکار توسط FormData تنظیم می‌شود، نیازی به تنظیم دستی نیست
          },
        }
      );
      return response;
    },
    onSuccess: (data) => {
      console.log("پاسخ با موفقیت ثبت شد:", data);
    },
    onError: (error) => {
      const errorData = error.response?.data;
      let errorMessage = "خطایی در ثبت پاسخ رخ داد";
      if (errorData) {
        if (Array.isArray(errorData.ErrorMessage)) {
          errorMessage = errorData.ErrorMessage.join(", ");
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.errors) {
          errorMessage = Object.values(errorData.errors).flat().join(", ");
        } else if (errorData.detail) {
          errorMessage = errorData.detail;
        }
      }
      console.error("جزئیات کامل خطا در ثبت پاسخ:", errorData);
      console.error("خطا در ثبت پاسخ:", errorMessage);
    },
  });
};

// get course comments
export const getCommentReply = (CourseId, CommentId) => {
  return useQuery({
    queryKey: ["CourseCommentReply", CourseId, CommentId],
    queryFn: async () => {
      try {
        const response = await api.get(
          `/Course/GetCourseReplyCommnets/${CourseId}/${CommentId}`
        );
        return response;
      } catch (error) {
        console.error("Error fetching comment replies:", error.response?.data);
        throw error;
      }
    },
  });
};
