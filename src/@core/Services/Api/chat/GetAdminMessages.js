// GetAdminMessages.js
import Api from "../../interceptor";

const GetAdminMessages = async (userId) => {
  try {
    const response = await Api.get(
      `https://682e27a1746f8ca4a47c199e.mockapi.io/AdminChat/AdminPanel?userId=${userId}`
    );
    return response.data;
  } catch (error) {
    console.log("Error fetching admin messages:", error);
    return [];
  }
};

export default GetAdminMessages;