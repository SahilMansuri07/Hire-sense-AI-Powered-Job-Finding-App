import axios from "axios";
import { decryptData, encryptData } from "./crypto";
import { authStorage } from "../utils/authStorage";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,

  headers: {
    "Content-Type": "application/json",
    "api-key": import.meta.env.VITE_API_KEY,
  },
});


api.interceptors.request.use((config) => {
  config.headers["api-key"] = import.meta.env.VITE_API_KEY;

  const session = authStorage.getSession();
  const token = session?.token;
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
      let data = error.response.data;
      if (typeof data === "string") {
        try {
          data = decryptData(data);
        } catch (e) {
          // ignore decryption errors in error handler
        }
      }
      
      const message = data?.message || data?.keyword || '';
      // Also check if the raw string happens to contain these if decryption fails
      const rawString = typeof error.response.data === 'string' ? error.response.data : '';
      
      const isTokenIssue = 
        message.toLowerCase().includes('token') || 
        message.toLowerCase().includes('unauthorized') ||
        rawString.toLowerCase().includes('token') ||
        !message; // If we can't parse it, default to logging out to be safe but usually we can
        
      if (isTokenIssue || message.toLowerCase().includes('expired')) {
        authStorage.clearSession();
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
 
export default api;
 
 