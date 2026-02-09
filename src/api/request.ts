import axios from "axios";

const request = axios.create({
  baseURL: "/student/v3/prod-api",
});

// 请求拦截器(以后放token用)
request.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // console.log("请求头Authorization:", config.headers.Authorization);
  return config;
});
export default request;
