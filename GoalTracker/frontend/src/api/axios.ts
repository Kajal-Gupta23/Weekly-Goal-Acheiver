// src/api/axios.ts

import axios from 'axios';
// import { getAccessToken, getRefreshToken, setTokens, clearTokens } from '../utils/auth';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL, // Replace with your backend's base URL
  // baseURL:'http://127.0.0.1:8000/',
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ Attach JWT token to every request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
