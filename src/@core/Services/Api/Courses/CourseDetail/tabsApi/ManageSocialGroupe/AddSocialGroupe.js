import { useMutation } from "@tanstack/react-query";
import Api from "../../../../../../../@core/Services/interceptor";

const AddSocialGroupe = () => {
  return useMutation({
     mutationKey: ['AddSocialGroupe'],
     mutationFn: async (data) => {
       const response = await Api.post(`/CourseSocialGroup`, data);
       
       return response
     }
  })
}

export default AddSocialGroupe