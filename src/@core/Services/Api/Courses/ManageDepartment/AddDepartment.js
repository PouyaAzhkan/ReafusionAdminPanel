import { useMutation } from "@tanstack/react-query";
import Api from '../../../interceptor'

const AddDepartment = () => {
  return useMutation({
     mutationKey: ['AddDepartment'],
     mutationFn: async (data) => {
       const response = await Api.post(`/Department`, data);

       return response
     },
     onSuccess: (data) => {
       console.log(data);
       alert("بخش با موفیقت اضافه شد")
     },
     onError: (error) => {
         console.log(error);
         alert("خطا در افزودن بخش")
     }
  })
}

export default AddDepartment