import { useMutation } from "@tanstack/react-query";
import Api from "../../../../../interceptor";

const AcceptComment = () => {
  return useMutation({
     mutationKey: ['AcceptComment'],
     mutationFn: async (id) => {
       const response = await Api.post(`/Course/AcceptCourseComment?CommentCourseId=${id}`);
       
       return response
     },
     onSuccess: (data) => {
       alert("کامنت تایید شد")
       console.log(data);
     },
     onError: (error) => {
       alert("خطا در تایید کامنت")
       console.log(error);
     }
  })
}

export default AcceptComment