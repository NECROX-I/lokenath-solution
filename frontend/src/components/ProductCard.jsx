import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MdAddShoppingCart } from 'react-icons/md'
import { FaWhatsapp } from 'react-icons/fa'
import { useCartStore } from '../store'
import toast from 'react-hot-toast'

const WA = import.meta.env.VITE_WHATSAPP_NUMBER || '919876543210'

export default function ProductCard({ product }) {
  const { addItem } = useCartStore()

  const handleAdd = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (product.stock === 0) { toast.error('Out of stock'); return }
    addItem(product)
    toast.success('Added to cart! 🛒')
  }

  const waMsg = `Hello! I'm interested in *${product.name}* (₹${product.price}). Is it available?`

  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      className="card group flex flex-col overflow-hidden active:shadow-lg"
    >
      {/* Image */}
      <Link to={`/products/${product._id}`} className="block relative">
        <div className="aspect-square bg-slate-50 dark:bg-slate-700 overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={e => e.target.src = 'https://placehold.co/300x300/e2e8f0/64748b?text=?'}
          />
        </div>

        {/* Top badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.featured && (
            <span className="bg-amber-400 text-amber-900 text-[10px] font-bold px-1.5 py-0.5 rounded-md">⭐ Featured</span>
          )}
          {product.stock === 0 && (
            <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">Sold Out</span>
          )}
          {product.stock > 0 && product.stock <= 5 && (
            <span className="bg-orange-400 text-orange-900 text-[10px] font-bold px-1.5 py-0.5 rounded-md">Only {product.stock} left!</span>
          )}
        </div>

        <span className={`absolute top-2 right-2 text-[10px] font-bold px-1.5 py-0.5 rounded-md capitalize ${
          product.category === 'stationery'
            ? 'bg-ocean-100 text-ocean-700 dark:bg-ocean-900/40 dark:text-ocean-300'
            : 'bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300'
        }`}>
          {product.category}
        </span>
      </Link>

      {/* Info */}
      <div className="p-3 flex flex-col flex-1">
        <Link to={`/products/${product._id}`}>
          <h3 className="font-semibold text-slate-800 dark:text-white text-sm line-clamp-2 leading-snug mb-1">
            {product.name}
          </h3>
        </Link>

        {/* Price + Add to cart */}
        <div className="mt-auto pt-2 flex items-center justify-between gap-2">
          <span className="text-base font-bold font-display text-brand-600 dark:text-brand-400">
            ₹{product.price.toLocaleString('en-IN')}
          </span>
          <button
            onClick={handleAdd}
            disabled={product.stock === 0}
            className="flex items-center gap-1 bg-brand-600 hover:bg-brand-700 active:bg-brand-800 disabled:bg-slate-200 dark:disabled:bg-slate-700 disabled:cursor-not-allowed text-white disabled:text-slate-400 text-xs font-bold px-3 py-2.5 rounded-xl transition-all min-w-[72px] justify-center"
          >
            <MdAddShoppingCart className="text-base flex-shrink-0" />
            {product.stock === 0 ? 'Sold Out' : 'Add'}
          </button>
        </div>

        {/* WhatsApp inquiry */}
        <a
          href={`https://wa.me/${WA}?text=${encodeURIComponent(waMsg)}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={e => e.stopPropagation()}
          className="flex items-center justify-center gap-1.5 mt-2 w-full text-xs font-semibold text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 active:bg-green-100 border border-green-200 dark:border-green-800/60 py-2.5 rounded-xl transition-all"
        >
          <FaWhatsapp className="text-sm" /> Ask on WhatsApp
        </a>
      </div>
    </motion.div>
  )
}