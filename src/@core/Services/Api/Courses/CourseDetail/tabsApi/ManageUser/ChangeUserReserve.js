import { useMutation } from "@tanstack/react-query";
import Api from "../../../../../../../@core/Services/interceptor";

const ChangeUserReserve = () => {
  return useMutation({
     mutationKey: ["ChangeUserReserve"],
     mutationFn: async (data) => {
       const response = await Api.post(`/CourseReserve/SendReserveToCourse`, data);

       return response
     }
  })
}

export default ChangeUserReserve
