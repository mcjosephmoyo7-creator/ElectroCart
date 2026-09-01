import axios from 'axios';

export const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const oauthUrls = {
  google: (redirect: string) =>
    `${API_BASE}/api/auth/google?redirect=${encodeURIComponent(redirect)}`,
  facebook: (redirect: string) =>
    `${API_BASE}/api/auth/facebook?redirect=${encodeURIComponent(redirect)}`,
};

const api = axios.create({
  baseURL: `${API_BASE}/api`,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const message = error.response?.data?.message || error.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

export default api;

export const authApi = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  register: (username: string, email: string, password: string) =>
    api.post('/auth/register', { username, email, password }),
  getMe: () => api.get('/auth/me'),
  logout: () => api.get('/auth/logout'),
  forgotPassword: (email: string) => api.post('/auth/forgot-password', { email }),
  changePassword: (currentPassword: string, newPassword: string) =>
    api.put('/auth/change-password', { currentPassword, newPassword }),
};

export const dashboardApi = {
  getStats: () => api.get('/users/dashboard/stats'),
  getRecentOrders: () => api.get('/users/dashboard/recent-orders'),
  getSalesChart: () => api.get('/users/dashboard/sales-chart'),
};

export const productApi = {
  getAll: (params?: Record<string, string | number>) =>
    api.get('/products', { params }),
  getAllAdmin: (params?: Record<string, string | number>) =>
    api.get('/admin/products', { params }),
  getById: (id: string) => api.get(`/products/${id}`),
  create: (formData: FormData) =>
    api.post('/products', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  update: (id: string, formData: FormData) =>
    api.put(`/products/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  delete: (id: string) => api.delete(`/products/${id}`),
  toggleFeatured: (id: string) => api.patch(`/products/${id}/featured`),
  updateStock: (id: string, stock: number) => api.put(`/admin/products/${id}/stock`, { stock }),
  toggleVisibility: (id: string) => api.put(`/admin/products/${id}/visibility`),
};

export const orderApi = {
  getAll: (params?: Record<string, string | number>) =>
    api.get('/orders', { params }),
  getById: (id: string) => api.get(`/orders/${id}`),
  getMyOrders: () => api.get('/orders/my'),
  updateStatus: (id: string, orderStatus: string) =>
    api.put(`/orders/${id}/status`, { orderStatus }),
  updatePayment: (id: string, paymentStatus: string) =>
    api.put(`/orders/${id}/payment`, { paymentStatus }),
};

export const customerApi = {
  getAll: (params?: Record<string, string | number>) =>
    api.get('/users', { params }),
  getById: (id: string) => api.get(`/users/${id}`),
  updateRole: (id: string, role: string) =>
    api.put(`/users/${id}/role`, { role }),
  toggleActive: (id: string) => api.put(`/users/${id}/active`),
};

export const categoryApi = {
  getAll: () => api.get('/categories'),
  getById: (id: string) => api.get(`/categories/${id}`),
  create: (data: { name: string; description?: string; image?: string; slug?: string }) =>
    api.post('/categories', data),
  update: (id: string, data: Record<string, unknown>) =>
    api.put(`/categories/${id}`, data),
  delete: (id: string) => api.delete(`/categories/${id}`),
};

export const reviewApi = {
  getProductReviews: (productId: string) =>
    api.get(`/reviews/product/${productId}`),
};

export const reportApi = {
  getSales: (params?: Record<string, string | number>) =>
    api.get('/admin/reports/sales', { params }),
  getProducts: (params?: Record<string, string | number>) =>
    api.get('/admin/reports/products', { params }),
  getCustomers: (params?: Record<string, string | number>) =>
    api.get('/admin/reports/customers', { params }),
};

export const campaignApi = {
  getAll: () => api.get('/campaigns'),
  create: (data: Record<string, unknown>) => api.post('/campaigns', data),
  update: (id: string, data: Record<string, unknown>) =>
    api.put(`/campaigns/${id}`, data),
  delete: (id: string) => api.delete(`/campaigns/${id}`),
};

export const shippingApi = {
  getAll: () => api.get('/shipping-methods'),
  create: (data: Record<string, unknown>) => api.post('/shipping-methods', data),
  update: (id: string, data: Record<string, unknown>) =>
    api.put(`/shipping-methods/${id}`, data),
  delete: (id: string) => api.delete(`/shipping-methods/${id}`),
};

export const notificationApi = {
  getAll: () => api.get('/notifications'),
  markRead: (id: string) => api.put(`/notifications/${id}/read`),
  markAllRead: () => api.put('/notifications/read-all'),
};

export const transactionApi = {
  getAll: (params?: Record<string, string | number>) =>
    api.get('/admin/transactions', { params }),
};

export const settingsApi = {
  get: () => api.get('/admin/settings'),
  update: (data: Record<string, unknown>) => api.put('/admin/settings', data),
};

// Relative-fetch helper for the self-contained storefront API routes (no backend required)
async function localFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  return res.json() as Promise<T>;
}

export const visitApi = {
  getStats: () => localFetch<{ success: boolean; data: VisitStats }>('/api/visits'),
};

export interface VisitStats {
  totalViews: number;
  totalVisitors: number;
  visitorsToday: number;
  todayViews: number;
  visitorsThisWeek: number;
  visitorsLast30Days: number;
  daily: { date: string; views: number }[];
}
