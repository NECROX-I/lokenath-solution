import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion, AnimatePresence } from 'framer-motion'
import { productAPI } from '../services/api'
import ProductCard from '../components/ProductCard'
import { ProductSkeleton } from '../components/Skeletons'
import { MdSearch, MdFilterList, MdClose } from 'react-icons/md'

const CATEGORIES = [
  { value: 'all', label: '🛍️ All Products' },
  { value: 'stationery', label: '✏️ Stationery' },
  { value: 'toys', label: '🧸 Toys' },
]

const SORTS = [
  { value: '-createdAt', label: 'Newest First' },
  { value: 'price', label: 'Price: Low to High' },
  { value: '-price', label: 'Price: High to Low' },
  { value: '-soldCount', label: 'Best Selling' },
]

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [pages, setPages] = useState(1)
  const [page, setPage] = useState(1)

  const category = searchParams.get('category') || 'all'
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [sort, setSort] = useState('-createdAt')

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const params = { page, limit: 12, sort }
      if (category !== 'all') params.category = category
      if (search.trim()) params.search = search.trim()

      const { data } = await productAPI.getAll(params)
      setProducts(data.products)
      setTotal(data.total)
      setPages(data.pages)
    } finally {
      setLoading(false)
    }
  }, [category, search, sort, page])

  useEffect(() => { fetchProducts() }, [fetchProducts])

  const handleSearch = (e) => {
    e.preventDefault()
    setPage(1)
    fetchProducts()
  }

  const setCategory = (cat) => {
    setSearchParams(cat === 'all' ? {} : { category: cat })
    setPage(1)
  }

  return (
    <>
      <Helmet>
        <title>Products – Lokennath Printing & Stationery</title>
        <meta name="description" content="Browse our wide range of stationery and educational toys." />
      </Helmet>

      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 py-12">
        <div className="page-container">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-white">Our Products</h1>
          <p className="text-slate-400 mt-2">Quality stationery and educational toys for everyone</p>
        </div>
      </div>

      <div className="page-container py-8">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 relative">
            <MdSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xl" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input-field pl-10 pr-10"
            />
            {search && (
              <button type="button" onClick={() => { setSearch(''); setPage(1) }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                <MdClose />
              </button>
            )}
          </form>

          {/* Sort */}
          <select
            value={sort}
            onChange={e => { setSort(e.target.value); setPage(1) }}
            className="input-field sm:w-52"
          >
            {SORTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat.value}
              onClick={() => setCategory(cat.value)}
              className={`flex-shrink-0 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                category === cat.value
                  ? 'bg-brand-600 text-white shadow-brand'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-brand-300'
              }`}
            >
              {cat.label}
            </button>
          ))}
          <div className="ml-auto flex-shrink-0 flex items-center text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap">
            <MdFilterList className="mr-1" /> {total} product{total !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {Array(8).fill(0).map((_, i) => <ProductSkeleton key={i} />)}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <span className="text-6xl block mb-4">🔍</span>
            <h3 className="text-xl font-display font-bold text-slate-900 dark:text-white mb-2">No products found</h3>
            <p className="text-slate-500">Try adjusting your search or filter</p>
            <button onClick={() => { setSearch(''); setCategory('all') }} className="btn-primary mt-4">
              Clear Filters
            </button>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={`${category}-${sort}-${page}`}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
            >
              {products.map((p, i) => (
                <motion.div key={p._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <ProductCard product={p} />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        {/* Pagination */}
        {pages > 1 && (
          <div className="flex justify-center gap-2 mt-10">
            <button
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm disabled:opacity-40 hover:border-brand-400 transition-all"
            >
              ← Prev
            </button>
            {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-10 h-10 rounded-xl text-sm font-semibold transition-all ${
                  page === p
                    ? 'bg-brand-600 text-white shadow-brand'
                    : 'border border-slate-200 dark:border-slate-700 hover:border-brand-400'
                }`}
              >
                {p}
              </button>
            ))}
            <button
              disabled={page === pages}
              onClick={() => setPage(p => p + 1)}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm disabled:opacity-40 hover:border-brand-400 transition-all"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </>
  )
}
