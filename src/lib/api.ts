import axios, { AxiosInstance } from 'axios';
import { LoginCredentials, RegisterData, AuthResponse, User } from '@/types/auth';
import { Policy, PolicyFormData, PolicyListResponse } from '@/types/policy';
import { ApiResponse } from '@/types/api';

const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post('/login', credentials);
    return response.data;
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post('/register', data);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.post('/logout');
  },

  getUser: async (): Promise<User> => {
    const response = await api.get('/user');
    return response.data;
  },
};

export const policyApi = {
  getAll: async (params?: Record<string, any>): Promise<PolicyListResponse> => {
    const response = await api.get('/policies', { params });
    return response.data;
  },

  getOne: async (id: number): Promise<ApiResponse<Policy>> => {
    const response = await api.get(`/policies/${id}`);
    return response.data;
  },

  create: async (data: PolicyFormData): Promise<ApiResponse<Policy>> => {
    const response = await api.post('/policies', data);
    return response.data;
  },

  update: async (id: number, data: Partial<PolicyFormData>): Promise<ApiResponse<Policy>> => {
    const response = await api.put(`/policies/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/policies/${id}`);
  },

  generatePdf: async (id: number): Promise<{ download_url: string; message: string }> => {
    const response = await api.post(`/policies/${id}/pdf`);
    return response.data;
  },
};

export default api;