import axios from 'axios';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
});

export interface PaginatedResponse<T> {
  content: T[];
  page?: {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
  };
  totalElements?: number;
  totalPages?: number;
  size?: number;
  number?: number;
}
