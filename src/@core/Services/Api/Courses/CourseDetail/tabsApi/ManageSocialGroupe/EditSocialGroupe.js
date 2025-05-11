import { useMutation } from "@tanstack/react-query";
import Api from "../../../../../../../@core/Services/interceptor";

const EditSocialGroupe = () => {
  return useMutation({
     mutationKey: ['EditSocialGroupe'],
     mutationFn: async (data) => {
       const response = await Api.put(`/CourseSocialGroup`, data);
       
       return response
     }
  })
}

export default EditSocialGroupe