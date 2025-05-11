import { useMutation } from "@tanstack/react-query";
import Api from "../../../../../../../@core/Services/interceptor";

const EditGroupe = () => {
  return useMutation({
    mutationKey: ['EditGroupe'],
    mutationFn: async (formData) => {
       const response = await Api.put(`/CourseGroup`, formData);

       return response
    }
  })
}

export default EditGroupe