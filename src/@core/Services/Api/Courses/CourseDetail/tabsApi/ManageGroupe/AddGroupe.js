import { useMutation } from "@tanstack/react-query";
import Api from "../../../../../../../@core/Services/interceptor";

const AddGroupe = () => {
  return useMutation({
    mutationKey: ['AddGroupe'],
    mutationFn: async (formData) => {
       const response = await Api.post(`/CourseGroup`, formData);

       return response
    }
  })
}

export default AddGroupe