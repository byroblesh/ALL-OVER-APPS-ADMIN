import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";

// Use environment variable for API URL
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - Add auth token and app ID to requests
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add auth token
    const token = window.localStorage.getItem("authToken");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add selected app ID
    const selectedAppId = window.localStorage.getItem("selectedAppId");
    if (selectedAppId && config.headers) {
      config.headers["X-App-Id"] = selectedAppId;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Token expired or invalid - logout user
      window.localStorage.removeItem("authToken");
      window.location.href = "/login";
    }
    return Promise.reject(error.response?.data || "Something went wrong");
  }
);

export default axiosInstance;
