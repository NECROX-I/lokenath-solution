import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useThemeStore, useAuthStore } from './store'

import PublicLayout from './components/layouts/PublicLayout'
import AdminLayout from './components/layouts/AdminLayout'

import Home          from './pages/Home'
import Products      from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Services      from './pages/Services'
import ServiceDetail from './pages/ServiceDetail'
import Contact       from './pages/Contact'
import CartPage      from './pages/CartPage'
import Checkout      from './pages/Checkout'
import OrderSuccess  from './pages/OrderSuccess'
import TrackOrder    from './pages/TrackOrder'

import AdminLogin           from './pages/admin/AdminLogin'
import AdminDashboard       from './pages/admin/AdminDashboard'
import AdminProducts        from './pages/admin/AdminProducts'
import AdminOrders          from './pages/admin/AdminOrders'
import AdminServiceRequests from './pages/admin/AdminServiceRequests'
import AdminMessages        from './pages/admin/AdminMessages'

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="w-10 h-10 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

function ProtectedRoute({ children }) {
  const { isAuthenticated, _hasHydrated } = useAuthStore()
  if (!_hasHydrated) return <LoadingScreen />
  if (!isAuthenticated) return <Navigate to="/admin/login" replace />
  return children
}

function GuestRoute({ children }) {
  const { isAuthenticated, _hasHydrated } = useAuthStore()
  if (!_hasHydrated) return <LoadingScreen />
  if (isAuthenticated) return <Navigate to="/admin/dashboard" replace />
  return children
}

export default function App() {
  const { init } = useThemeStore()
  useEffect(() => { init() }, [])

  return (
    <Routes>
      {/* Public */}
      <Route element={<PublicLayout />}>
        <Route path="/"            element={<Home />} />
        <Route path="/products"    element={<Products />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/services"    element={<Services />} />
        <Route path="/services/:id" element={<ServiceDetail />} />
        <Route path="/contact"     element={<Contact />} />
        <Route path="/cart"        element={<CartPage />} />
        <Route path="/checkout"    element={<Checkout />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/track"       element={<TrackOrder />} />
      </Route>

      {/* Admin */}
      <Route path="/admin/login" element={<GuestRoute><AdminLogin /></GuestRoute>} />
      <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard"        element={<AdminDashboard />} />
        <Route path="products"         element={<AdminProducts />} />
        <Route path="orders"           element={<AdminOrders />} />
        <Route path="service-requests" element={<AdminServiceRequests />} />
        <Route path="messages"         element={<AdminMessages />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}