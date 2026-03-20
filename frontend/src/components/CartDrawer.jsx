import { useCartStore } from '../store'
import { Link, Navigate } from 'react-router-dom'
import { MdClose, MdDeleteOutline, MdShoppingBag } from 'react-icons/md'
import { motion, AnimatePresence } from 'framer-motion'
import QuantityInput from './QuantityInput'

export default function CartDrawer({ open, onClose }) {
  const { items, removeItem, updateQuantity } = useCartStore()
  const total = items.reduce((s, i) => s + i.price * i.quantity, 0)
  const count = items.reduce((s, i) => s + i.quantity, 0)

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-slate-900 z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h2 className="font-display font-bold text-lg text-slate-900 dark:text-white">Your Cart</h2>
                <p className="text-sm text-slate-500">{count} item{count !== 1 ? 's' : ''}</p>
              </div>
              <button onClick={onClose}
                className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-all">
                <MdClose className="text-xl" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-16">
                  <MdShoppingBag className="text-6xl text-slate-200 dark:text-slate-700 mb-4" />
                  <p className="text-slate-500 dark:text-slate-400 font-medium">Your cart is empty</p>
                  <p className="text-sm text-slate-400 mt-1">Add some products to get started!</p>
                 <Link to="/products" onClick={onClose} className="mt-4 btn-primary">Shop Now</Link>
                </div>
              ) : (
                <AnimatePresence>
                  {items.map(item => (
                    <motion.div
                      key={item._id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 40 }}
                      className="flex gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl"
                    >
                      <img
                        src={item.image} alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg flex-shrink-0 bg-slate-100"
                        onError={e => e.target.src = 'https://placehold.co/64x64/e2e8f0/64748b?text=?'}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 dark:text-white line-clamp-2 leading-snug">
                          {item.name}
                        </p>
                        <p className="text-brand-600 dark:text-brand-400 font-bold text-sm mt-0.5">
                          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                          <span className="text-slate-400 font-normal text-xs ml-1">
                            (₹{item.price} each)
                          </span>
                        </p>

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
                            className="text-red-400 hover:text-red-600 transition-colors ml-2"
                            aria-label="Remove item"
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
              <div className="p-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 dark:text-slate-400 font-medium">Total</span>
                  <span className="text-xl font-bold font-display text-slate-900 dark:text-white">
                    ₹{total.toLocaleString('en-IN')}
                  </span>
                </div>
                <Link to="/checkout" onClick={onClose}
                  className="btn-primary w-full justify-center py-4 text-base rounded-xl">
                  Proceed to Checkout
                </Link>
                <button onClick={onClose}
                  className="w-full text-center text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 py-1">
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