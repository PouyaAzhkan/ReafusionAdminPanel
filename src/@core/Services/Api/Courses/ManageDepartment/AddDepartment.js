import { useMutation } from "@tanstack/react-query";
import Api from '../../../interceptor'
import toast from "react-hot-toast";

const AddDepartment = () => {
  return useMutation({
     mutationKey: ['AddDepartment'],
     mutationFn: async (data) => {
       const response = await Api.post(`/Department`, data);

       return response
     },
     onSuccess: (data) => {
       console.log(data);
       toast.success("بخش با موفیقت اضافه شد")
     },
     onError: (error) => {
         console.log(error);
         toast.error("خطا در افزودن بخش")
     }
  })
}

export default AddDepartment