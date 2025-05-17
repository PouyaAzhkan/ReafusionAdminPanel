import { useMutation } from "@tanstack/react-query";
import Api from '../../../interceptor'

const EditDepartments = (refetch, toggle) => {
  return useMutation({
     mutationKey: ['EditDepartments'],
     mutationFn: async (data) => {
       const response = await Api.put(`/Department`, data);

       return response
     },
     onSuccess: (data) => {
       refetch()
       alert("بخش با موفقیت ویرایش شد");
       toggle();
       console.log(data);
     },
     onError: (error) => {
        const errorMessage = error?.response?.data?.ErrorMessage?.[0] || "خطایی رخ داده است.";
        alert(errorMessage);
        console.log(error);
     }
  })
}

export default EditDepartments