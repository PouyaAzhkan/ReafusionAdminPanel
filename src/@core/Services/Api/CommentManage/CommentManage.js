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
