import axios from "axios";
import { authStorage } from "../utils/authStorage";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

let refreshRequest = null;

async function refreshAccessToken() {
  if (!refreshRequest) {
    refreshRequest = axios
      .post(`${import.meta.env.VITE_API_URL}/auth/refresh`, {}, { withCredentials: true })
      .then((res) => {
        const payload = res?.data;
        const token = payload?.data?.token;
        if (!token) {
          throw new Error("Refresh did not return access token");
        }
        authStorage.setAccessToken(token);

        const role = payload?.data?.role;
        const user = payload?.data?.user;
        if (role && user) {
          authStorage.setSession(role, token, { ...user, role });
        }

        return token;
      })
      .finally(() => {
        refreshRequest = null;
      });
  }

  return refreshRequest;
}

api.interceptors.request.use((config) => {
  const session = authStorage.getSession();
  const token = authStorage.getAccessToken() || session?.token;
 
  if (token) {
    config.headers.token = `${token}`;
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }
 
  return config;
});
 
api.interceptors.response.use(
  (response) => {
    const result = response.data;
    
    if (result && result.code !== undefined && result.code !== 1) {
      return Promise.reject(result);
    }
 
    return result;
  },
 
  async (error) => {
    const originalRequest = error.config || {};
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newToken = await refreshAccessToken();
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        originalRequest.headers.token = newToken;
        return api(originalRequest);
      } catch (refreshError) {
        authStorage.clearSession();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
 
export default api;
 
 