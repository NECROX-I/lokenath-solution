import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import SEO from '../components/SEO'
import { motion, AnimatePresence } from 'framer-motion'
import { productAPI } from '../services/api'
import { useCartStore } from '../store'
import toast from 'react-hot-toast'
import QuantityInput from '../components/QuantityInput'
import {
  MdAddShoppingCart, MdArrowBack, MdCheckCircle,
  MdLocalShipping, MdSupportAgent, MdNotifications,
  MdPhone, MdClose
} from 'react-icons/md'
import { FaWhatsapp } from 'react-icons/fa'

// Notify me modal — asks for phone, sends WhatsApp to shop
function NotifyModal({ product, onClose }) {
  const [phone, setPhone] = useState('')
  const wa = import.meta.env.VITE_WHATSAPP_NUMBER || '919876543210'
  const phoneValid = /^[6-9]\d{9}$/.test(phone)

  const handleNotify = () => {
    const msg = `Hello! I'd like to be notified when *${product.name}* (₹${product.price}) is back in stock. My number: +91${phone}`
    window.open(`https://wa.me/${wa}?text=${encodeURIComponent(msg)}`, '_blank')
    toast.success('Opening WhatsApp — send the message to get notified!')
    onClose()
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
        className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-sm shadow-2xl p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <MdNotifications className="text-amber-500 text-xl" />
            </div>
            <h3 className="font-display font-bold text-slate-900 dark:text-white">Notify Me</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
            <MdClose className="text-xl" />
          </button>
        </div>

        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
          Enter your phone number and we'll send a WhatsApp message to the shop.
          They'll contact you as soon as <strong className="text-slate-700 dark:text-slate-300">{product.name}</strong> is back in stock.
        </p>

        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Your Mobile Number
          </label>
          <div className="flex gap-2">
            <span className="flex items-center px-3 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl text-sm border border-slate-200 dark:border-slate-600 font-medium">
              🇮🇳 +91
            </span>
            <input
              type="tel" maxLength={10} value={phone} autoFocus
              placeholder="98765 43210"
              onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
              onKeyDown={e => e.key === 'Enter' && phoneValid && handleNotify()}
              className="input-field flex-1 font-mono tracking-widest"
            />
          </div>
          {phone && !phoneValid && (
            <p className="text-xs text-red-400 mt-1">Enter a valid 10-digit number</p>
          )}
        </div>

        <div className="flex gap-3">
          <button onClick={onClose}
            className="flex-1 px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">
            Cancel
          </button>
          <button onClick={handleNotify} disabled={!phoneValid}
            className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 disabled:bg-slate-200 dark:disabled:bg-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-semibold px-4 py-3 rounded-xl text-sm transition-all">
            <FaWhatsapp /> Notify Me
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addItem } = useCartStore()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [qty, setQty] = useState(1)
  const [showNotify, setShowNotify] = useState(false)

  const wa = import.meta.env.VITE_WHATSAPP_NUMBER || '919876543210'

  useEffect(() => {
    productAPI.getOne(id)
      .then(r => setProduct(r.data.product))
      .catch(() => navigate('/products'))
      .finally(() => setLoading(false))
  }, [id])

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) addItem(product)
    toast.success(`${qty}x ${product.name.slice(0, 20)}... added to cart!`, { icon: '🛒' })
  }

  if (loading) return (
    <div className="page-container py-16">
      <div className="grid md:grid-cols-2 gap-10">
        <div className="skeleton aspect-square rounded-2xl" />
        <div className="space-y-4">
          <div className="skeleton h-8 rounded-xl w-3/4" />
          <div className="skeleton h-6 rounded-xl w-1/4" />
          <div className="skeleton h-4 rounded-lg w-full" />
          <div className="skeleton h-4 rounded-lg w-4/5" />
        </div>
      </div>
    </div>
  )

  if (!product) return null

  return (
    <>
      <SEO
        title={product.name}
        description={`${product.description} — Buy ${product.name} at ₹${product.price} from Loknath Solution, West Bengal.`}
        keywords={`${product.name}, ${product.category} shop West Bengal, buy ${product.name} online`}
        canonical={`/products/${product._id}`}
        type="product"
        schema={{
          "@context": "https://schema.org",
          "@type": "Product",
          "name": product.name,
          "description": product.description,
          "image": product.image,
          "offers": {
            "@type": "Offer",
            "priceCurrency": "INR",
            "price": product.price,
            "availability": product.stock > 0
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock",
            "seller": { "@type": "Organization", "name": "Loknath Solution" }
          }
        }}
      />

      <div className="page-container py-8">
        <Link to="/products" className="btn-ghost mb-6 inline-flex">
          <MdArrowBack /> Back to Products
        </Link>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-14">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative"
          >
            <div className="aspect-square rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-800 shadow-card">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={e => e.target.src = 'https://placehold.co/600x600/e2e8f0/64748b?text=No+Image'}
              />
            </div>
            {product.stock === 0 && (
              <div className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center">
                <span className="bg-red-500 text-white font-bold px-6 py-2 rounded-xl text-lg">Out of Stock</span>
              </div>
            )}
            {product.featured && (
              <div className="absolute top-4 left-4 badge bg-amber-400 text-amber-900 px-3 py-1.5 text-sm font-bold">
                ⭐ Featured
              </div>
            )}
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col"
          >
            <span className={`badge w-fit mb-3 capitalize text-sm ${product.category === 'stationery' ? 'badge-blue' : 'badge-green'}`}>
              {product.category}
            </span>

            <h1 className="text-2xl md:text-3xl font-display font-bold text-slate-900 dark:text-white leading-tight">
              {product.name}
            </h1>

            <div className="flex items-baseline gap-3 mt-4">
              <span className="text-4xl font-display font-bold text-brand-600 dark:text-brand-400">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
            </div>

            {/* Stock status */}
            <div className="mt-3">
              {product.stock > 0 ? (
                <div className="flex items-center gap-2">
                  <MdCheckCircle className="text-brand-500" />
                  <span className="text-sm text-brand-600 dark:text-brand-400 font-medium">
                    In Stock
                    {product.stock <= 10 && (
                      <span className="ml-1 text-amber-500 font-bold">— Only {product.stock} left!</span>
                    )}
                  </span>
                </div>
              ) : (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3 flex items-center gap-3">
                  <span className="text-2xl">😔</span>
                  <div>
                    <p className="text-sm font-bold text-red-600 dark:text-red-400">Currently Out of Stock</p>
                    <p className="text-xs text-red-500 dark:text-red-400 mt-0.5">
                      We're working to restock this soon. Get notified when it's available!
                    </p>
                  </div>
                </div>
              )}
            </div>

            <p className="text-slate-600 dark:text-slate-400 mt-5 leading-relaxed text-sm">
              {product.description}
            </p>

            {/* Quantity — only when in stock */}
            {product.stock > 0 && (
              <div className="mt-6">
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Quantity</p>
                <div className="flex items-center gap-4 flex-wrap">
                  <QuantityInput
                    value={qty}
                    max={product.stock}
                    onChange={setQty}
                    size="md"
                  />
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    Total: <span className="font-bold text-brand-600 dark:text-brand-400">
                      ₹{(product.price * qty).toLocaleString('en-IN')}
                    </span>
                  </span>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col gap-3 mt-8">
              {product.stock > 0 ? (
                <>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={handleAddToCart}
                      className="btn-primary flex-1 justify-center py-4 text-base"
                    >
                      <MdAddShoppingCart className="text-xl" /> Add to Cart
                    </button>
                    <a
                      href={`https://wa.me/${wa}?text=${encodeURIComponent(`Hi! I'd like to order: *${product.name}* (₹${product.price}). Is it available?`)}`}
                      target="_blank" rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-4 rounded-xl transition-all flex-1"
                    >
                      <FaWhatsapp className="text-xl" /> Order on WhatsApp
                    </a>
                  </div>
                </>
              ) : (
                <>
                  {/* Out of stock actions */}
                  <button
                    onClick={() => setShowNotify(true)}
                    className="flex items-center justify-center gap-2 w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-4 rounded-2xl text-base transition-all hover:-translate-y-0.5 shadow-lg shadow-amber-500/25"
                  >
                    <MdNotifications className="text-xl" /> Notify Me When Available
                  </button>
                  <a
                    href={`https://wa.me/${wa}?text=${encodeURIComponent(`Hi! I noticed *${product.name}* (₹${product.price}) is out of stock. When will it be available again?`)}`}
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 border-2 border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 font-semibold py-3.5 rounded-2xl text-sm transition-all"
                  >
                    <FaWhatsapp className="text-lg" /> Ask About Restock on WhatsApp
                  </a>
                </>
              )}
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-slate-100 dark:border-slate-700">
              {[
                { icon: MdLocalShipping, label: 'Free delivery for bulk orders' },
                { icon: MdCheckCircle,   label: 'Quality guaranteed' },
                { icon: MdSupportAgent,  label: '24/7 support available' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="text-center">
                  <Icon className="text-brand-500 text-2xl mx-auto mb-1" />
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-tight">{label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Notify Me modal */}
      <AnimatePresence>
        {showNotify && (
          <NotifyModal product={product} onClose={() => setShowNotify(false)} />
        )}
      </AnimatePresence>
    </>
  )
}