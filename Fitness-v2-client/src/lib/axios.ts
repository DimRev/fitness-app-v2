import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:1323/api/v1",
  withCredentials: true,
});

export default axiosInstance;
