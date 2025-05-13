import { useMutation } from "@tanstack/react-query";
import Api from "../../../../../interceptor";

const RejectComment = () => {
  return useMutation({
    mutationKey: ['RejectComment'],
    mutationFn: async (id) => {
      const response = await Api.post(`/Course/RejectCourseComment?CommentCourseId=${id}`);
      return response;
    },
    onSuccess: (data) => {
      alert("کامنت ریجک شد");
      console.log(data);
    },
    onError: (error) => {
      alert("خطا در ریجک کامنت");
      console.log(error);
    }
  });
};

export default RejectComment;
