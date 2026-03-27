import { useCartStore } from '../store'
import { Link } from 'react-router-dom'
import { MdClose, MdDeleteOutline, MdShoppingBag } from 'react-icons/md'
import { motion, AnimatePresence } from 'framer-motion'
import QuantityInput from './QuantityInput'

export default function CartDrawer({ open, onClose }) {
  const { items, removeItem, updateQuantity, getTotal, getCount } = useCartStore()
  const total = getTotal()
  const count = getCount()

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* On mobile: slide from bottom; on desktop: slide from right */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 md:bottom-auto md:right-0 md:top-0 md:left-auto
                       h-[92vh] md:h-full w-full md:max-w-md
                       bg-white dark:bg-slate-900 z-50 flex flex-col shadow-2xl
                       rounded-t-3xl md:rounded-none"
          >
            {/* Handle bar (mobile only) */}
            <div className="md:hidden flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-slate-200 dark:bg-slate-700" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 md:py-5 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h2 className="font-display font-bold text-lg text-slate-900 dark:text-white">Your Cart</h2>
                <p className="text-xs text-slate-400">{count} item{count !== 1 ? 's' : ''}</p>
              </div>
              <button onClick={onClose}
                className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 transition-all active:scale-95">
                <MdClose className="text-xl" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 scrollbar-thin">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-16">
                  <MdShoppingBag className="text-7xl text-slate-200 dark:text-slate-700 mb-4" />
                  <p className="text-slate-600 dark:text-slate-400 font-semibold text-lg">Cart is empty</p>
                  <p className="text-sm text-slate-400 mt-1 mb-6">Add items to get started</p>
                  <Link to="/products" onClick={onClose}
                    className="btn-primary px-8 py-3 text-base">
                    Browse Products
                  </Link>
                </div>
              ) : (
                <AnimatePresence>
                  {items.map(item => (
                    <motion.div
                      key={item._id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 60 }}
                      className="flex gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl"
                    >
                      <img
                        src={item.image} alt={item.name}
                        className="w-18 h-18 w-[72px] h-[72px] object-cover rounded-xl flex-shrink-0 bg-slate-100"
                        onError={e => e.target.src = 'https://placehold.co/72x72/e2e8f0/64748b?text=?'}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white line-clamp-2 leading-snug">
                          {item.name}
                        </p>
                        <p className="text-brand-600 dark:text-brand-400 font-bold text-base mt-0.5">
                          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                        </p>
                        <p className="text-slate-400 text-xs">₹{item.price} each</p>

                        <div className="flex items-center justify-between mt-2">
                          <QuantityInput
                            value={item.quantity}
                            max={item.stock}
                            onChange={qty => updateQuantity(item._id, qty)}
                            onRemove={() => removeItem(item._id)}
                            size="sm"
                          />
                          <button
                            onClick={() => removeItem(item._id)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-red-400 hover:text-red-600 active:bg-red-50 transition-all"
                          >
                            <MdDeleteOutline className="text-lg" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-4 pb-6 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3 bg-white dark:bg-slate-900">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Total</span>
                  <span className="text-2xl font-display font-bold text-slate-900 dark:text-white">
                    ₹{total.toLocaleString('en-IN')}
                  </span>
                </div>
                <Link to="/checkout" onClick={onClose}
                  className="flex items-center justify-center gap-2 w-full bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white font-bold py-4 rounded-2xl text-base transition-all">
                  Checkout — ₹{total.toLocaleString('en-IN')}
                </Link>
                <button onClick={onClose}
                  className="w-full text-center text-sm text-slate-400 py-1">
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}