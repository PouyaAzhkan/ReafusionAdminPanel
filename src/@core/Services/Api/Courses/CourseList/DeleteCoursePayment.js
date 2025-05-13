import { useMutation } from "@tanstack/react-query";
import Api from "../../../../../@core/Services/interceptor";

const useDeleteCoursePayment = (paymentId, refetch) => {
  return useMutation({
    mutationKey: ["DeleteCoursePayment", paymentId],
    mutationFn: async () => {
      const formData = new FormData();
      formData.append("PaymentId", paymentId);
      const response = await Api.delete(`/CoursePayment`, {
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response;
    },
    onSuccess: () => {
      refetch?.();
      alert("پرداختی دوره با موفقیت حذف شد");
    },
    onError: (error) => {
      console.error("Delete Payment Error:", error.response?.data || error.message);
      alert(`خطا در حذف پرداخت: ${error.response?.data?.ErrorMessage || error.message}`);
    },
  });
};

export default useDeleteCoursePayment;