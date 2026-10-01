import axios from 'axios';

const baseURL = import.meta.env.PROD
  ? '/api'
  : (import.meta.env.VITE_API_URL || '/api');

const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('dekave_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('dekave_token');
      localStorage.removeItem('dekave_user');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

export default api;
