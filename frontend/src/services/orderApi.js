import axios from 'axios';

const API_URL =
  process.env.REACT_APP_API_URL ||
  (window.location.hostname === 'localhost' ? 'http://localhost:5001/api' : 'https://drawing-8587.onrender.com/api');

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

api.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ERR_NETWORK' || error.code === 'ECONNREFUSED') {
      return Promise.reject({
        message: 'Server connection offline. Local sync mode active.',
        code: 'NETWORK_ERROR',
      });
    }

    if (error.code === 'ECONNABORTED') {
      return Promise.reject({
        message: 'Request timeout. Please try again.',
        code: 'TIMEOUT',
      });
    }

    if (error.response) {
      const msg =
        error.response.data?.message ||
        `Server Error (${error.response.status})`;
      return Promise.reject({ message: msg, code: 'SERVER_ERROR', status: error.response.status });
    }

    return Promise.reject({ message: 'Unknown error occurred.', code: 'UNKNOWN' });
  }
);

const ORDERS_STORAGE_KEY = 'harsath_customer_orders_v2';
const FEEDBACKS_STORAGE_KEY = 'harsath_feedbacks_v2';

export const orderApi = {
  // Create new order
  createOrder: async (orderData) => {
    const localOrder = {
      ...orderData,
      id: `ord_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      orderNumber: `ORD-${new Date().getFullYear()}-${Date.now().toString().slice(-4)}`,
      orderDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      status: 'Pending'
    };

    // 1. Always save in local storage first so orders are never lost
    try {
      const existing = JSON.parse(localStorage.getItem(ORDERS_STORAGE_KEY) || '[]');
      existing.unshift(localOrder);
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(existing));
      window.dispatchEvent(new CustomEvent('harsath_orders_updated'));
    } catch (e) {
      console.warn('Local storage error:', e);
    }

    // 2. Try sending to backend
    try {
      const response = await api.post('/orders', orderData);
      return response.data;
    } catch (err) {
      console.log('Backend offline or slow; saved order locally:', err.message);
      return { success: true, local: true, data: localOrder };
    }
  },

  // Get all orders (Backend + Local sync)
  getOrders: async () => {
    let localList = [];
    try {
      localList = JSON.parse(localStorage.getItem(ORDERS_STORAGE_KEY) || '[]');
    } catch (e) {
      localList = [];
    }

    try {
      const response = await api.get('/orders', { timeout: 6000 });
      let backendList = [];
      if (Array.isArray(response.data)) {
        backendList = response.data;
      } else if (response.data?.orders && Array.isArray(response.data.orders)) {
        backendList = response.data.orders;
      }

      // Merge and deduplicate
      const map = new Map();
      localList.forEach(item => {
        const key = item._id || item.id || item.orderNumber;
        map.set(key, item);
      });
      backendList.forEach(item => {
        const key = item._id || item.id || item.orderNumber;
        // Keep updated status if available
        map.set(key, { ...item, status: item.status || 'Pending' });
      });

      const merged = Array.from(map.values()).sort(
        (a, b) => new Date(b.createdAt || b.orderDate || 0) - new Date(a.createdAt || a.orderDate || 0)
      );

      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(merged));
      return merged;
    } catch {
      return localList;
    }
  },

  // Update order status (Pending, In Progress, Completed, Delivered, Cancelled)
  updateOrderStatus: async (orderId, newStatus) => {
    try {
      const existing = JSON.parse(localStorage.getItem(ORDERS_STORAGE_KEY) || '[]');
      const updated = existing.map(o => {
        if (o._id === orderId || o.id === orderId || o.orderNumber === orderId) {
          return { ...o, status: newStatus };
        }
        return o;
      });
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('harsath_orders_updated'));
    } catch (e) {
      console.warn(e);
    }

    try {
      await api.put(`/orders/${orderId}`, { status: newStatus }, { timeout: 4000 });
    } catch {
      // Local status already updated
    }
    return true;
  },

  // Delete an order
  deleteOrder: async (orderId) => {
    try {
      const existing = JSON.parse(localStorage.getItem(ORDERS_STORAGE_KEY) || '[]');
      const filtered = existing.filter(o => o._id !== orderId && o.id !== orderId && o.orderNumber !== orderId);
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(filtered));
      window.dispatchEvent(new CustomEvent('harsath_orders_updated'));
    } catch (e) {
      console.warn(e);
    }

    try {
      await api.delete(`/orders/${orderId}`, { timeout: 4000 });
    } catch {
      // Local removal already done
    }
    return true;
  },

  // Upload reference image to Cloudinary via backend
  uploadImage: async (file) => {
    try {
      const formData = new FormData();
      formData.append('photo', file);

      const response = await api.post('/orders/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Cloudinary upload failed, using client image fallback:', error);
      // Client-side fallback to DataURL so user is never blocked
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve({
            success: true,
            data: { url: reader.result, filename: file.name }
          });
        };
        reader.readAsDataURL(file);
      });
    }
  },

  // Submit contact message
  submitFeedback: async (feedbackData) => {
    const localItem = {
      ...feedbackData,
      id: `fb_${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    try {
      const existing = JSON.parse(localStorage.getItem(FEEDBACKS_STORAGE_KEY) || '[]');
      existing.unshift(localItem);
      localStorage.setItem(FEEDBACKS_STORAGE_KEY, JSON.stringify(existing));
    } catch (e) {
      console.warn(e);
    }

    try {
      const response = await api.post('/feedback', feedbackData);
      return response.data;
    } catch {
      return { success: true, local: true, data: localItem };
    }
  },

  // Get all feedback messages
  getFeedbacks: async () => {
    let localList = [];
    try {
      localList = JSON.parse(localStorage.getItem(FEEDBACKS_STORAGE_KEY) || '[]');
    } catch {
      localList = [];
    }

    try {
      const res = await api.get('/feedback', { timeout: 5000 });
      if (Array.isArray(res.data)) {
        const map = new Map();
        localList.forEach(item => map.set(item._id || item.id, item));
        res.data.forEach(item => map.set(item._id || item.id, item));
        const merged = Array.from(map.values()).sort(
          (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
        );
        localStorage.setItem(FEEDBACKS_STORAGE_KEY, JSON.stringify(merged));
        return merged;
      }
    } catch {
      // return local
    }
    return localList;
  },

  deleteFeedback: async (id) => {
    try {
      const existing = JSON.parse(localStorage.getItem(FEEDBACKS_STORAGE_KEY) || '[]');
      const filtered = existing.filter(f => f._id !== id && f.id !== id);
      localStorage.setItem(FEEDBACKS_STORAGE_KEY, JSON.stringify(filtered));
    } catch (e) {
      console.warn(e);
    }
    return true;
  },

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
