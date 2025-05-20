import { useMutation } from "@tanstack/react-query";
import Api from '../../../interceptor'
import toast from "react-hot-toast";

const EditAsistance = () => {
  return useMutation({
     mutationKey: ['EditAsistance'],
     mutationFn: async (data) => {
       const response = await Api.put(`/AssistanceWork`, data);

       return response
     },
     onSuccess: (data) => {
       toast.success("تسک با ویرایش اضافه شد");
       console.log(data);
     },
     onError: (error) => {
       toast.error("خطا در ویرایش تسک")
       console.log(error);
     }
  })
}

export default EditAsistance