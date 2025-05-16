import { useMutation } from "@tanstack/react-query";
import Api from '../../../interceptor'

const EditClassRoom = () => {
  return useMutation({
     mutationKey: ['EditClass'],
     mutationFn: async (data) => {
       const response = await Api.put(`/ClassRoom`, data);

       return response
     }
  })
}

export default EditClassRoom