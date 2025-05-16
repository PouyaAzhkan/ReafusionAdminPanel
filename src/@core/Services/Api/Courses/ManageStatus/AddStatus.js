import { useMutation } from "@tanstack/react-query";
import Api from '../../../interceptor'

const AddStatus = () => {
  return useMutation({
     mutationKey: ['AddStatus'],
     mutationFn: async (data) => {
       const response = await Api.post(`/Status`, data);

       return response
     }
  })
}

export default AddStatus