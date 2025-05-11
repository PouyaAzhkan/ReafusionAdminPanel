import { useMutation } from "@tanstack/react-query";
import Api from "../../../../../interceptor";
import toast from "react-hot-toast";

const DeleteComment = () => {
  return useMutation({
      mutationKey: ['DeleteComment'],
      mutationFn: async (id) => {
         const response = await Api.delete(`/Course/DeleteCourseComment?CourseCommandId=${id}`);
         
         return response
      },
      onSuccess: (data) => {
         alert("کامنت حذف شد")
         console.log(data);
      },
      onError: (error) => {
          const errorMessage = error?.response?.data?.ErrorMessage?.[0] || "خطا در حذف کامنت";
          toast.error(errorMessage); 
          console.log(error);
      }
  })
}

export default DeleteComment