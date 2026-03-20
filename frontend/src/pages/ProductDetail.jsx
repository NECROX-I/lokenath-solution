import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { productAPI } from '../services/api'
import { useCartStore } from '../store'
import toast from 'react-hot-toast'
import QuantityInput from '../components/QuantityInput'
import {
  MdAddShoppingCart, MdArrowBack, MdAdd, MdRemove,
  MdCheckCircle, MdLocalShipping, MdSupportAgent
} from 'react-icons/md'
import { FaWhatsapp } from 'react-icons/fa'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addItem, updateQuantity, items } = useCartStore()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [qty, setQty] = useState(1)

  const cartItem = items.find(i => i._id === id)
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
      <Helmet>
        <title>{product.name} – Loknath Solution</title>
        <meta name="description" content={product.description} />
      </Helmet>

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
                onError={e => e.target.src = 'https://via.placeholder.com/600x600?text=No+Image'}
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
            <div className="mt-3 flex items-center gap-2">
              {product.stock > 0 ? (
                <>
                  <MdCheckCircle className="text-brand-500" />
                  <span className="text-sm text-brand-600 dark:text-brand-400 font-medium">
                    In Stock {product.stock <= 10 && `(Only ${product.stock} left)`}
                  </span>
                </>
              ) : (
                <span className="text-sm text-red-500 font-medium">❌ Out of Stock</span>
              )}
            </div>

            <p className="text-slate-600 dark:text-slate-400 mt-5 leading-relaxed text-sm">
              {product.description}
            </p>

            {/* Quantity */}
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
            <div className="flex flex-col sm:flex-row gap-3 mt-8">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="btn-primary flex-1 justify-center py-4 text-base"
              >
                <MdAddShoppingCart className="text-xl" />
                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
              <a
                href={`https://wa.me/${wa}?text=Hi! I'm interested in: ${product.name} (₹${product.price})`}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-4 rounded-xl transition-all flex-1"
              >
                <FaWhatsapp className="text-xl" /> Order on WhatsApp
              </a>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-slate-100 dark:border-slate-700">
              {[
                { icon: MdLocalShipping, label: 'Free delivery for bulk orders' },
                { icon: MdCheckCircle, label: 'Quality guaranteed' },
                { icon: MdSupportAgent, label: '24/7 support available' },
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
    </>
  )
}