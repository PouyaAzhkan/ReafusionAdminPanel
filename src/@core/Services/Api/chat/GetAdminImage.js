// GetUserDetail.js
import axios from "axios";
import Api from "../../interceptor";
import { useQuery } from "@tanstack/react-query";

const GetUserImage = (id) => {
  return useQuery({
    queryKey: ['GetUserImage'],
    queryFn: async () => {
        const response = await Api.get(`User/UserDetails/${id}`);

        return response;
    }
  })
};

export default GetUserImage;
