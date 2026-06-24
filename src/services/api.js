import axios from 'axios';

// Base URL from Vite environment variable.
const BASE_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_BACKEND_URL || 'http://localhost:90';

// Create a pre-configured axios instance
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Generic axios wrapper that maintains the same apiFetch signature
 * to avoid breaking any other file that imports it.
 */
export async function apiFetch(endpoint, options = {}, needHeader = true) {
  try {
    const config = {
      url: endpoint,
      method: options.method || 'GET',
      data: options.body ? (typeof options.body === 'string' ? JSON.parse(options.body) : options.body) : undefined,
      ...options,
    };

    if (!needHeader) {
      delete config.headers;
    }

    const response = await api(config);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || 'API Error';
    throw new Error(errorMessage);
  }
}

export default api;
