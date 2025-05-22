import { useQuery } from "@tanstack/react-query";
import Api from "../../interceptor/index";
import axios from "axios";

const GetAdminUserChat = () => {
  return useQuery({
    queryKey: ['GetAdminUserChat'],
    queryFn: async () => {
      const response = await Api.get(`https://682e27a1746f8ca4a47c199e.mockapi.io/AdminChat/AdminPanel`);
      return response;
    }
  });
};

export default GetAdminUserChat;