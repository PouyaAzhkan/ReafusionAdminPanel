import { useMutation, useQuery } from "@tanstack/react-query";
import Api from '../../../interceptor'

const AddTecnology = () => {
  return useMutation({
    mutationKey: ['AddTecnology'],
    mutationFn: async (data) => {
       const response = await Api.post(`/Technology`, data);
       
       return response
    }
  })
}

export default AddTecnology