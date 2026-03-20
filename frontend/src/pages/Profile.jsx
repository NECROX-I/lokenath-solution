import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { customerAPI } from '../services/api'
import { useCustomerStore } from '../store'
import toast from 'react-hot-toast'
import {
  MdPerson, MdEdit, MdSave, MdLogout, MdShoppingBag,
  MdMiscellaneousServices, MdPhone, MdEmail, MdLocationOn,
  MdCheckCircle, MdCancel, MdArrowForward
} from 'react-icons/md'

const ORDER_STATUS_STYLE = {
  pending:    { label: 'Pending',       cls: 'badge-yellow' },
  confirmed:  { label: 'Confirmed',     cls: 'badge-blue'   },
  processing: { label: 'Preparing',     cls: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 badge' },
  ready:      { label: 'Ready',         cls: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400 badge' },
  delivered:  { label: 'Delivered',     cls: 'badge-green'  },
  cancelled:  { label: 'Cancelled',     cls: 'badge-red'    },
}

const SERVICE_STATUS_STYLE = {
  new:          { label: 'New',         cls: 'badge-blue'   },
  'in-progress':{ label: 'In Progress', cls: 'badge-yellow' },
  completed:    { label: 'Completed',   cls: 'badge-green'  },
  cancelled:    { label: 'Cancelled',   cls: 'badge-red'    },
}

const SERVICE_LABELS = {
  'tax-payment': '🧾 Tax Payment', 'money-transfer': '💸 Money Transfer',
  'government-schemes': '🏛️ Govt Schemes', 'aadhaar-services': '🪪 Aadhaar',
  'voter-id': '🗳️ Voter ID', 'ration-card': '🍚 Ration Card',
  'form-filling': '📝 Form Filling', 'other': '📋 Other',
}

export default function Profile() {
  const navigate = useNavigate()
  const { customer, customerLogout, updateCustomer } = useCustomerStore()

  const [tab, setTab] = useState('orders')
  const [orders, setOrders] = useState([])
  const [requests, setRequests] = useState([])
  const [loadingOrders, setLoadingOrders] = useState(true)
  const [loadingRequests, setLoadingRequests] = useState(true)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '', address: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!customer) { navigate('/login'); return }
    setForm({ name: customer.name || '', phone: customer.phone || '', address: customer.address || '' })

    customerAPI.getMyOrders()
      .then(r => setOrders(r.data.orders))
      .catch(() => {})
      .finally(() => setLoadingOrders(false))

    customerAPI.getMyServiceRequests()
      .then(r => setRequests(r.data.requests))
      .catch(() => {})
      .finally(() => setLoadingRequests(false))
  }, [customer])

  const handleLogout = () => {
    customerLogout()
    toast.success('Logged out successfully')
    navigate('/')
  }

  const handleSaveProfile = async () => {
    setSaving(true)
    try {
      const { data } = await customerAPI.updateProfile(form)
      updateCustomer(data.customer)
      setEditing(false)
      toast.success('Profile updated!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  if (!customer) return null

  return (
    <>
      <Helmet>
        <title>My Profile — Loknath Solution</title>
      </Helmet>

      <div className="bg-gradient-to-r from-slate-800 to-slate-900 py-10">
        <div className="page-container">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-ocean-500 flex items-center justify-center text-white text-2xl font-bold shadow-brand">
              {customer.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold text-white">{customer.name}</h1>
              <p className="text-slate-400 text-sm">{customer.email}</p>
              <p className="text-slate-500 text-xs mt-0.5">
                Member since {new Date(customer.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
              </p>
            </div>
            <button onClick={handleLogout}
              className="ml-auto flex items-center gap-2 text-slate-400 hover:text-red-400 transition-colors text-sm font-medium">
              <MdLogout /> Logout
            </button>
          </div>
        </div>
      </div>

      <div className="page-container py-8">
        <div className="grid lg:grid-cols-3 gap-8">

          {/* ── Left: Profile Card ── */}
          <div className="space-y-4">
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display font-bold text-slate-900 dark:text-white">Profile Details</h2>
                {!editing
                  ? <button onClick={() => setEditing(true)}
                      className="btn-ghost text-xs px-3 py-1.5">
                      <MdEdit /> Edit
                    </button>
                  : <div className="flex gap-2">
                      <button onClick={() => { setEditing(false); setForm({ name: customer.name, phone: customer.phone || '', address: customer.address || '' }) }}
                        className="text-xs text-slate-500 hover:text-slate-700 px-2">Cancel</button>
                      <button onClick={handleSaveProfile} disabled={saving}
                        className="btn-primary text-xs px-3 py-1.5">
                        {saving ? 'Saving...' : <><MdSave /> Save</>}
                      </button>
                    </div>
                }
              </div>

              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-xs text-slate-400 mb-1 flex items-center gap-1">
                    <MdPerson className="text-sm" /> Full Name
                  </label>
                  {editing
                    ? <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="input-field text-sm" />
                    : <p className="text-sm font-medium text-slate-900 dark:text-white">{customer.name}</p>
                  }
                </div>

                {/* Email (read-only) */}
                <div>
                  <label className="block text-xs text-slate-400 mb-1 flex items-center gap-1">
                    <MdEmail className="text-sm" /> Email
                  </label>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{customer.email}</p>
                  <p className="text-xs text-slate-400">Email cannot be changed</p>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs text-slate-400 mb-1 flex items-center gap-1">
                    <MdPhone className="text-sm" /> Phone Number
                  </label>
                  {editing
                    ? <input type="tel" value={form.phone} maxLength={10}
                        onChange={e => setForm(f => ({ ...f, phone: e.target.value.replace(/\D/g, '') }))}
                        placeholder="10-digit number"
                        className="input-field text-sm" />
                    : <p className="text-sm font-medium text-slate-900 dark:text-white">
                        {customer.phone || <span className="text-slate-400 italic">Not added</span>}
                      </p>
                  }
                </div>

                {/* Address */}
                <div>
                  <label className="block text-xs text-slate-400 mb-1 flex items-center gap-1">
                    <MdLocationOn className="text-sm" /> Delivery Address
                  </label>
                  {editing
                    ? <textarea rows={3} value={form.address}
                        onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                        placeholder="Your full address"
                        className="input-field text-sm resize-none" />
                    : <p className="text-sm text-slate-600 dark:text-slate-400">
                        {customer.address || <span className="italic">Not added</span>}
                      </p>
                  }
                </div>
              </div>
            </div>

            {/* Quick links */}
            <div className="card p-4 space-y-1">
              <Link to="/track" className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all text-sm text-slate-700 dark:text-slate-300 font-medium">
                <span className="flex items-center gap-2"><MdShoppingBag className="text-brand-500" /> Track an Order</span>
                <MdArrowForward className="text-slate-400" />
              </Link>
              <Link to="/services" className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all text-sm text-slate-700 dark:text-slate-300 font-medium">
                <span className="flex items-center gap-2"><MdMiscellaneousServices className="text-ocean-500" /> Request a Service</span>
                <MdArrowForward className="text-slate-400" />
              </Link>
              <Link to="/products" className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all text-sm text-slate-700 dark:text-slate-300 font-medium">
                <span className="flex items-center gap-2">🛍️ Shop Products</span>
                <MdArrowForward className="text-slate-400" />
              </Link>
            </div>
          </div>

          {/* ── Right: Orders + Service Requests ── */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="flex gap-2 mb-5 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl">
              <button onClick={() => setTab('orders')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  tab === 'orders'
                    ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-400 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}>
                <MdShoppingBag /> Orders
                {orders.length > 0 && (
                  <span className="bg-brand-600 text-white text-xs rounded-full px-2 py-0.5">{orders.length}</span>
                )}
              </button>
              <button onClick={() => setTab('services')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  tab === 'services'
                    ? 'bg-white dark:bg-slate-700 text-ocean-600 dark:text-ocean-400 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}>
                <MdMiscellaneousServices /> Service Requests
                {requests.length > 0 && (
                  <span className="bg-ocean-600 text-white text-xs rounded-full px-2 py-0.5">{requests.length}</span>
                )}
              </button>
            </div>

            {/* Orders tab */}
            {tab === 'orders' && (
              <div className="space-y-4">
                {loadingOrders ? (
                  Array(3).fill(0).map((_, i) => (
                    <div key={i} className="card p-5 space-y-3">
                      <div className="skeleton h-4 rounded-lg w-1/3" />
                      <div className="skeleton h-3 rounded-lg w-2/3" />
                      <div className="skeleton h-10 rounded-xl" />
                    </div>
                  ))
                ) : orders.length === 0 ? (
                  <div className="card p-12 text-center">
                    <MdShoppingBag className="text-5xl text-slate-200 dark:text-slate-700 mx-auto mb-3" />
                    <p className="font-display font-bold text-slate-800 dark:text-white mb-1">No orders yet</p>
                    <p className="text-sm text-slate-400 mb-4">Your order history will appear here.</p>
                    <Link to="/products" className="btn-primary">Start Shopping</Link>
                  </div>
                ) : (
                  orders.map(order => {
                    const st = ORDER_STATUS_STYLE[order.status] || ORDER_STATUS_STYLE.pending
                    return (
                      <motion.div key={order._id}
                        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                        className="card p-5"
                      >
                        <div className="flex items-start justify-between mb-3 flex-wrap gap-2">
                          <div>
                            <p className="font-mono text-xs text-slate-400">#{order._id.toString().slice(-8).toUpperCase()}</p>
                            <p className="text-xs text-slate-400 mt-0.5">
                              {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`${st.cls} text-xs capitalize`}>{st.label}</span>
                            <span className="font-bold text-brand-600 dark:text-brand-400">
                              ₹{order.totalAmount?.toLocaleString('en-IN')}
                            </span>
                          </div>
                        </div>

                        {/* Items preview */}
                        <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
                          {order.items?.map((item, i) => (
                            <div key={i} className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 rounded-lg px-3 py-2 flex-shrink-0 text-xs">
                              <img src={item.image} alt={item.name}
                                className="w-7 h-7 rounded-md object-cover bg-slate-100"
                                onError={e => e.target.src = 'https://placehold.co/28x28'} />
                              <span className="text-slate-700 dark:text-slate-300 max-w-[100px] truncate">{item.name}</span>
                              <span className="text-slate-400">×{item.quantity}</span>
                            </div>
                          ))}
                        </div>

                        {order.adminNotes && (
                          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg px-3 py-2 mb-3">
                            <p className="text-xs text-blue-700 dark:text-blue-400">📌 {order.adminNotes}</p>
                          </div>
                        )}

                        <Link to="/track"
                          className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1">
                          Track this order <MdArrowForward />
                        </Link>
                      </motion.div>
                    )
                  })
                )}
              </div>
            )}

            {/* Service requests tab */}
            {tab === 'services' && (
              <div className="space-y-4">
                {loadingRequests ? (
                  Array(2).fill(0).map((_, i) => (
                    <div key={i} className="card p-5 space-y-3">
                      <div className="skeleton h-4 rounded-lg w-1/3" />
                      <div className="skeleton h-3 rounded-lg w-2/3" />
                    </div>
                  ))
                ) : requests.length === 0 ? (
                  <div className="card p-12 text-center">
                    <MdMiscellaneousServices className="text-5xl text-slate-200 dark:text-slate-700 mx-auto mb-3" />
                    <p className="font-display font-bold text-slate-800 dark:text-white mb-1">No service requests</p>
                    <p className="text-sm text-slate-400 mb-4">Request a service and track it here.</p>
                    <Link to="/services" className="btn-secondary">Browse Services</Link>
                  </div>
                ) : (
                  requests.map(req => {
                    const st = SERVICE_STATUS_STYLE[req.status] || SERVICE_STATUS_STYLE.new
                    return (
                      <motion.div key={req._id}
                        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                        className="card p-5"
                      >
                        <div className="flex items-start justify-between mb-2 flex-wrap gap-2">
                          <div>
                            <p className="font-semibold text-sm text-slate-900 dark:text-white">
                              {SERVICE_LABELS[req.serviceType] || req.serviceType}
                            </p>
                            <p className="text-xs text-slate-400 font-mono mt-0.5">
                              #{req._id.toString().slice(-8).toUpperCase()} ·{' '}
                              {new Date(req.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                            </p>
                          </div>
                          <span className={`${st.cls} text-xs capitalize`}>{st.label}</span>
                        </div>

                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-2">{req.description}</p>

                        {req.adminNotes && (
                          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg px-3 py-2">
                            <p className="text-xs text-blue-700 dark:text-blue-400">📌 {req.adminNotes}</p>
                          </div>
                        )}
                      </motion.div>
                    )
                  })
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}