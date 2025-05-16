import { useMutation } from "@tanstack/react-query";
import Api from '../../../interceptor'

const EditStatus = () => {
  return useMutation({
     mutationKey: ['EditStatus'],
     mutationFn: async (data) => {
       const response = await Api.put(`/Status`, data);

       return response
     }
  })
}

export default EditStatus