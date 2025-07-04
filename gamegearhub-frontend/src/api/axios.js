import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // e.g., https://gamegearhub.onrender.com/api
  withCredentials: false, // we use Authorization header, not cookies
});

// Request interceptor: Add token to headers unless it's a public route
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access');
    const isPublic = config.url.includes('/login') || config.url.includes('/register');

    if (token && !isPublic) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Optional global response error logging
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      console.error("🌐 Network error or server unreachable:", error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;