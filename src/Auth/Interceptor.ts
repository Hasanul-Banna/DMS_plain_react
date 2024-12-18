import axios, { AxiosInstance as AxiosInstanceType } from 'axios';
import Cookies from 'js-cookie';
// Axios Interceptor Instance
export const AxiosInstance: AxiosInstanceType = axios.create({
  // baseURL: process.env.BASE_URL
});

AxiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get('auth_token'); // Get the token from cookies
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Axios Interceptor: Response Method
AxiosInstance.interceptors.response.use(
  (response) => {
    // Can be modified response
    return response;
  },
  (error) => {
    // Handle response errors here
    return Promise.reject(error);
  }
);
