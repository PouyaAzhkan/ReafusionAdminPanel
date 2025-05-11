import toast from "react-hot-toast";
import Api from "../../../../@core/Services/interceptor";

const ActiveOrDeActive = async (data,refetch) => {
  try {
    const result = await toast.promise(
      Api.put("/Course/ActiveAndDeactiveCourse", data),
      {
        pending: "درحال ثبت شدن",
        success: "عملیات با موفقیت انجام شد",
        error: "لطفا دوباره تلاش کنید",
      }
    );
    if(result.success){
      refetch()
      console.log(result);
    }
  } catch (error) {
    console.log(error);
    return [];
  }
};

export default ActiveOrDeActive;