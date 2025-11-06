import axios from 'axios';

// Auto-detect API URL: use VITE_API_URL if set, otherwise use same origin in production, localhost in dev
function getApiBaseURL() {
  const envUrl = import.meta.env?.VITE_API_URL;
  if (envUrl) {
    // Ensure it ends with /api if not already
    return envUrl.endsWith('/api') ? envUrl : `${envUrl}/api`;
  }
  
  // In production (HTTPS), use same origin
  if (typeof window !== 'undefined' && window.location.protocol === 'https:') {
    return `${window.location.origin}/api`;
  }
  
  // Development fallback
  return 'http://localhost:3001/api';
}

export const api = axios.create({
    baseURL: getApiBaseURL(),
    timeout: 10000,
});
// Request interceptor
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});
// Response interceptor
api.interceptors.response.use((response) => response, (error) => {
    if (error.response?.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
    }
    return Promise.reject(error);
});
