import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// Environment configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.glynac.ai';
const API_VERSION = process.env.NEXT_PUBLIC_API_VERSION || 'v2';
const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

// Create axios instance
export const apiClient: AxiosInstance = axios.create({
  baseURL: `${API_BASE_URL}/${API_VERSION}`,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth token
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// API endpoints configuration
export const API_ENDPOINTS = {
  // Auth endpoints
  auth: {
    login: '/auth/login/',
    logout: '/auth/logout/',
    refresh: '/auth/refresh/',
    passwordReset: '/auth/password-reset/',
    emailVerify: (token: string) => `/auth/email-verify/${token}/`,
    me: '/auth/me/',
    sessions: '/auth/sessions/',
  },
  // Connection endpoints
  connections: {
    list: '/connections/',
    create: '/connections/',
    detail: (id: string) => `/connections/${id}/`,
    updateSettings: (id: string) => `/connections/${id}/settings/`,
    sync: (id: string) => `/connections/${id}/sync/`,
    history: (id: string) => `/connections/${id}/history/`,
  },
  // Organization endpoints
  org: {
    accounts: '/org/accounts/',
    users: '/org/users/',
    organizations: '/org/organizations/',
    datasources: '/org/datasources/',
    datasourceConnect: (id: string) => `/org/datasources/${id}/connect/`,
    extractions: '/org/extractions/',
    extractionStart: '/org/extractions/start/',
    extractionStatus: (id: string) => `/org/extractions/${id}/status/`,
  },
} as const;

// Generic API methods
export const api = {
  get: <T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> =>
    apiClient.get(url, config),
  
  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> =>
    apiClient.post(url, data, config),
  
  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> =>
    apiClient.put(url, data, config),
  
  delete: <T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> =>
    apiClient.delete(url, config),
  
  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> =>
    apiClient.patch(url, data, config),
};

// Export configuration
export { API_BASE_URL, API_VERSION, USE_MOCK_DATA };

