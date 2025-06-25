import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ Request Interceptor: Attach access token unless it's login or register
axiosInstance.interceptors.request.use((config) => {
  const access = localStorage.getItem('access');
  const isPublicRoute = config.url.includes('login') || config.url.includes('register');

  if (access && !isPublicRoute) {
    config.headers.Authorization = `Bearer ${access}`;
  }

  return config;
}, (error) => Promise.reject(error));

// ✅ Response Interceptor: Auto-clear token on 401 or invalid token
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response &&
      error.response.status === 401 &&
      error.response.data?.code === 'token_not_valid'
    ) {
      localStorage.removeItem('access');
      localStorage.removeItem('refresh');
      window.location.href = '/login';  // ✅ Redirect user to login page
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
