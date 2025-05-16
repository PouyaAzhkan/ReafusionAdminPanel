import { useMutation } from "@tanstack/react-query";
import Api from '../../../interceptor'

const AddClass = () => {
  return useMutation({
     mutationKey: ['AddClass'],
     mutationFn: async (data) => {
       const response = await Api.post(`/ClassRoom`, data);

       return response
     }
  })
}

export default AddClass