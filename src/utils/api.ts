import axios, { AxiosResponse, AxiosError } from 'axios';
import { ApiError } from '../types';

/**
 * Axios configuration and API utilities
 */

// Create axios instance with base configuration
export const api = axios.create({
  baseURL: import.meta.env.VITE_REACT_APP_API_BASE_URL,
  // baseURL: 'https://news-chatbot-backend-l80s.onrender.com/',
  timeout: 300000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth tokens, logging, etc.
api.interceptors.request.use(
  (config) => {
    // Add request logging in development
    if (import.meta.env.DEV) {
      console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling errors globally
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    const apiError: ApiError = {
      message: 'An unexpected error occurred',
      status: error.response?.status,
      details: error.response?.data,
    };

    // Handle specific error types
    if (error.code === 'ECONNABORTED') {
      apiError.message = 'Request timeout. Please try again.';
    } else if (error.response?.status === 404) {
      apiError.message = 'Service not found. Please check your connection.';
    } else if (error.response?.status === 500) {
      apiError.message = 'Server error. Please try again later.';
    } else if ((error.response?.data as any)?.message) {
      apiError.message = (error.response?.data as any).message;
    } else if (error.message) {
      apiError.message = error.message;
    }

    return Promise.reject(apiError);
  }
);

/**
 * Utility function to handle API calls with consistent error handling
 */
export const handleApiCall = async <T>(
  apiCall: () => Promise<AxiosResponse<T>>
): Promise<T> => {
  try {
    const response = await apiCall();
    return response.data;
  } catch (error) {
    throw error;
  }
};