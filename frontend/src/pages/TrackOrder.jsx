import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion, AnimatePresence } from 'framer-motion'
import { orderAPI, serviceRequestAPI } from '../services/api'
import toast from 'react-hot-toast'
import {
  MdSearch, MdShoppingBag, MdMiscellaneousServices,
  MdPhone, MdCheckCircle, MdRefresh, MdCancel,
  MdWarning, MdClose
} from 'react-icons/md'
import { FaWhatsapp } from 'react-icons/fa'

// ─── Status config ─────────────────────────────────────────────
const ORDER_STEPS = ['pending', 'confirmed', 'processing', 'ready', 'delivered']

const ORDER_STATUS = {
  pending:    { label: 'Order Received',   color: 'text-amber-500',  bg: 'bg-amber-50 dark:bg-amber-900/20',   border: 'border-amber-200 dark:border-amber-800',   icon: '📋', desc: 'We have received your order and will confirm it shortly.' },
  confirmed:  { label: 'Confirmed',        color: 'text-blue-500',   bg: 'bg-blue-50 dark:bg-blue-900/20',     border: 'border-blue-200 dark:border-blue-800',     icon: '✅', desc: 'Your order has been confirmed. We are preparing it.' },
  processing: { label: 'Being Prepared',   color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/20', border: 'border-purple-200 dark:border-purple-800',  icon: '⚙️', desc: 'Your order is being packed and prepared.' },
  ready:      { label: 'Ready for Pickup', color: 'text-cyan-500',   bg: 'bg-cyan-50 dark:bg-cyan-900/20',     border: 'border-cyan-200 dark:border-cyan-800',     icon: '🏪', desc: 'Your order is ready! Please visit our shop to collect it.' },
  delivered:  { label: 'Delivered',        color: 'text-green-500',  bg: 'bg-green-50 dark:bg-green-900/20',   border: 'border-green-200 dark:border-green-800',   icon: '🎉', desc: 'Your order has been delivered. Thank you for shopping with us!' },
  cancelled:  { label: 'Cancelled',        color: 'text-red-500',    bg: 'bg-red-50 dark:bg-red-900/20',       border: 'border-red-200 dark:border-red-800',       icon: '❌', desc: 'This order has been cancelled. Contact us for more info.' },
}

const SERVICE_STATUS = {
  new:          { label: 'Request Received', color: 'text-blue-500',  icon: '📋', desc: 'We have received your request and will contact you shortly.' },
  'in-progress':{ label: 'In Progress',      color: 'text-amber-500', icon: '⚙️', desc: 'Your service request is currently being processed.' },
  completed:    { label: 'Completed',        color: 'text-green-500', icon: '✅', desc: 'Your service has been completed successfully!' },
  cancelled:    { label: 'Cancelled',        color: 'text-red-500',   icon: '❌', desc: 'This request has been cancelled. Please contact us.' },
}

const SERVICE_LABELS = {
  'tax-payment': '🧾 Tax Payment', 'money-transfer': '💸 Money Transfer',
  'government-schemes': '🏛️ Govt Schemes', 'aadhaar-services': '🪪 Aadhaar Services',
  'voter-id': '🗳️ Voter ID', 'ration-card': '🍚 Ration Card',
  'form-filling': '📝 Form Filling', 'other': '📋 Other',
}

// ─── Cancel Confirmation Dialog ────────────────────────────────
function CancelDialog({ order, phone, onConfirm, onClose }) {
  const [reason, setReason] = useState('')
  const [loading, setLoading] = useState(false)

  const handleConfirm = async () => {
    setLoading(true)
    try {
      await orderAPI.cancelOrder(order._id, { phone, reason: reason.trim() || 'No reason provided' })
      toast.success('Order cancelled successfully.')
      onConfirm()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not cancel. Please call us.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={e => e.stopPropagation()}
        className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-md shadow-2xl p-6"
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
              <MdWarning className="text-red-500 text-xl" />
            </div>
            <div>
              <h3 className="font-display font-bold text-slate-900 dark:text-white">Cancel Order?</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Order #{order._id.toString().slice(-8).toUpperCase()}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1">
            <MdClose className="text-xl" />
          </button>
        </div>

        {/* Warning */}
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3 mb-4 text-sm text-red-700 dark:text-red-400">
          ⚠️ This action cannot be undone. Items will be restocked automatically.
        </div>

        {/* Items summary */}
        <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-3 mb-4 space-y-1.5">
          {order.items?.map((item, i) => (
            <div key={i} className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
              <span className="truncate mr-2">{item.name} ×{item.quantity}</span>
              <span className="flex-shrink-0 font-semibold">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
            </div>
          ))}
          <div className="border-t border-slate-200 dark:border-slate-600 pt-1.5 flex justify-between text-xs font-bold text-slate-800 dark:text-white mt-1">
            <span>Total</span>
            <span>₹{order.totalAmount?.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Reason */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Reason for cancellation <span className="text-slate-400 font-normal">(optional)</span>
          </label>
          <textarea
            rows={3}
            placeholder="e.g. Ordered by mistake, found it elsewhere, changed my mind..."
            value={reason}
            onChange={e => setReason(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600
                       bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm
                       focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent
                       resize-none placeholder-slate-400"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
          >
            Keep Order
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2"
          >
            {loading
              ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Cancelling...</>
              : <><MdCancel /> Yes, Cancel Order</>
            }
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Order Status Stepper ──────────────────────────────────────
function OrderStepper({ status }) {
  if (status === 'cancelled') return null
  const currentIdx = ORDER_STEPS.indexOf(status)
  return (
    <div className="flex items-center justify-between mt-6 mb-2 px-1">
      {ORDER_STEPS.map((step, i) => {
        const done = i <= currentIdx
        const active = i === currentIdx
        return (
          <div key={step} className="flex items-center flex-1">
            <div className="flex flex-col items-center gap-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                done
                  ? 'bg-brand-600 border-brand-600 text-white'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600 text-slate-400'
              } ${active ? 'ring-4 ring-brand-100 dark:ring-brand-900/40 scale-110' : ''}`}>
                {done && !active ? '✓' : i + 1}
              </div>
              <span className={`text-xs font-medium hidden sm:block text-center leading-tight ${
                done ? 'text-brand-600 dark:text-brand-400' : 'text-slate-400'
              }`}>
                {ORDER_STATUS[step]?.label}
              </span>
            </div>
            {i < ORDER_STEPS.length - 1 && (
              <div className={`flex-1 h-0.5 mx-1 mb-5 transition-all ${
                i < currentIdx ? 'bg-brand-500' : 'bg-slate-200 dark:bg-slate-700'
              }`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ─── Order Card ────────────────────────────────────────────────
function OrderCard({ order, phone, onCancelled }) {
  const [showCancel, setShowCancel] = useState(false)
  const [currentOrder, setCurrentOrder] = useState(order)
  const status = ORDER_STATUS[currentOrder.status] || ORDER_STATUS.pending
  const wa = import.meta.env.VITE_WHATSAPP_NUMBER || '919876543210'

  // Can cancel only if pending or confirmed
  const canCancel = ['pending', 'confirmed'].includes(currentOrder.status)

  const handleCancelled = () => {
    setShowCancel(false)
    setCurrentOrder(o => ({ ...o, status: 'cancelled' }))
    if (onCancelled) onCancelled(order._id)
  }

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className={`card border ${status.border} mb-4`}
      >
        {/* Header */}
        <div className={`${status.bg} px-5 py-4 flex items-center justify-between flex-wrap gap-2`}>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{status.icon}</span>
            <div>
              <p className={`font-display font-bold text-sm ${status.color}`}>{status.label}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                #{currentOrder._id.toString().slice(-8).toUpperCase()}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-bold text-brand-600 dark:text-brand-400 text-lg">
              ₹{currentOrder.totalAmount?.toLocaleString('en-IN')}
            </p>
            <p className="text-xs text-slate-400">
              {new Date(currentOrder.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </p>
          </div>
        </div>

        <div className="px-5 py-4">
          {/* Status desc */}
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{status.desc}</p>

          {/* Stepper */}
          <OrderStepper status={currentOrder.status} />

          {/* Items */}
          <div className="mt-5 space-y-2">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Items Ordered</p>
            {currentOrder.items?.map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-sm">
                <img
                  src={item.image} alt={item.name}
                  className="w-10 h-10 rounded-lg object-cover bg-slate-100 flex-shrink-0"
                  onError={e => e.target.src = 'https://placehold.co/40x40/e2e8f0/64748b?text=?'}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-slate-800 dark:text-white font-medium line-clamp-1">{item.name}</p>
                  <p className="text-slate-400 text-xs">Qty: {item.quantity} × ₹{item.price}</p>
                </div>
                <p className="font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0">
                  ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                </p>
              </div>
            ))}
          </div>

          {/* Admin notes */}
          {currentOrder.adminNotes && (
            <div className="mt-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-3">
              <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1">📌 Note from Shop</p>
              <p className="text-sm text-slate-700 dark:text-slate-300">{currentOrder.adminNotes}</p>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-2 mt-4">
            {/* WhatsApp */}
            <a
              href={`https://wa.me/${wa}?text=Hello! Order status query. Order ID: %23${currentOrder._id.toString().slice(-8).toUpperCase()}`}
              target="_blank" rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold text-sm py-2.5 rounded-xl transition-all"
            >
              <FaWhatsapp className="text-base" /> WhatsApp
            </a>

            {/* Cancel button — only for pending/confirmed */}
            {canCancel && (
              <button
                onClick={() => setShowCancel(true)}
                className="flex-1 flex items-center justify-center gap-2 border-2 border-red-200 dark:border-red-800 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 font-semibold text-sm py-2.5 rounded-xl transition-all"
              >
                <MdCancel className="text-base" /> Cancel Order
              </button>
            )}
          </div>

          {/* Can't cancel info */}
          {!canCancel && currentOrder.status !== 'cancelled' && currentOrder.status !== 'delivered' && (
            <p className="text-xs text-slate-400 text-center mt-3">
              ℹ️ Order cannot be cancelled at this stage. <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">Contact us</a> for help.
            </p>
          )}
        </div>
      </motion.div>

      {/* Cancel dialog */}
      <AnimatePresence>
        {showCancel && (
          <CancelDialog
            order={currentOrder}
            phone={phone}
            onConfirm={handleCancelled}
            onClose={() => setShowCancel(false)}
          />
        )}
      </AnimatePresence>
    </>
  )
}

// ─── Service Cancel Dialog ─────────────────────────────────────
function ServiceCancelDialog({ request, phone, onConfirm, onClose }) {
  const [reason, setReason] = useState('')
  const [loading, setLoading] = useState(false)

  const handleConfirm = async () => {
    setLoading(true)
    try {
      await serviceRequestAPI.cancelRequest(request._id, { phone, reason: reason.trim() || 'No reason provided' })
      toast.success('Service request cancelled.')
      onConfirm()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not cancel. Please call us.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
        onClick={e => e.stopPropagation()}
        className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-md shadow-2xl p-6"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <MdWarning className="text-red-500 text-xl" />
            </div>
            <div>
              <h3 className="font-display font-bold text-slate-900 dark:text-white">Cancel Request?</h3>
              <p className="text-xs text-slate-500">#{request._id.toString().slice(-8).toUpperCase()}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
            <MdClose className="text-xl" />
          </button>
        </div>

        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3 mb-4 text-sm text-red-700 dark:text-red-400">
          ⚠️ Are you sure you want to cancel your <strong>{SERVICE_LABELS[request.serviceType]}</strong> request?
        </div>

        <div className="mb-5">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Reason <span className="text-slate-400 font-normal">(optional)</span>
          </label>
          <textarea rows={3} placeholder="e.g. No longer needed, visited the office directly..."
            value={reason} onChange={e => setReason(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600
                       bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm
                       focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent resize-none placeholder-slate-400"
          />
        </div>

        <div className="flex gap-3">
          <button onClick={onClose}
            className="flex-1 px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">
            Keep Request
          </button>
          <button onClick={handleConfirm} disabled={loading}
            className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2">
            {loading
              ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Cancelling...</>
              : <><MdCancel /> Yes, Cancel</>
            }
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Service Card ──────────────────────────────────────────────
function ServiceCard({ request, phone, onCancelled }) {
  const [showCancel, setShowCancel] = useState(false)
  const [currentReq, setCurrentReq] = useState(request)
  const status = SERVICE_STATUS[currentReq.status] || SERVICE_STATUS.new
  const wa = import.meta.env.VITE_WHATSAPP_NUMBER || '919876543210'

  const canCancel = ['new', 'in-progress'].includes(currentReq.status)

  const handleCancelled = () => {
    setShowCancel(false)
    setCurrentReq(r => ({ ...r, status: 'cancelled' }))
    if (onCancelled) onCancelled(request._id)
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className="card border border-slate-100 dark:border-slate-700 mb-4"
      >
        <div className="bg-slate-50 dark:bg-slate-800/50 px-5 py-4 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{status.icon}</span>
            <div>
              <p className={`font-display font-bold text-sm ${status.color}`}>{status.label}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                #{currentReq._id.toString().slice(-8).toUpperCase()}
              </p>
            </div>
          </div>
          <p className="text-xs text-slate-400">
            {new Date(currentReq.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
          </p>
        </div>

        <div className="px-5 py-4 space-y-3">
          <p className="text-sm text-slate-600 dark:text-slate-400">{status.desc}</p>

          <div className="flex flex-wrap gap-3">
            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg px-3 py-2">
              <p className="text-xs text-slate-400 mb-0.5">Service</p>
              <p className="font-semibold text-slate-800 dark:text-white text-xs">
                {SERVICE_LABELS[currentReq.serviceType] || currentReq.serviceType}
              </p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg px-3 py-2">
              <p className="text-xs text-slate-400 mb-0.5">Submitted</p>
              <p className="font-semibold text-slate-800 dark:text-white text-xs">
                {new Date(currentReq.createdAt).toLocaleDateString('en-IN')}
              </p>
            </div>
          </div>

          {currentReq.description && (
            <div>
              <p className="text-xs text-slate-400 mb-1">Your Request</p>
              <p className="text-sm text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 rounded-lg p-3 line-clamp-3">
                {currentReq.description}
              </p>
            </div>
          )}

          {currentReq.adminNotes && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-3">
              <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1">📌 Update from Shop</p>
              <p className="text-sm text-slate-700 dark:text-slate-300">{currentReq.adminNotes}</p>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-2">
            <a href={`https://wa.me/${wa}?text=Hello! Service request query. Request ID: %23${currentReq._id.toString().slice(-8).toUpperCase()}`}
              target="_blank" rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold text-sm py-2.5 rounded-xl transition-all">
              <FaWhatsapp /> WhatsApp
            </a>

            {canCancel && (
              <button onClick={() => setShowCancel(true)}
                className="flex-1 flex items-center justify-center gap-2 border-2 border-red-200 dark:border-red-800 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 font-semibold text-sm py-2.5 rounded-xl transition-all">
                <MdCancel /> Cancel Request
              </button>
            )}
          </div>

          {!canCancel && currentReq.status !== 'cancelled' && currentReq.status !== 'completed' && (
            <p className="text-xs text-slate-400 text-center">
              ℹ️ Cannot cancel at this stage. <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">Contact us</a> for help.
            </p>
          )}
        </div>
      </motion.div>

      <AnimatePresence>
        {showCancel && (
          <ServiceCancelDialog
            request={currentReq}
            phone={phone}
            onConfirm={handleCancelled}
            onClose={() => setShowCancel(false)}
          />
        )}
      </AnimatePresence>
    </>
  )
}

// ─── Main Page ─────────────────────────────────────────────────
export default function TrackOrder() {
  const [tab, setTab] = useState('order')
  const [phone, setPhone] = useState('')
  const [orderId, setOrderId] = useState('')
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [searched, setSearched] = useState(false)

  const handleTrack = async (e) => {
    e.preventDefault()
    setError('')
    setResults(null)

    if (tab === 'order' && !phone && !orderId) {
      setError('Please enter your phone number or order ID'); return
    }
    if (tab === 'service' && !phone) {
      setError('Please enter your phone number'); return
    }
    if (phone && !/^[6-9]\d{9}$/.test(phone)) {
      setError('Enter a valid 10-digit phone number'); return
    }

    setLoading(true)
    setSearched(true)
    try {
      if (tab === 'order') {
        const params = orderId ? { orderId } : { phone }
        const { data } = await orderAPI.trackByPhone(params)
        setResults(data.orders || [])
      } else {
        const { data } = await serviceRequestAPI.trackByPhone({ phone })
        setResults(data.requests || [])
      }
    } catch (err) {
      setError(err.response?.data?.message || 'No records found. Please check your details.')
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const handleClear = () => {
    setPhone(''); setOrderId(''); setResults(null); setError(''); setSearched(false)
  }

  // Called when a card is cancelled — update that item in results instantly, no re-fetch
  const handleCancelled = (id) => {
    setResults(prev =>
      prev.map(item =>
        item._id === id ? { ...item, status: 'cancelled' } : item
      )
    )
  }

  return (
    <>
      <Helmet>
        <title>Track Order & Service — Loknath Solution</title>
        <meta name="description" content="Track your order or service request status at Loknath Solution." />
      </Helmet>

      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 py-14">
        <div className="page-container text-center">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-brand-400 font-semibold text-sm uppercase tracking-wider">Real-time Updates</span>
            <h1 className="text-4xl font-display font-bold text-white mt-2">Track Your Order</h1>
            <p className="text-slate-400 mt-3 text-lg max-w-lg mx-auto">
              Enter your registered phone number to see the latest status — and cancel if needed.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="page-container py-12 max-w-2xl">

        {/* Tab switcher */}
        <div className="flex gap-2 mb-6 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl">
          <button
            onClick={() => { setTab('order'); handleClear() }}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all ${
              tab === 'order'
                ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <MdShoppingBag /> Track Order
          </button>
          <button
            onClick={() => { setTab('service'); handleClear() }}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all ${
              tab === 'service'
                ? 'bg-white dark:bg-slate-700 text-ocean-600 dark:text-ocean-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <MdMiscellaneousServices /> Track Service
          </button>
        </div>

        {/* Search form */}
        <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="card p-6 mb-6">
          <form onSubmit={handleTrack} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                <MdPhone className="inline mr-1 text-brand-500" />
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel" placeholder="Enter your 10-digit mobile number"
                value={phone} maxLength={10}
                onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
                className="input-field text-base"
              />
              <p className="text-xs text-slate-400 mt-1">Use the same number you gave while placing the order</p>
            </div>

            {tab === 'order' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Order ID <span className="text-slate-400 font-normal">(optional)</span>
                </label>
                <input
                  type="text" placeholder="e.g. A1B2C3D4 (from your confirmation page)"
                  value={orderId}
                  onChange={e => setOrderId(e.target.value.toUpperCase())}
                  className="input-field font-mono text-sm" maxLength={24}
                />
              </div>
            )}

            {error && (
              <div className="px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
                ⚠️ {error}
              </div>
            )}

            <div className="flex gap-3">
              <button type="submit" disabled={loading}
                className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm text-white transition-all ${
                  tab === 'order'
                    ? 'bg-brand-600 hover:bg-brand-700 disabled:bg-brand-300'
                    : 'bg-ocean-600 hover:bg-ocean-700 disabled:bg-ocean-300'
                }`}>
                {loading
                  ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Searching...</>
                  : <><MdSearch className="text-lg" /> Track Now</>
                }
              </button>
              {searched && (
                <button type="button" onClick={handleClear}
                  className="px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                  <MdRefresh className="text-xl" />
                </button>
              )}
            </div>
          </form>
        </motion.div>

        {/* Results */}
        <AnimatePresence mode="wait">
          {results !== null && (
            <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {results.length === 0 ? (
                <div className="card p-10 text-center">
                  <span className="text-5xl block mb-4">🔍</span>
                  <h3 className="font-display font-bold text-slate-800 dark:text-white text-lg mb-2">
                    No {tab === 'order' ? 'Orders' : 'Requests'} Found
                  </h3>
                  <p className="text-slate-500 text-sm mb-4">
                    We couldn't find any {tab === 'order' ? 'orders' : 'service requests'} linked to this number.
                  </p>
                  <a
                    href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER || '919876543210'}`}
                    target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-xl transition-all text-sm"
                  >
                    <FaWhatsapp /> Contact Us on WhatsApp
                  </a>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      {results.length} {tab === 'order' ? 'order' : 'request'}{results.length !== 1 ? 's' : ''} found
                    </p>
                    <span className="text-xs text-slate-400">Latest first</span>
                  </div>
                  {tab === 'order'
                    ? results.map(order => (
                        <OrderCard
                          key={order._id}
                          order={order}
                          phone={phone}
                          onCancelled={handleCancelled}
                        />
                      ))
                    : results.map(req => (
                        <ServiceCard
                          key={req._id}
                          request={req}
                          phone={phone}
                          onCancelled={handleCancelled}
                        />
                      ))
                  }
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* How it works */}
        {!searched && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.2 } }}>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider text-center mb-4">How it works</p>
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: MdPhone,       title: 'Enter Phone',   desc: 'Use the number you gave us' },
                { icon: MdSearch,      title: 'We Search',     desc: 'Find all your orders' },
                { icon: MdCheckCircle, title: 'See & Manage',  desc: 'Track status or cancel' },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="card p-4 text-center">
                  <Icon className="text-brand-500 text-2xl mx-auto mb-2" />
                  <p className="text-xs font-bold text-slate-800 dark:text-white">{title}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </>
  )
}