import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MdAddShoppingCart, MdVisibility } from 'react-icons/md'
import { FaWhatsapp } from 'react-icons/fa'
import { useCartStore } from '../store'
import toast from 'react-hot-toast'

const WA = import.meta.env.VITE_WHATSAPP_NUMBER || '919876543210'

export default function ProductCard({ product }) {
  const { addItem } = useCartStore()

  const handleAdd = (e) => {
    e.preventDefault()
    if (product.stock === 0) { toast.error('This product is out of stock'); return }
    addItem(product)
    toast.success(`Added to cart!`, { icon: '🛒' })
  }

  const waMsg = `Hello! I'm interested in *${product.name}* priced at ₹${product.price}. Is it available?`

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="card group flex flex-col"
    >
      {/* Image */}
      <Link to={`/products/${product._id}`} className="block relative overflow-hidden">
        <div className="aspect-square bg-slate-50 dark:bg-slate-700 overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={e => e.target.src = 'https://placehold.co/300x300/e2e8f0/64748b?text=No+Image'}
          />
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.featured && (
            <span className="badge bg-amber-400 text-amber-900 text-xs font-bold px-2 py-0.5">⭐ Featured</span>
          )}
          {product.stock === 0 && (
            <span className="badge bg-red-500 text-white text-xs font-bold px-2 py-0.5">Out of Stock</span>
          )}
          {product.stock > 0 && product.stock <= 5 && (
            <span className="badge bg-orange-400 text-orange-900 text-xs font-bold px-2 py-0.5">Only {product.stock} left!</span>
          )}
        </div>

        <span className={`absolute top-3 right-3 badge text-xs font-semibold capitalize ${
          product.category === 'stationery' ? 'badge-blue' : 'badge-green'
        }`}>
          {product.category}
        </span>

        {/* Quick view overlay */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <span className="bg-white text-slate-800 text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-lg">
            <MdVisibility className="text-sm" /> Quick View
          </span>
        </div>
      </Link>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        <Link to={`/products/${product._id}`}>
          <h3 className="font-semibold text-slate-800 dark:text-white text-sm line-clamp-2 leading-snug hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
            {product.name}
          </h3>
        </Link>

        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        {/* Price row */}
        <div className="mt-auto pt-3">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div>
              <p className="text-lg font-bold font-display text-brand-600 dark:text-brand-400">
                ₹{product.price.toLocaleString('en-IN')}
              </p>
              {product.soldCount > 0 && (
                <p className="text-xs text-slate-400">{product.soldCount} sold</p>
              )}
            </div>
            <button
              onClick={handleAdd}
              disabled={product.stock === 0}
              className="flex items-center gap-1.5 bg-brand-600 hover:bg-brand-700 disabled:bg-slate-200 dark:disabled:bg-slate-700 disabled:cursor-not-allowed text-white disabled:text-slate-400 text-xs font-semibold px-3 py-2 rounded-xl transition-all hover:shadow-brand hover:-translate-y-0.5 active:translate-y-0"
            >
              <MdAddShoppingCart className="text-sm" />
              {product.stock === 0 ? 'Sold Out' : 'Add'}
            </button>
          </div>

          {/* WhatsApp inquiry button */}
          <a
            href={`https://wa.me/${WA}?text=${encodeURIComponent(waMsg)}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            className="flex items-center justify-center gap-1.5 w-full text-xs font-semibold text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 border border-green-200 dark:border-green-800 py-2 rounded-xl transition-all"
          >
            <FaWhatsapp className="text-sm" /> Ask on WhatsApp
          </a>
        </div>
      </div>
    </motion.div>
  )
}