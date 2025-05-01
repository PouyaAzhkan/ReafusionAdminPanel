import axios from "axios";
import { getItem } from "../../../@core/Services/common/storage.services";


const Base_URL = import.meta.env.VITE_REACT_APP;

const Api = axios.create({
  baseURL: Base_URL,
});

// Request Interceptor
Api.interceptors.request.use(
  (config) => {
    const token = getItem("token");
    const id = getItem("userid");

    config.headers.Authorization = `Bearer ${token}`;
    if (id) {
      config.headers["User-Id"] = id;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
Api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.log(error);
    return Promise.reject(error);
  }
);

export default Api;