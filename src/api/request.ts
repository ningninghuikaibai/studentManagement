import axios from "axios";
import type { AxiosRequestConfig } from "axios";
const service = axios.create({
  baseURL: "/student/v3/prod-api",
  timeout: 10000,
});

// 请求拦截器
service.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 响应拦截器 
service.interceptors.response.use(
  (response) => {
    // 关键：直接返回后端真正的数据
    return response.data;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 关键：让 request 支持泛型返回
const request = <T = any>(config: AxiosRequestConfig): Promise<T> => {
  return service(config);
};

export default request;
