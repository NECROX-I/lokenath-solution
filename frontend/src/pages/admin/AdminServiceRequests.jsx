import { useState, useEffect } from 'react'
import SEO from '../../components/SEO'
import { serviceRequestAPI } from '../../services/api'
import toast from 'react-hot-toast'
import { MdClose, MdMiscellaneousServices, MdPhone, MdDelete } from 'react-icons/md'
import { FaWhatsapp } from 'react-icons/fa'

const STATUSES = ['new', 'in-progress', 'completed', 'cancelled']
const STATUS_STYLES = {
  new: 'badge-blue', 'in-progress': 'badge-yellow', completed: 'badge-green', cancelled: 'badge-red'
}

const SERVICE_LABELS = {
  'tax-payment': '🧾 Tax Payment',
  'money-transfer': '💸 Money Transfer',
  'government-schemes': '🏛️ Govt Schemes',
  'aadhaar-services': '🪪 Aadhaar',
  'voter-id': '🗳️ Voter ID',
  'ration-card': '🍚 Ration Card',
  'form-filling': '📝 Form Filling',
  'other': '📋 Other',
}

export default function AdminServiceRequests() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [selected, setSelected] = useState(null)
  const [newStatus, setNewStatus] = useState('')
  const [adminNotes, setAdminNotes] = useState('')
  const [updating, setUpdating] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [search, setSearch] = useState('')

  const fetchRequests = async () => {
    setLoading(true)
    try {
      const params = { page, limit: 15 }
      if (statusFilter) params.status = statusFilter
      if (search.trim()) params.search = search.trim()
      const { data } = await serviceRequestAPI.getAll(params)
      setRequests(data.requests)
      setTotal(data.total)
      setPages(data.pages)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchRequests() }, [page, statusFilter])

  const openRequest = (req) => {
    setSelected(req)
    setNewStatus(req.status)
    setAdminNotes(req.adminNotes || '')
  }

  const handleUpdate = async () => {
    setUpdating(true)
    try {
      await serviceRequestAPI.update(selected._id, { status: newStatus, adminNotes })
      toast.success('Request updated!')
      setSelected(null)
      fetchRequests()
    } catch {
      toast.error('Failed to update')
    } finally {
      setUpdating(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm(`Delete this service request from ${selected.name}? This cannot be undone.`)) return
    setDeleting(true)
    try {
      await serviceRequestAPI.deleteRequest(selected._id)
      toast.success('Request deleted')
      setSelected(null)
      fetchRequests()
    } catch {
      toast.error('Failed to delete request')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <>
      <SEO title="Admin" description="." noIndex={true} />
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-slate-900 dark:text-white">Service Requests</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">{total} total requests</p>
        </div>
        {/* Search */}
        <div className="flex gap-2 sm:w-72">
          <input
            type="text"
            placeholder="Search by name or phone..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && fetchRequests()}
            className="input-field text-sm flex-1"
          />
          <button onClick={fetchRequests} className="btn-secondary px-4 py-2 text-sm">Search</button>
        </div>
      </div>

      {/* Status tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {['', ...STATUSES].map(s => (
          <button key={s}
            onClick={() => { setStatusFilter(s); setPage(1) }}
            className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-semibold capitalize transition-all duration-200 ${
              statusFilter === s
                ? 'bg-ocean-600 text-white'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-ocean-300'
            }`}>
            {s ? s.replace('-', ' ') : 'All Requests'}
          </button>
        ))}
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Customer</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Service</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Status</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300 hidden md:table-cell">Date</th>
                <th className="text-right px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i}>{Array(5).fill(0).map((_, j) => (
                    <td key={j} className="px-4 py-3"><div className="skeleton h-4 rounded-lg" /></td>
                  ))}</tr>
                ))
              ) : requests.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-slate-400">
                    <MdMiscellaneousServices className="text-4xl mx-auto mb-2 opacity-30" />
                    No service requests found
                  </td>
                </tr>
              ) : (
                requests.map(req => (
                  <tr key={req._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-900 dark:text-white">{req.name}</p>
                      <a href={`tel:+91${req.phone}`} className="text-xs text-slate-400 hover:text-brand-600 flex items-center gap-1">
                        <MdPhone className="text-sm" /> {req.phone}
                      </a>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                        {SERVICE_LABELS[req.serviceType] || req.serviceType}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`${STATUS_STYLES[req.status] || 'badge'} text-xs capitalize`}>
                        {req.status?.replace('-', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-xs text-slate-400">
                      {new Date(req.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => openRequest(req)}
                        className="px-3 py-1.5 text-xs font-semibold bg-slate-100 dark:bg-slate-700 hover:bg-ocean-50 dark:hover:bg-ocean-900/20 text-slate-700 dark:text-slate-300 hover:text-ocean-600 rounded-lg transition-all">
                        View
                      </button>
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
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-600 text-sm disabled:opacity-40">← Prev</button>
              <button disabled={page === pages} onClick={() => setPage(p => p + 1)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-600 text-sm disabled:opacity-40">Next →</button>
            </div>
          </div>
        )}
      </div>

      {/* Detail modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-md my-6 shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-700">
              <h2 className="font-display font-bold text-slate-900 dark:text-white">Service Request Details</h2>
              <button onClick={() => setSelected(null)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500">
                <MdClose className="text-xl" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 space-y-2">
                <p className="text-sm font-bold text-slate-900 dark:text-white">{selected.name}</p>
                <div className="flex gap-3">
                  <a href={`tel:+91${selected.phone}`} className="flex items-center gap-1 text-xs text-ocean-600 hover:underline">
                    <MdPhone /> {selected.phone}
                  </a>
                  <a href={`https://wa.me/91${selected.phone}?text=Hello ${selected.name}! Regarding your ${SERVICE_LABELS[selected.serviceType]} request at Loknath Solution.`}
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-green-600 hover:underline">
                    <FaWhatsapp /> WhatsApp
                  </a>
                </div>
                {selected.email && <p className="text-xs text-slate-400">✉️ {selected.email}</p>}
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Service</p>
                <p className="text-sm font-medium text-slate-900 dark:text-white">{SERVICE_LABELS[selected.serviceType]}</p>
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Description</p>
                <p className="text-sm text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-700/50 rounded-xl p-3">
                  {selected.description}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Update Status</p>
                <select value={newStatus} onChange={e => setNewStatus(e.target.value)} className="input-field capitalize mb-2">
                  {STATUSES.map(s => <option key={s} value={s} className="capitalize">{s.replace('-', ' ')}</option>)}
                </select>
                <textarea rows={2} placeholder="Admin notes..." value={adminNotes}
                  onChange={e => setAdminNotes(e.target.value)} className="input-field resize-none" />
              </div>

              <button onClick={handleUpdate} disabled={updating} className="btn-secondary w-full justify-center py-3.5">
                {updating
                  ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Updating...</span>
                  : 'Update Request'
                }
              </button>

              {/* Delete */}
              <div className="border-t border-slate-100 dark:border-slate-700 pt-4">
                <p className="text-xs text-slate-400 mb-3">⚠️ Danger zone — this cannot be undone</p>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-red-200 dark:border-red-800 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl text-sm font-semibold transition-all disabled:opacity-50"
                >
                  {deleting
                    ? <><span className="w-4 h-4 border-2 border-red-300 border-t-red-500 rounded-full animate-spin" /> Deleting...</>
                    : <><MdDelete className="text-lg" /> Delete This Request</>
                  }
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  )
}