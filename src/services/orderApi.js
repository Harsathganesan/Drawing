import axios from 'axios';

// Base URL for your backend API
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

// Create axios instance with timeout
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// ─── Request Interceptor ───────────────────────────────────────────────────
api.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

// ─── Response Interceptor — centralised error handler ────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ERR_NETWORK' || error.code === 'ECONNREFUSED') {
      return Promise.reject({
        message: 'Server-உடன் connection இல்லை. Backend running-ஆ என்று check செய்யுங்கள்.',
        code: 'NETWORK_ERROR',
      });
    }

    if (error.code === 'ECONNABORTED') {
      return Promise.reject({
        message: 'Request timeout ஆனது. மீண்டும் try செய்யுங்கள்.',
        code: 'TIMEOUT',
      });
    }

    if (error.response) {
      // Server responded with error status
      const msg =
        error.response.data?.message ||
        `Server Error (${error.response.status})`;
      return Promise.reject({ message: msg, code: 'SERVER_ERROR', status: error.response.status });
    }

    return Promise.reject({ message: 'Unknown error occurred.', code: 'UNKNOWN' });
  }
);

// ─── Helper: retry once on network failure ────────────────────────────────
const withRetry = async (fn, retries = 1) => {
  try {
    return await fn();
  } catch (err) {
    if (retries > 0 && (err.code === 'NETWORK_ERROR' || err.code === 'TIMEOUT')) {
      await new Promise((res) => setTimeout(res, 1500)); // wait 1.5s
      return withRetry(fn, retries - 1);
    }
    throw err;
  }
};

// ─── API Functions ────────────────────────────────────────────────────────
export const orderApi = {

  // Create new order
  createOrder: async (orderData) => {
    return withRetry(async () => {
      const response = await api.post('/orders', orderData);
      return response.data;
    });
  },

  // Upload reference image
  uploadImage: async (file) => {
    try {
      const formData = new FormData();
      formData.append('image', file);
      const response = await axios.post(`${API_URL}/orders/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 30000, // 30s for file upload
      });
      return response.data;
    } catch (error) {
      console.warn('Image upload failed, using local preview:', error);
      // Graceful fallback — use local object URL
      return { data: { url: URL.createObjectURL(file) } };
    }
  },

  // Submit contact/feedback form
  submitFeedback: async (feedbackData) => {
    return withRetry(async () => {
      const response = await api.post('/feedback', feedbackData);
      return response.data;
    });
  },

  // Health check — to test if backend is reachable
  healthCheck: async () => {
    try {
      const response = await axios.get(API_URL.replace('/api', ''), { timeout: 5000 });
      return response.status === 200;
    } catch {
      return false;
    }
  },
};

export default orderApi;