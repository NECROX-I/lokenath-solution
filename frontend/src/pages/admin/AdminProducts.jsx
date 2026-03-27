import { useState, useEffect, useRef } from 'react'
import SEO from '../../components/SEO'
import { productAPI } from '../../services/api'
import toast from 'react-hot-toast'
import {
  MdAdd, MdEdit, MdDelete, MdSearch, MdClose, MdImage,
  MdInventory, MdCheckCircle, MdLink, MdUpload, MdWarning
} from 'react-icons/md'

const EMPTY_FORM = {
  name: '', price: '', category: 'stationery', description: '',
  stock: '', featured: false, isActive: true, imageUrl: ''
}

// Free placeholder images for testing without Cloudinary
const PLACEHOLDER_IMAGES = {
  stationery: [
    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400',
    'https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=400',
    'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400',
  ],
  toys: [
    'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400',
    'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400',
    'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=400',
  ]
}

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [imageMode, setImageMode] = useState('url') // 'url' | 'upload'
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(null)
  const fileRef = useRef()

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const params = { page, limit: 10 }
      if (category !== 'all') params.category = category
      if (search.trim()) params.search = search.trim()
      const { data } = await productAPI.getAll(params)
      setProducts(data.products)
      setTotal(data.total)
      setPages(data.pages)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchProducts() }, [page, category])

  const openCreate = () => {
    setEditing(null)
    setForm(EMPTY_FORM)
    setImageFile(null)
    setImagePreview('')
    setImageMode('url')
    setModal(true)
  }

  const openEdit = (p) => {
    setEditing(p)
    setForm({
      name: p.name, price: p.price, category: p.category,
      description: p.description, stock: p.stock,
      featured: p.featured, isActive: p.isActive,
      imageUrl: p.image || ''
    })
    setImagePreview(p.image || '')
    setImageFile(null)
    setImageMode('url')
    setModal(true)
  }

  const closeModal = () => {
    setModal(false); setEditing(null)
    setForm(EMPTY_FORM); setImageFile(null)
    setImagePreview(''); setImageMode('url')
  }

  const handleImageFile = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { toast.error('Image must be under 5MB'); return }
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const handleUrlChange = (url) => {
    setForm(f => ({ ...f, imageUrl: url }))
    setImagePreview(url)
  }

  const useQuickImage = (url) => {
    setForm(f => ({ ...f, imageUrl: url }))
    setImagePreview(url)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.price || !form.category || !form.description || form.stock === '') {
      toast.error('Please fill all required fields'); return
    }
    setSaving(true)
    try {
      const fd = new FormData()
      fd.append('name', form.name)
      fd.append('price', form.price)
      fd.append('category', form.category)
      fd.append('description', form.description)
      fd.append('stock', form.stock)
      fd.append('featured', form.featured)
      fd.append('isActive', form.isActive)

      if (imageMode === 'upload' && imageFile) {
        fd.append('image', imageFile)
      } else if (form.imageUrl) {
        fd.append('imageUrl', form.imageUrl)
      }

      if (editing) {
        await productAPI.update(editing._id, fd)
        toast.success('Product updated!')
      } else {
        await productAPI.create(fd)
        toast.success('Product created!')
      }
      closeModal()
      fetchProducts()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save product')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return
    setDeleting(id)
    try {
      await productAPI.delete(id)
      toast.success('Product deleted')
      fetchProducts()
    } catch {
      toast.error('Failed to delete')
    } finally {
      setDeleting(null)
    }
  }

  return (
    <>
      <SEO title="Admin" description="." noIndex={true} />
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-slate-900 dark:text-white">Products</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">{total} total products</p>
        </div>
        <button onClick={openCreate} className="btn-primary">
          <MdAdd className="text-xl" /> Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="card p-4 mb-6 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text" placeholder="Search products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && fetchProducts()}
            className="input-field pl-9"
          />
        </div>
        <select value={category} onChange={e => { setCategory(e.target.value); setPage(1) }}
          className="input-field sm:w-44">
          <option value="all">All Categories</option>
          <option value="stationery">Stationery</option>
          <option value="toys">Toys</option>
        </select>
        <button onClick={fetchProducts} className="btn-primary px-5">Search</button>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Product</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300 hidden sm:table-cell">Category</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Price</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300 hidden md:table-cell">Stock</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300 hidden lg:table-cell">Status</th>
                <th className="text-right px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i}>{Array(6).fill(0).map((_, j) => (
                    <td key={j} className="px-4 py-3"><div className="skeleton h-4 rounded-lg" /></td>
                  ))}</tr>
                ))
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400">
                    <MdInventory className="text-4xl mx-auto mb-2 opacity-30" />
                    No products found
                  </td>
                </tr>
              ) : (
                products.map(p => (
                  <tr key={p._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={p.image} alt={p.name}
                          className="w-10 h-10 rounded-lg object-cover bg-slate-100 flex-shrink-0"
                          onError={e => e.target.src = 'https://placehold.co/40x40/e2e8f0/64748b?text=No'} />
                        <div className="min-w-0">
                          <p className="font-medium text-slate-900 dark:text-white line-clamp-1">{p.name}</p>
                          {p.featured && <span className="badge-yellow badge text-xs">⭐ Featured</span>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className={`badge capitalize text-xs ${p.category === 'stationery' ? 'badge-blue' : 'badge-green'}`}>{p.category}</span>
                    </td>
                    <td className="px-4 py-3 font-bold text-brand-600 dark:text-brand-400">₹{p.price?.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className={`font-medium ${p.stock === 0 ? 'text-red-500' : p.stock <= 5 ? 'text-amber-500' : 'text-slate-700 dark:text-slate-300'}`}>{p.stock}</span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className={`badge text-xs ${p.isActive ? 'badge-green' : 'badge-red'}`}>{p.isActive ? 'Active' : 'Inactive'}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEdit(p)}
                          className="p-2 rounded-lg text-ocean-600 hover:bg-ocean-50 dark:hover:bg-ocean-900/20 transition-all">
                          <MdEdit className="text-lg" />
                        </button>
                        <button onClick={() => handleDelete(p._id)} disabled={deleting === p._id}
                          className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all disabled:opacity-40">
                          <MdDelete className="text-lg" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {pages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 dark:border-slate-700">
            <p className="text-sm text-slate-500">Page {page} of {pages}</p>
            <div className="flex gap-2">
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-600 text-sm disabled:opacity-40 hover:border-brand-400 transition-all">← Prev</button>
              <button disabled={page === pages} onClick={() => setPage(p => p + 1)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-600 text-sm disabled:opacity-40 hover:border-brand-400 transition-all">Next →</button>
            </div>
          </div>
        )}
      </div>

      {/* ── Add / Edit Modal ── */}
      {modal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-2xl my-6 shadow-2xl">

            {/* Modal header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-700">
              <h2 className="text-lg font-display font-bold text-slate-900 dark:text-white">
                {editing ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button onClick={closeModal} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500">
                <MdClose className="text-xl" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">

              {/* ── Image Section ── */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Product Image
                </label>

                {/* Toggle URL / Upload */}
                <div className="flex gap-2 mb-3">
                  <button type="button"
                    onClick={() => setImageMode('url')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                      imageMode === 'url'
                        ? 'bg-brand-600 text-white border-brand-600'
                        : 'border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:border-brand-400'
                    }`}>
                    <MdLink /> Paste URL
                  </button>
                  <button type="button"
                    onClick={() => setImageMode('upload')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                      imageMode === 'upload'
                        ? 'bg-brand-600 text-white border-brand-600'
                        : 'border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:border-brand-400'
                    }`}>
                    <MdUpload /> Upload File
                  </button>
                </div>

                {/* URL input */}
                {imageMode === 'url' && (
                  <div className="space-y-2">
                    <input
                      type="url"
                      placeholder="https://example.com/image.jpg"
                      value={form.imageUrl}
                      onChange={e => handleUrlChange(e.target.value)}
                      className="input-field"
                    />
                    {/* Quick pick images */}
                    <p className="text-xs text-slate-400">Quick pick (click to use):</p>
                    <div className="flex gap-2 flex-wrap">
                      {(PLACEHOLDER_IMAGES[form.category] || PLACEHOLDER_IMAGES.stationery).map((url, i) => (
                        <img key={i} src={url} alt={`option ${i+1}`}
                          onClick={() => useQuickImage(url)}
                          className={`w-14 h-14 object-cover rounded-lg cursor-pointer border-2 transition-all hover:scale-105 ${
                            form.imageUrl === url ? 'border-brand-500 shadow-brand' : 'border-slate-200 dark:border-slate-600'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* File upload */}
                {imageMode === 'upload' && (
                  <div>
                    <div
                      onClick={() => fileRef.current?.click()}
                      className="border-2 border-dashed border-slate-200 dark:border-slate-600 rounded-xl p-4 text-center cursor-pointer hover:border-brand-400 transition-all group"
                    >
                      {imagePreview && imageMode === 'upload' && imageFile ? (
                        <img src={imagePreview} alt="Preview"
                          className="w-32 h-32 object-cover rounded-xl mx-auto" />
                      ) : (
                        <div className="py-4">
                          <MdImage className="text-4xl text-slate-300 mx-auto mb-2 group-hover:text-brand-400 transition-colors" />
                          <p className="text-sm text-slate-400">Click to choose image (max 5MB)</p>
                        </div>
                      )}
                    </div>
                    <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageFile} />

                    {/* Cloudinary warning */}
                    <div className="mt-2 flex items-start gap-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg px-3 py-2">
                      <MdWarning className="text-amber-500 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-amber-700 dark:text-amber-400">
                        File upload requires Cloudinary setup. Add <code className="font-mono bg-amber-100 dark:bg-amber-900/40 px-1 rounded">CLOUDINARY_CLOUD_NAME</code>, <code className="font-mono bg-amber-100 dark:bg-amber-900/40 px-1 rounded">CLOUDINARY_API_KEY</code>, and <code className="font-mono bg-amber-100 dark:bg-amber-900/40 px-1 rounded">CLOUDINARY_API_SECRET</code> to your <code className="font-mono bg-amber-100 dark:bg-amber-900/40 px-1 rounded">.env</code> file. Until then, use the <strong>Paste URL</strong> option.
                      </p>
                    </div>
                  </div>
                )}

                {/* Preview */}
                {imagePreview && (
                  <div className="mt-3 flex items-center gap-3">
                    <img src={imagePreview} alt="Preview"
                      className="w-16 h-16 object-cover rounded-xl border border-slate-200 dark:border-slate-600"
                      onError={e => { e.target.style.display = 'none' }} />
                    <p className="text-xs text-slate-400">Image preview</p>
                  </div>
                )}
              </div>

              {/* ── Form fields ── */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Product Name *</label>
                  <input type="text" placeholder="e.g. Classmate Notebook 200 Pages"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    className="input-field" required />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Price (₹) *</label>
                  <input type="number" placeholder="0" value={form.price} min="0"
                    onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                    className="input-field" required />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Stock Quantity *</label>
                  <input type="number" placeholder="0" value={form.stock} min="0"
                    onChange={e => setForm(f => ({ ...f, stock: e.target.value }))}
                    className="input-field" required />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Category *</label>
                  <select value={form.category}
                    onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                    className="input-field">
                    <option value="stationery">Stationery</option>
                    <option value="toys">Toys</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Status</label>
                  <select value={form.isActive}
                    onChange={e => setForm(f => ({ ...f, isActive: e.target.value === 'true' }))}
                    className="input-field">
                    <option value="true">Active (visible on site)</option>
                    <option value="false">Inactive (hidden)</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Description *</label>
                  <textarea rows={3} placeholder="Describe the product..."
                    value={form.description}
                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    className="input-field resize-none" required />
                </div>

                <div className="sm:col-span-2 flex items-center gap-3">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={form.featured}
                      onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))}
                      className="sr-only peer" />
                    <div className="w-10 h-5 bg-slate-200 dark:bg-slate-600 rounded-full peer peer-checked:bg-brand-600 transition-all after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5" />
                  </label>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">⭐ Mark as Featured (shows on homepage)</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={closeModal}
                  className="flex-1 px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="btn-primary flex-1 justify-center py-3">
                  {saving
                    ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving...</span>
                    : <><MdCheckCircle />{editing ? 'Update Product' : 'Create Product'}</>
                  }
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
    </>
  )
}