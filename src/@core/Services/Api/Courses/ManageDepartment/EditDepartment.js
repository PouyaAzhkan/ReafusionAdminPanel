import { useMutation } from "@tanstack/react-query";
import Api from '../../../interceptor'
import toast from "react-hot-toast";

const EditDepartments = (refetch, toggle) => {
  return useMutation({
     mutationKey: ['EditDepartments'],
     mutationFn: async (data) => {
       const response = await Api.put(`/Department`, data);

       return response
     },
     onSuccess: (data) => {
       refetch()
       toast.success("بخش با موفقیت ویرایش شد");
       toggle();
       console.log(data);
     },
     onError: (error) => {
        const errorMessage = error?.response?.data?.ErrorMessage?.[0] || "خطایی رخ داده است.";
        toast.error(errorMessage);
        console.log(error);
     }
  })
}

export default EditDepartments