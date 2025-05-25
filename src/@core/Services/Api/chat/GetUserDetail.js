// GetUserDetail.js
import axios from "axios";
import Api from "../../interceptor";

const GetUserDetail = async (id) => {
  const response = await  Api.get(`User/UserDetails/${id}`);
  return response;
};

export default GetUserDetail;
