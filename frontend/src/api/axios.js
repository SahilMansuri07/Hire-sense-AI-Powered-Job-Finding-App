import axios from "axios";
import { decryptData, encryptData } from "./crypto";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,

  headers: {
    "Content-Type": "application/json",
    "api-key": import.meta.env.VITE_API_KEY,
  },
});


api.interceptors.request.use((config) => {
  config.headers["api-key"] = import.meta.env.VITE_API_KEY;

  const token = localStorage.getItem("token");
  // console.log(token)
 
  if (token) {
    config.headers.token = `${token}`;
    config.headers.Authorization = `Bearer ${token}`;
  }
 
  if (config.data) {
    if (config.data instanceof FormData) {
      // Do not encrypt FormData and let the browser set the Content-Type with boundary
      delete config.headers['Content-Type'];
    } else {
      config.data = encryptData(config.data);
    }
  }
 
  return config;
});
 
// response decrypt
api.interceptors.response.use(
  (response) => {
    let result = response.data;
 
    if (typeof result === "string") {
      result = decryptData(result);
    }
    
    // Globally handle error code
    if (result && result.code !== undefined && result.code !== 1) {
      return Promise.reject(result);
    }
 
    return result;
  },
 
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
 
export default api;
 
 