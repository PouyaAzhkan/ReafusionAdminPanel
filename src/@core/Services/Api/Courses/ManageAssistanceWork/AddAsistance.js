import { useMutation } from "@tanstack/react-query";
import Api from '../../../interceptor'
import toast from "react-hot-toast";

const AddAsistance = () => {
  return useMutation({
     mutationKey: ['AddAsistance'],
     mutationFn: async (data) => {
       const response = await Api.post(`/AssistanceWork`, data);

       return response
     },
     onSuccess: (data) => {
       toast.success("تسک با موفقیت اضافه شد");
       console.log(data);
     },
     onError: (error) => {
       toast.error("خطا در افزودن تسک")
       console.log(error);
     }
  })
}

export default AddAsistance