// src/axiosConfig.js
import axios from 'axios';

// Create a custom Axios instance
const api = axios.create({
  baseURL: 'https://ukf-backend-lzgj.onrender.com',
  // headers: {
  //   'Content-Type': 'application/json',
  //   'Authorization': 'Bearer token',
  // },
  // timeout: 10000, // 10 seconds timeout
});

// Add a request interceptor
api.interceptors.request.use(
  config => {
    console.log('Request made with config:', config);
    const token = localStorage.getItem("token");

    if(token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
api.interceptors.response.use(
  response => {
    console.log('Response received:', response);
    return response;
  },
  error => {

    if (error.response && error.response.status === 401) {
      console.error('Unauthorized access - possibly invalid token');
    }

    return Promise.reject(error);
  }
);

export default api;