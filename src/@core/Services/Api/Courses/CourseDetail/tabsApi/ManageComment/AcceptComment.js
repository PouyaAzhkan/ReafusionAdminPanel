import { useMutation } from "@tanstack/react-query";
import Api from "../../../../../interceptor";
import toast from "react-hot-toast";

const AcceptComment = () => {
  return useMutation({
     mutationKey: ['AcceptComment'],
     mutationFn: async (id) => {
       const response = await Api.post(`/Course/AcceptCourseComment?CommentCourseId=${id}`);
       
       return response
     },
     onSuccess: (data) => {
       toast.success("کامنت تایید شد")
       console.log(data);
     },
     onError: (error) => {
       toast.error("خطا در تایید کامنت")
       console.log(error);
     }
  })
}

export default AcceptComment