import { useLocation, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { MdCheckCircle, MdShoppingBag, MdPhone, MdTrackChanges } from 'react-icons/md'
import { FaWhatsapp } from 'react-icons/fa'

const WA = import.meta.env.VITE_WHATSAPP_NUMBER || '919876543210'

export default function OrderSuccess() {
  const { state } = useLocation()
  const shortId = state?.orderId?.toString().slice(-8).toUpperCase() || ''
  const phone   = state?.phone || ''
  const total   = state?.total || 0

  return (
    <>
      <Helmet><title>Order Placed – Loknath Solution</title></Helmet>
      <div className="page-container py-16 flex items-center justify-center min-h-[75vh]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: 'spring', damping: 20 }}
          className="card p-8 md:p-12 max-w-md w-full text-center"
        >
          {/* Animated tick */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 200, damping: 12 }}
            className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-6"
          >
            <MdCheckCircle className="text-5xl text-green-500" />
          </motion.div>

          <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white mb-2">
            Order Placed! 🎉
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mb-6">
            Thank you! We'll call you soon to confirm.
          </p>

          {/* Key info pills */}
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {shortId && (
              <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 rounded-full px-4 py-2 text-sm">
                <span className="text-slate-400">Order</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">#{shortId}</span>
              </div>
            )}
            {total > 0 && (
              <div className="flex items-center gap-1.5 bg-brand-50 dark:bg-brand-900/20 rounded-full px-4 py-2 text-sm">
                <span className="font-bold text-brand-600 dark:text-brand-400">
                  ₹{total.toLocaleString('en-IN')}
                </span>
              </div>
            )}
            {phone && (
              <div className="flex items-center gap-1.5 bg-green-50 dark:bg-green-900/20 rounded-full px-4 py-2 text-sm">
                <MdPhone className="text-green-500 text-sm" />
                <span className="text-green-700 dark:text-green-400 font-medium">+91 {phone}</span>
              </div>
            )}
          </div>

          {/* Steps */}
          <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-4 mb-6 text-left space-y-2.5">
            {[
              { icon: '📞', text: "We'll call to confirm your order" },
              { icon: '📦', text: 'Items will be packed for you' },
              { icon: '🏪', text: 'Pickup from shop or home delivery' },
              { icon: '💰', text: 'Pay when you receive — no advance' },
            ].map(({ icon, text }) => (
              <div key={text} className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                <span>{icon}</span> {text}
              </div>
            ))}
          </div>

          {/* Track tip */}
          <div className="bg-brand-50 dark:bg-brand-900/20 border border-brand-200 dark:border-brand-800 rounded-xl p-3 mb-6 text-sm text-brand-700 dark:text-brand-300">
            📱 Use your phone number <strong>{phone ? `+91 ${phone}` : 'you entered'}</strong> to track your order anytime
          </div>

          {/* Action buttons */}
          <div className="space-y-3">
            <Link to="/track"
              className="flex items-center justify-center gap-2 w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-4 rounded-2xl text-base transition-all hover:-translate-y-0.5 shadow-brand">
              <MdTrackChanges className="text-xl" /> Track My Order
            </Link>

            <div className="flex gap-2">
              <Link to="/products"
                className="flex-1 flex items-center justify-center gap-1.5 border-2 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-brand-300 font-semibold py-3 rounded-xl text-sm transition-all">
                <MdShoppingBag /> Shop More
              </Link>
              <a
                href={`https://wa.me/${WA}?text=Hi! My order ID is %23${shortId}. Phone: ${phone}`}
                target="_blank" rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-1.5 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-xl text-sm transition-all">
                <FaWhatsapp /> WhatsApp
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  )
}