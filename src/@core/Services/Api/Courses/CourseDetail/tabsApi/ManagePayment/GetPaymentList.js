import { useQuery } from "@tanstack/react-query";
import Api from "../../../../../../../@core/Services/interceptor";

const GetPaymentList = (id) => {
  return useQuery({
    queryKey: ["GetPaymentList"],
    queryFn: async () => {
      const response = await Api.get(
        `/CoursePayment/ListOfWhoIsPay?CourseId=${id}`
      );
      return response;
    },
    enabled: !!id, // ✅ فقط وقتی id موجوده
  });
};

export default GetPaymentList;
