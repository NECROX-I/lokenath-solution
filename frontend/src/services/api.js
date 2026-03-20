import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' }
})

// Attach admin JWT token if present
api.interceptors.request.use(config => {
  const stored = localStorage.getItem('loknath-auth')
  if (stored) {
    try {
      const { state } = JSON.parse(stored)
      if (state?.token) config.headers.Authorization = `Bearer ${state.token}`
    } catch (_) {}
  }
  return config
})

// Handle 401 globally
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('loknath-auth')
      if (window.location.pathname.startsWith('/admin')) {
        window.location.href = '/admin/login'
      }
    }
    return Promise.reject(err)
  }
)

// ─── Products ─────────────────────────────────────────────────
export const productAPI = {
  getAll:       (params) => api.get('/products', { params }),
  getOne:       (id)     => api.get(`/products/${id}`),
  getCategories:()       => api.get('/products/categories'),
  create:       (data)   => api.post('/products', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update:       (id, data) => api.put(`/products/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete:       (id)     => api.delete(`/products/${id}`)
}

// ─── Orders ───────────────────────────────────────────────────
export const orderAPI = {
  place:        (data)     => api.post('/orders', data),
  trackByPhone: (params)   => api.get('/orders/track', { params }),
  cancelOrder:  (id, data) => api.put(`/orders/${id}/cancel`, data),
  getAll:       (params)   => api.get('/orders', { params }),
  getOne:       (id)       => api.get(`/orders/${id}`),
  updateStatus: (id, data) => api.put(`/orders/${id}/status`, data),
  deleteOrder:  (id)       => api.delete(`/orders/${id}`)
}

// ─── Services ─────────────────────────────────────────────────
export const serviceAPI = {
  getAll: () => api.get('/services'),
  getOne: (id) => api.get(`/services/${id}`)
}

// ─── Service Requests ─────────────────────────────────────────
export const serviceRequestAPI = {
  submit:        (data)     => api.post('/service-requests', data),
  trackByPhone:  (params)   => api.get('/service-requests/track', { params }),
  cancelRequest: (id, data) => api.put(`/service-requests/${id}/cancel`, data),
  getAll:        (params)   => api.get('/service-requests', { params }),
  getOne:        (id)       => api.get(`/service-requests/${id}`),
  update:        (id, data) => api.put(`/service-requests/${id}`, data),
  deleteRequest: (id)       => api.delete(`/service-requests/${id}`)
}

// ─── Contact ──────────────────────────────────────────────────
export const contactAPI = {
  submit:   (data) => api.post('/contact', data),
  getAll:   (params) => api.get('/contact', { params }),
  markRead: (id)   => api.put(`/contact/${id}/read`),
  delete:   (id)   => api.delete(`/contact/${id}`)
}

// ─── Admin Auth ───────────────────────────────────────────────
export const authAPI = {
  login:          (data) => api.post('/auth/login', data),
  me:             ()     => api.get('/auth/me'),
  changePassword: (data) => api.put('/auth/change-password', data)
}

// ─── Admin Stats ──────────────────────────────────────────────
export const adminAPI = {
  stats: () => api.get('/admin/stats')
}

export default api