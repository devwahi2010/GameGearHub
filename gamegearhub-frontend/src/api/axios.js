import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

axiosInstance.interceptors.request.use((config) => {
  const access = localStorage.getItem('access');
  const isPublic = config.url.includes('login') || config.url.includes('register');

  if (access && !isPublic) {
    config.headers.Authorization = `Bearer ${access}`;
  }

  return config;
}, (error) => Promise.reject(error));

export default axiosInstance;
