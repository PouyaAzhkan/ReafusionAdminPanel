import { useMutation } from "@tanstack/react-query";
import Api from '../../../interceptor'

const EditTecnology = () => {
  return useMutation({
      mutationKey: ['EditTecnology'],
      mutationFn: async (data) => {
         const response = await Api.put(`/Technology`, data);
         
         return response
      }
  })
}

export default EditTecnology