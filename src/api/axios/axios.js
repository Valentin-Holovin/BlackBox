import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://api.blackboxcontrols.co.uk/v1/",
  timeout: 10000,
});

export default axiosInstance;
