import { useMutation } from "@tanstack/react-query";
import Api from "../../../../../interceptor";
import toast from "react-hot-toast";

const RejectComment = () => {
  return useMutation({
    mutationKey: ['RejectComment'],
    mutationFn: async (id) => {
      const response = await Api.post(`/Course/RejectCourseComment?CommentCourseId=${id}`);
      return response;
    },
    onSuccess: (data) => {
      toast.success("کامنت ریجک شد");
      console.log(data);
    },
    onError: (error) => {
      toast.error("خطا در ریجک کامنت");
      console.log(error);
    }
  });
};

export default RejectComment;
