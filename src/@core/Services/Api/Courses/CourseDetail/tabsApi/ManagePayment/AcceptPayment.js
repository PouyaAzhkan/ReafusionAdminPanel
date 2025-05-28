import { useMutation } from "@tanstack/react-query";
import Api from "../../../../../../../@core/Services/interceptor";

const AcceptPayment = () => {
  return useMutation({
    mutationKey: ['AcceptPayment'],
    mutationFn: async (formData) => {
       const response = await Api.put(`/CoursePayment/Accept`, formData);
       
       return response
    }
  })
}

export default AcceptPayment