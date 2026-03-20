import { useState, useEffect } from 'react'
import { orderAPI } from '../../services/api'
import toast from 'react-hot-toast'
import { MdClose, MdShoppingBag, MdPhone, MdDelete } from 'react-icons/md'
import { FaWhatsapp } from 'react-icons/fa'

const STATUSES = ['pending', 'confirmed', 'processing', 'ready', 'delivered', 'cancelled']

const STATUS_STYLES = {
  pending:    'badge-yellow',
  confirmed:  'badge-blue',
  processing: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 badge',
  ready:      'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400 badge',
  delivered:  'badge-green',
  cancelled:  'badge-red'
}

export default function AdminOrders() {
  const [orders, setOrders]         = useState([])
  const [loading, setLoading]       = useState(true)
  const [statusFilter, setStatusFilter] = useState('')
  const [search, setSearch]         = useState('')
  const [page, setPage]             = useState(1)
  const [pages, setPages]           = useState(1)
  const [total, setTotal]           = useState(0)
  const [selected, setSelected]     = useState(null)
  const [newStatus, setNewStatus]   = useState('')
  const [adminNotes, setAdminNotes] = useState('')
  const [updating, setUpdating]     = useState(false)
  const [deleting, setDeleting]     = useState(false)

  const wa = import.meta.env.VITE_WHATSAPP_NUMBER || '919876543210'

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const params = { page, limit: 15 }
      if (statusFilter) params.status = statusFilter
      if (search.trim()) params.search = search.trim()
      const { data } = await orderAPI.getAll(params)
      setOrders(data.orders || [])
      setTotal(data.total || 0)
      setPages(data.pages || 1)
    } catch (err) {
      toast.error('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchOrders() }, [page, statusFilter])

  const openOrder = (order) => {
    setSelected(order)
    setNewStatus(order.status)
    setAdminNotes(order.adminNotes || '')
  }

  const handleUpdateStatus = async () => {
    if (!selected) return
    setUpdating(true)
    try {
      await orderAPI.updateStatus(selected._id, { status: newStatus, adminNotes })
      toast.success('Order status updated!')
      setSelected(null)
      fetchOrders()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update')
    } finally {
      setUpdating(false)
    }
  }

  const handleDelete = async () => {
    if (!selected) return
    if (!window.confirm(`Delete order #${selected._id.toString().slice(-8).toUpperCase()}? This cannot be undone.`)) return
    setDeleting(true)
    try {
      await orderAPI.deleteOrder(selected._id)
      toast.success('Order deleted')
      setSelected(null)
      fetchOrders()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete order')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div>
      {/* Header + Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-slate-900 dark:text-white">Orders</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">{total} total orders</p>
        </div>
        <div className="flex gap-2 sm:w-72">
          <input
            type="text"
            placeholder="Search by name or phone..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && fetchOrders()}
            className="input-field text-sm flex-1"
          />
          <button onClick={fetchOrders} className="btn-primary px-4 py-2 text-sm">Search</button>
        </div>
      </div>

      {/* Status filter tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {['', ...STATUSES].map(s => (
          <button key={s}
            onClick={() => { setStatusFilter(s); setPage(1) }}
            className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-semibold capitalize transition-all ${
              statusFilter === s
                ? 'bg-brand-600 text-white shadow-brand'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-brand-300'
            }`}>
            {s || 'All Orders'}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Customer</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300 hidden sm:table-cell">Items</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Total</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Status</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300 hidden md:table-cell">Date</th>
                <th className="text-right px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i}>
                    {Array(6).fill(0).map((_, j) => (
                      <td key={j} className="px-4 py-3"><div className="skeleton h-4 rounded-lg" /></td>
                    ))}
                  </tr>
                ))
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400">
                    <MdShoppingBag className="text-4xl mx-auto mb-2 opacity-30" />
                    No orders found
                  </td>
                </tr>
              ) : (
                orders.map(order => (
                  <tr key={order._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-900 dark:text-white">{order.customerName}</p>
                      <a href={`tel:+91${order.customerPhone}`} className="text-xs text-slate-400 hover:text-brand-600 flex items-center gap-1">
                        <MdPhone className="text-sm" /> {order.customerPhone}
                      </a>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell text-slate-500 dark:text-slate-400">
                      {order.items?.length || 0} item{(order.items?.length || 0) !== 1 ? 's' : ''}
                    </td>
                    <td className="px-4 py-3 font-bold text-brand-600 dark:text-brand-400">
                      ₹{order.totalAmount?.toLocaleString('en-IN')}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`${STATUS_STYLES[order.status] || 'badge'} text-xs capitalize`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-slate-500 dark:text-slate-400 text-xs">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => openOrder(order)}
                        className="px-3 py-1.5 text-xs font-semibold bg-slate-100 dark:bg-slate-700 hover:bg-brand-50 dark:hover:bg-brand-900/20 text-slate-700 dark:text-slate-300 hover:text-brand-600 rounded-lg transition-all">
                        Manage
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 dark:border-slate-700">
            <p className="text-sm text-slate-500">Page {page} of {pages}</p>
            <div className="flex gap-2">
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-600 text-sm disabled:opacity-40">← Prev</button>
              <button disabled={page === pages} onClick={() => setPage(p => p + 1)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-600 text-sm disabled:opacity-40">Next →</button>
            </div>
          </div>
        )}
      </div>

      {/* Order detail modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-lg my-6 shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-700">
              <h2 className="font-display font-bold text-slate-900 dark:text-white text-lg">Order Details</h2>
              <button onClick={() => setSelected(null)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500">
                <MdClose className="text-xl" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Customer info */}
              <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 space-y-2">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Customer</p>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">{selected.customerName}</p>
                <div className="flex gap-3">
                  <a href={`tel:+91${selected.customerPhone}`}
                    className="flex items-center gap-1 text-xs text-ocean-600 hover:underline">
                    <MdPhone /> {selected.customerPhone}
                  </a>
                  <a href={`https://wa.me/91${selected.customerPhone}?text=Hello ${selected.customerName}! Regarding your order at Loknath Solution.`}
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-green-600 hover:underline">
                    <FaWhatsapp /> WhatsApp
                  </a>
                </div>
                {selected.customerAddress && (
                  <p className="text-xs text-slate-500">📍 {selected.customerAddress}</p>
                )}
              </div>

              {/* Items */}
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Items</p>
                <div className="space-y-2">
                  {selected.items?.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm">
                      <img src={item.image} alt={item.name}
                        className="w-10 h-10 rounded-lg object-cover bg-slate-100"
                        onError={e => e.target.src = 'https://placehold.co/40x40'} />
                      <div className="flex-1">
                        <p className="text-slate-900 dark:text-white font-medium line-clamp-1">{item.name}</p>
                        <p className="text-slate-400 text-xs">Qty: {item.quantity} × ₹{item.price}</p>
                      </div>
                      <p className="font-bold text-brand-600">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between font-bold mt-3 pt-3 border-t border-slate-100 dark:border-slate-700">
                  <span className="text-slate-900 dark:text-white">Total</span>
                  <span className="text-brand-600 dark:text-brand-400">₹{selected.totalAmount?.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {selected.notes && (
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Customer Notes</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-700/50 rounded-xl p-3">{selected.notes}</p>
                </div>
              )}

              {/* Update status */}
              <div className="space-y-3">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Update Status</p>
                <select value={newStatus} onChange={e => setNewStatus(e.target.value)} className="input-field capitalize">
                  {STATUSES.map(s => <option key={s} value={s} className="capitalize">{s}</option>)}
                </select>
                <textarea rows={2} placeholder="Admin notes (optional)"
                  value={adminNotes} onChange={e => setAdminNotes(e.target.value)}
                  className="input-field resize-none" />
              </div>

              <button onClick={handleUpdateStatus} disabled={updating} className="btn-primary w-full justify-center py-3.5">
                {updating
                  ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Updating...</span>
                  : 'Update Order Status'
                }
              </button>

              {/* Delete */}
              <div className="border-t border-slate-100 dark:border-slate-700 pt-4">
                <p className="text-xs text-slate-400 mb-3">⚠️ Danger zone — this cannot be undone</p>
                <button onClick={handleDelete} disabled={deleting}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-red-200 dark:border-red-800 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl text-sm font-semibold transition-all disabled:opacity-50">
                  {deleting
                    ? <><span className="w-4 h-4 border-2 border-red-300 border-t-red-500 rounded-full animate-spin" /> Deleting...</>
                    : <><MdDelete className="text-lg" /> Delete This Order</>
                  }
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}