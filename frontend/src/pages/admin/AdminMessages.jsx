import { useState, useEffect } from 'react'
import SEO from '../../components/SEO'
import { contactAPI } from '../../services/api'
import toast from 'react-hot-toast'
import { MdClose, MdMarkEmailRead, MdDelete, MdMessage, MdPhone, MdEmail } from 'react-icons/md'

export default function AdminMessages() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [selected, setSelected] = useState(null)

  const fetchMessages = async () => {
    setLoading(true)
    try {
      const params = { page, limit: 15 }
      if (filter !== '') params.isRead = filter
      const { data } = await contactAPI.getAll(params)
      setMessages(data.messages)
      setTotal(data.total)
      setPages(data.pages)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchMessages() }, [page, filter])

  const handleMarkRead = async (id, e) => {
    e?.stopPropagation()
    try {
      await contactAPI.markRead(id)
      setMessages(msgs => msgs.map(m => m._id === id ? { ...m, isRead: true } : m))
      if (selected?._id === id) setSelected(s => ({ ...s, isRead: true }))
      toast.success('Marked as read')
    } catch {
      toast.error('Failed to update')
    }
  }

  const handleDelete = async (id, e) => {
    e?.stopPropagation()
    if (!window.confirm('Delete this message?')) return
    try {
      await contactAPI.delete(id)
      toast.success('Message deleted')
      if (selected?._id === id) setSelected(null)
      fetchMessages()
    } catch {
      toast.error('Failed to delete')
    }
  }

  const openMessage = async (msg) => {
    setSelected(msg)
    if (!msg.isRead) handleMarkRead(msg._id)
  }

  return (
    <>
      <SEO title="Admin" description="." noIndex={true} />
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-slate-900 dark:text-white">Messages</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">{total} total messages</p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6">
        {[
          { val: '', label: 'All Messages' },
          { val: 'false', label: '📬 Unread' },
          { val: 'true', label: '✅ Read' },
        ].map(({ val, label }) => (
          <button key={val}
            onClick={() => { setFilter(val); setPage(1) }}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              filter === val
                ? 'bg-brand-600 text-white'
                : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-brand-300'
            }`}>{label}</button>
        ))}
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300 w-2" />
                <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">From</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Subject</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300 hidden md:table-cell">Date</th>
                <th className="text-right px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i}>{Array(5).fill(0).map((_, j) => (
                    <td key={j} className="px-4 py-3"><div className="skeleton h-4 rounded-lg" /></td>
                  ))}</tr>
                ))
              ) : messages.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-slate-400">
                    <MdMessage className="text-4xl mx-auto mb-2 opacity-30" />
                    No messages found
                  </td>
                </tr>
              ) : (
                messages.map(msg => (
                  <tr
                    key={msg._id}
                    onClick={() => openMessage(msg)}
                    className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer ${!msg.isRead ? 'bg-brand-50/50 dark:bg-brand-900/10' : ''}`}
                  >
                    <td className="px-4 py-3 w-2">
                      {!msg.isRead && <div className="w-2 h-2 rounded-full bg-brand-500" />}
                    </td>
                    <td className="px-4 py-3">
                      <p className={`${!msg.isRead ? 'font-bold' : 'font-medium'} text-slate-900 dark:text-white`}>{msg.name}</p>
                      <p className="text-xs text-slate-400">{msg.email}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className={`${!msg.isRead ? 'font-semibold' : ''} text-slate-700 dark:text-slate-300 line-clamp-1`}>{msg.subject}</p>
                      <p className="text-xs text-slate-400 line-clamp-1">{msg.message}</p>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-xs text-slate-400">
                      {new Date(msg.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </td>
                    <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1">
                        {!msg.isRead && (
                          <button onClick={(e) => handleMarkRead(msg._id, e)}
                            title="Mark as read"
                            className="p-2 rounded-lg text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-all">
                            <MdMarkEmailRead className="text-lg" />
                          </button>
                        )}
                        <button onClick={(e) => handleDelete(msg._id, e)}
                          title="Delete"
                          className="p-2 rounded-lg text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all">
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
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-600 text-sm disabled:opacity-40">← Prev</button>
              <button disabled={page === pages} onClick={() => setPage(p => p + 1)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-600 text-sm disabled:opacity-40">Next →</button>
            </div>
          </div>
        )}
      </div>

      {/* Message detail modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-lg my-6 shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-700">
              <h2 className="font-display font-bold text-slate-900 dark:text-white truncate pr-4">{selected.subject}</h2>
              <button onClick={() => setSelected(null)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 flex-shrink-0">
                <MdClose className="text-xl" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 space-y-2">
                <p className="text-sm font-bold text-slate-900 dark:text-white">{selected.name}</p>
                <div className="flex flex-wrap gap-3">
                  <a href={`mailto:${selected.email}`} className="flex items-center gap-1 text-xs text-ocean-600 hover:underline">
                    <MdEmail /> {selected.email}
                  </a>
                  {selected.phone && (
                    <a href={`tel:+91${selected.phone}`} className="flex items-center gap-1 text-xs text-brand-600 hover:underline">
                      <MdPhone /> {selected.phone}
                    </a>
                  )}
                </div>
                <p className="text-xs text-slate-400">
                  {new Date(selected.createdAt).toLocaleString('en-IN', { dateStyle: 'long', timeStyle: 'short' })}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Message</p>
                <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4">
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">{selected.message}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <a href={`mailto:${selected.email}?subject=Re: ${selected.subject}`}
                  className="btn-primary flex-1 justify-center">
                  <MdEmail /> Reply via Email
                </a>
                <button onClick={() => handleDelete(selected._id)}
                  className="px-4 py-3 border border-red-200 dark:border-red-800 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl text-sm font-semibold transition-all flex items-center gap-2">
                  <MdDelete /> Delete
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