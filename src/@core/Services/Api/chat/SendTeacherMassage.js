import toast from "react-hot-toast";
import Api from "../../interceptor";

const AddTeacherMessage = async (msg) => {
  try {
    const response = await toast.promise(
      Api.post(
        `https://682f175b746f8ca4a47fcad8.mockapi.io/TeacherChat/teacherChat`,
        msg
      ),
      {
        error: "پیام شما ارسال نشد",
        loading: "در حال ارسال پیام...",
        success: "پیام شما با موفقیت ارسال شد",
      }
    );
    if (response) {
      return true;
    }
  } catch (error) {
    console.log(error);
  }
};

export default AddTeacherMessage;
