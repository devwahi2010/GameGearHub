import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // Set in .env file
  withCredentials: false, // no cookies used for JWT, only Authorization header
});

// Attach access token if available (except on login/register routes)
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('access');
    const isPublicRoute = config.url.includes('login') || config.url.includes('register');

    if (accessToken && !isPublicRoute) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Handle errors globally if needed
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Optional: log network/server errors
    if (!error.response) {
      console.error("🌐 Network error or server unreachable", error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
