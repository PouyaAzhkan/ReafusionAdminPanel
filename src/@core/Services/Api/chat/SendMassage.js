import axios from "axios";

const BASE_URL = "https://682e27a1746f8ca4a47c199e.mockapi.io/AdminChat/AdminPanel";

const AddAdminMessage = async ({ id, chatRoom }) => {
  try {
    // تلاش برای به‌روزرسانی چت روم (PUT request)
    const response = await axios.put(`${BASE_URL}/${id}`, { id, chatRoom });
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      // اگر چت روم وجود ندارد، آن را با POST ایجاد می‌کنیم
      const response = await axios.post(BASE_URL, { id, chatRoom });
      return response.data;
    }
    throw error; // پرتاب سایر خطاها
  }
};

export default AddAdminMessage;