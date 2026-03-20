import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion, AnimatePresence } from 'framer-motion'
import { useCartStore } from '../store'
import { orderAPI } from '../services/api'
import toast from 'react-hot-toast'
import {
  MdArrowBack, MdPhone, MdPerson, MdLocationOn,
  MdShoppingBag, MdCheckCircle, MdArrowForward
} from 'react-icons/md'
import { FaWhatsapp } from 'react-icons/fa'

const WA = import.meta.env.VITE_WHATSAPP_NUMBER || '919876543210'

export default function Checkout() {
  const { items, clearCart } = useCartStore()
  const navigate = useNavigate()

  const [name, setName]       = useState('')
  const [phone, setPhone]     = useState('')
  const [address, setAddress] = useState('')
  const [notes, setNotes]     = useState('')
  const [submitting, setSubmitting] = useState(false)

  const total = items.reduce((s, i) => s + i.price * i.quantity, 0)
  const count = items.reduce((s, i) => s + i.quantity, 0)

  const phoneValid = /^[6-9]\d{9}$/.test(phone)
  const canSubmit  = name.trim().length >= 2 && phoneValid

  if (items.length === 0) {
    return (
      <div className="page-container py-20 text-center">
        <MdShoppingBag className="text-6xl text-slate-200 dark:text-slate-700 mx-auto mb-4" />
        <p className="text-slate-600 dark:text-slate-400 mb-4 font-medium">Your cart is empty.</p>
        <Link to="/products" className="btn-primary">Browse Products</Link>
      </div>
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!canSubmit) return
    setSubmitting(true)
    try {
      const { data } = await orderAPI.place({
        customerName:    name.trim(),
        customerPhone:   phone,
        customerAddress: address.trim(),
        notes:           notes.trim(),
        items: items.map(i => ({ productId: i._id, name: i.name, quantity: i.quantity }))
      })
      clearCart()
      navigate('/order-success', {
        state: { orderId: data.order._id, total: data.order.totalAmount, phone }
      })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order. Try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <Helmet><title>Checkout – Loknath Solution</title></Helmet>

      <div className="page-container py-8 max-w-4xl">
        <Link to="/cart" className="btn-ghost mb-6 inline-flex text-sm">
          <MdArrowBack /> Back to Cart
        </Link>

        <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white mb-2">
          Almost there! 🎉
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mb-8">
          Just tell us who you are — we'll call to confirm your order.
        </p>

        <div className="grid lg:grid-cols-5 gap-8">

          {/* ── Form (3 cols) ── */}
          <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-5">

            {/* Name */}
            <div className="card p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center">
                  <MdPerson className="text-brand-600 dark:text-brand-400" />
                </div>
                <h2 className="font-display font-bold text-slate-900 dark:text-white">Your Name</h2>
              </div>
              <input
                type="text"
                placeholder="e.g. Rahul Kumar"
                value={name}
                onChange={e => setName(e.target.value)}
                autoFocus
                className="input-field text-base"
                required
              />
              {name.trim().length > 0 && name.trim().length < 2 && (
                <p className="text-xs text-red-400 mt-1">Please enter at least 2 characters</p>
              )}
            </div>

            {/* Phone — most important */}
            <div className={`card p-5 transition-all duration-200 ${
              phone && !phoneValid ? 'border-red-300 dark:border-red-700' :
              phoneValid ? 'border-brand-300 dark:border-brand-700' : ''
            }`}>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <MdPhone className="text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h2 className="font-display font-bold text-slate-900 dark:text-white">
                    Mobile Number <span className="text-red-500">*</span>
                  </h2>
                  <p className="text-xs text-slate-400">We'll call this number to confirm</p>
                </div>
                {phoneValid && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="ml-auto">
                    <MdCheckCircle className="text-green-500 text-xl" />
                  </motion.div>
                )}
              </div>

              <div className="flex gap-2">
                <span className="flex items-center px-3 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl font-medium text-sm border border-slate-200 dark:border-slate-600">
                  🇮🇳 +91
                </span>
                <input
                  type="tel"
                  placeholder="98765 43210"
                  value={phone}
                  onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  className="input-field flex-1 text-base tracking-widest font-mono"
                  required
                  maxLength={10}
                  inputMode="numeric"
                />
              </div>

              {phone && !phoneValid && (
                <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-red-400 mt-2">
                  ⚠️ Enter a valid 10-digit number starting with 6, 7, 8, or 9
                </motion.p>
              )}

              {/* WhatsApp note */}
              <div className="flex items-center gap-2 mt-3 bg-green-50 dark:bg-green-900/20 rounded-xl p-3">
                <FaWhatsapp className="text-green-500 flex-shrink-0" />
                <p className="text-xs text-green-700 dark:text-green-400">
                  Use the same number to <Link to="/track" className="underline font-semibold">track your order</Link> later
                </p>
              </div>
            </div>

            {/* Address — optional */}
            <div className="card p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-ocean-100 dark:bg-ocean-900/30 flex items-center justify-center">
                  <MdLocationOn className="text-ocean-600 dark:text-ocean-400" />
                </div>
                <div>
                  <h2 className="font-display font-bold text-slate-900 dark:text-white">
                    Delivery Address
                  </h2>
                  <p className="text-xs text-slate-400">Optional — leave blank for shop pickup</p>
                </div>
              </div>
              <textarea
                rows={3}
                placeholder="House no., Street, Area, City..."
                value={address}
                onChange={e => setAddress(e.target.value)}
                className="input-field resize-none"
              />
            </div>

            {/* Notes — optional */}
            <div className="card p-5">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                📝 Any special instructions? <span className="font-normal text-slate-400">(optional)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Call before delivery, pack separately..."
                value={notes}
                onChange={e => setNotes(e.target.value)}
                className="input-field"
              />
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={!canSubmit || submitting}
              whileHover={canSubmit ? { scale: 1.01 } : {}}
              whileTap={canSubmit ? { scale: 0.99 } : {}}
              className={`w-full py-4 rounded-2xl font-display font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 ${
                canSubmit
                  ? 'bg-gradient-to-r from-brand-600 to-ocean-600 hover:from-brand-500 hover:to-ocean-500 text-white shadow-xl shadow-brand-500/25'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
              }`}
            >
              {submitting ? (
                <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Placing Order...</>
              ) : (
                <>Place Order <MdArrowForward className="text-xl" /></>
              )}
            </motion.button>

            {!canSubmit && (
              <p className="text-center text-xs text-slate-400">
                {!name.trim() ? '👆 Enter your name to continue' :
                 !phoneValid ? '📱 Enter a valid phone number to continue' : ''}
              </p>
            )}

            <p className="text-center text-xs text-slate-400 leading-relaxed">
              ✅ No payment now · Pay when you receive · We'll call to confirm
            </p>
          </form>

          {/* ── Order Summary (2 cols) ── */}
          <div className="lg:col-span-2">
            <div className="card p-5 sticky top-24">
              <h2 className="font-display font-bold text-slate-900 dark:text-white mb-4">
                Your Order ({count} item{count !== 1 ? 's' : ''})
              </h2>

              <div className="space-y-3 mb-4 max-h-64 overflow-y-auto scrollbar-thin pr-1">
                {items.map(item => (
                  <div key={item._id} className="flex gap-3">
                    <img src={item.image} alt={item.name}
                      className="w-12 h-12 rounded-xl object-cover bg-slate-100 flex-shrink-0"
                      onError={e => e.target.src = 'https://placehold.co/48x48/e2e8f0/64748b?text=?'} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 dark:text-white line-clamp-2 leading-tight">
                        {item.name}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {item.quantity} × ₹{item.price.toLocaleString('en-IN')}
                      </p>
                    </div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white flex-shrink-0">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-100 dark:border-slate-700 pt-4 space-y-2">
                <div className="flex justify-between text-sm text-slate-500">
                  <span>Subtotal</span>
                  <span>₹{total.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm text-slate-500">
                  <span>Delivery</span>
                  <span className="text-brand-600 dark:text-brand-400 font-medium">Confirmed on call</span>
                </div>
                <div className="flex justify-between font-display font-bold text-xl pt-2 border-t border-slate-100 dark:border-slate-700">
                  <span className="text-slate-900 dark:text-white">Total</span>
                  <span className="text-brand-600 dark:text-brand-400">₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* What happens */}
              <div className="mt-5 space-y-2.5">
                {[
                  { icon: '📞', text: 'We call you to confirm' },
                  { icon: '📦', text: 'Items packed for you' },
                  { icon: '🏪', text: 'Pickup or home delivery' },
                  { icon: '💰', text: 'Pay when you receive' },
                ].map(({ icon, text }) => (
                  <div key={text} className="flex items-center gap-2.5 text-sm text-slate-500 dark:text-slate-400">
                    <span className="text-base">{icon}</span> {text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}