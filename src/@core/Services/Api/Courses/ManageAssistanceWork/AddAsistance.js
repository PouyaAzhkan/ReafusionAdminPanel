import { useMutation } from "@tanstack/react-query";
import Api from '../../../interceptor'

const AddAsistance = () => {
  return useMutation({
     mutationKey: ['AddAsistance'],
     mutationFn: async (data) => {
       const response = await Api.post(`/AssistanceWork`, data);

       return response
     },
     onSuccess: (data) => {
       alert("تسک با موفقیت اضافه شد");
       console.log(data);
     },
     onError: (error) => {
       alert("خطا در افزودن تسک")
       console.log(error);
     }
  })
}

export default AddAsistance