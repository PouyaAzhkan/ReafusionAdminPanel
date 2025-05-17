import { useMutation } from "@tanstack/react-query";
import Api from '../../../interceptor'

const EditAsistance = () => {
  return useMutation({
     mutationKey: ['EditAsistance'],
     mutationFn: async (data) => {
       const response = await Api.put(`/AssistanceWork`, data);

       return response
     },
     onSuccess: (data) => {
       alert("تسک با ویرایش اضافه شد");
       console.log(data);
     },
     onError: (error) => {
       alert("خطا در ویرایش تسک")
       console.log(error);
     }
  })
}

export default EditAsistance