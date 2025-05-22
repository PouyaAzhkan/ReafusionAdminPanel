import toast from "react-hot-toast";
import Api from "../../interceptor";

const AddAdminMessage = async (msg) => {
  try {
    const response = await toast.promise(
      Api.post(
        `https://682e27a1746f8ca4a47c199e.mockapi.io/AdminChat/AdminPanel`,
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

export default AddAdminMessage;
