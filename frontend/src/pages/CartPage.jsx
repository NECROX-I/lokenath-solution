import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useCartStore } from '../store'
import { MdDeleteOutline, MdShoppingBag, MdArrowForward } from 'react-icons/md'
import SEO from '../components/SEO'
import QuantityInput from '../components/QuantityInput'

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotal, getCount } = useCartStore()
  const total = getTotal()
  const count = getCount()

  return (
    <>
      <SEO title="Your Cart" description="Review your cart at Loknath Solution." noIndex={true} />
      <div className="page-container py-10">
        <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white mb-8">
          Shopping Cart{' '}
          {count > 0 && (
            <span className="text-lg font-normal text-slate-500">({count} item{count !== 1 ? 's' : ''})</span>
          )}
        </h1>

        {items.length === 0 ? (
          <div className="text-center py-24">
            <MdShoppingBag className="text-7xl text-slate-200 dark:text-slate-700 mx-auto mb-4" />
            <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white mb-2">Your cart is empty</h2>
            <p className="text-slate-500 mb-6">Start shopping to add items here.</p>
            <Link to="/products" className="btn-primary">Browse Products</Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Items list */}
            <div className="lg:col-span-2 space-y-4">
              <AnimatePresence>
                {items.map(item => (
                  <motion.div
                    key={item._id}
                    layout
                    exit={{ opacity: 0, x: 40, height: 0 }}
                    className="card p-4 flex gap-4"
                  >
                    <Link to={`/products/${item._id}`} className="flex-shrink-0">
                      <img
                        src={item.image} alt={item.name}
                        className="w-24 h-24 object-cover rounded-xl bg-slate-100"
                        onError={e => e.target.src = 'https://placehold.co/96x96/e2e8f0/64748b?text=?'}
                      />
                    </Link>

                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/products/${item._id}`}
                        className="font-semibold text-slate-900 dark:text-white text-sm hover:text-brand-600 line-clamp-2 leading-snug"
                      >
                        {item.name}
                      </Link>

                      <p className="text-xs text-slate-400 mt-0.5 capitalize">{item.category}</p>

                      <div className="flex items-center justify-between mt-3 flex-wrap gap-3">
                        {/* Quantity selector */}
                        <QuantityInput
                          value={item.quantity}
                          max={item.stock}
                          onChange={qty => updateQuantity(item._id, qty)}
                          onRemove={() => removeItem(item._id)}
                          size="md"
                        />

                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <p className="font-bold text-brand-600 dark:text-brand-400 text-base">
                              ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                            </p>
                            {item.quantity > 1 && (
                              <p className="text-xs text-slate-400">₹{item.price} × {item.quantity}</p>
                            )}
                          </div>
                          <button
                            onClick={() => removeItem(item._id)}
                            className="p-2 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                            aria-label="Remove"
                          >
                            <MdDeleteOutline className="text-xl" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Order summary */}
            <div className="card p-6 h-fit sticky top-24">
              <h2 className="font-display font-bold text-slate-900 dark:text-white text-lg mb-4">Order Summary</h2>

              <div className="space-y-2 mb-4 text-sm">
                {items.map(item => (
                  <div key={item._id} className="flex justify-between text-slate-500 dark:text-slate-400">
                    <span className="truncate mr-2 flex-1">{item.name.slice(0, 28)}{item.name.length > 28 ? '…' : ''} ×{item.quantity}</span>
                    <span className="flex-shrink-0">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-100 dark:border-slate-700 pt-3 mb-5">
                <div className="flex justify-between text-slate-500 dark:text-slate-400 text-sm mb-1.5">
                  <span>Subtotal ({count} items)</span>
                  <span>₹{total.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-slate-500 dark:text-slate-400 text-sm">
                  <span>Delivery</span>
                  <span className="text-brand-600 dark:text-brand-400">Confirmed on call</span>
                </div>
              </div>

              <div className="flex justify-between font-bold text-lg border-t border-slate-100 dark:border-slate-700 pt-3">
                <span className="text-slate-900 dark:text-white">Total</span>
                <span className="text-brand-600 dark:text-brand-400">₹{total.toLocaleString('en-IN')}</span>
              </div>

              <Link to="/checkout" className="btn-primary w-full justify-center mt-5 py-4 text-base">
                Proceed to Checkout <MdArrowForward />
              </Link>
              <Link to="/products"
                className="block text-center text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 mt-3">
                Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  )
}