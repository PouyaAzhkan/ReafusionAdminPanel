import { useMutation } from "@tanstack/react-query";
import Api from "../../../../../@core/Services/interceptor";
import toast from "react-hot-toast";

const useAcceptCoursePayment = (paymentId, refetch) => {
  return useMutation({
    mutationKey: ["AcceptCoursePayment", paymentId],
    mutationFn: async () => {
      const formData = new FormData();
      formData.append("PaymentId", paymentId);
      const response = await Api.put(`/CoursePayment/Accept`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response;
    },
    onSuccess: () => {
      refetch?.();
      toast.success("پرداختی مورد نظر تایید شد");
    },
    onError: (error) => {
      console.error("Accept Payment Error:", error.response || error.message);
      toast.error(`خطا در تایید پرداخت: ${error.response?.ErrorMessage || error.message}`);
    },
  });
};

export default useAcceptCoursePayment;