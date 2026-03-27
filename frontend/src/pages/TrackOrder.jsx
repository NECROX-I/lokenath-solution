import { useState } from 'react'
import SEO from '../components/SEO'
import { motion } from 'framer-motion'
import { orderAPI, serviceRequestAPI } from '../services/api'
import {

MdSearch, MdShoppingBag, MdMiscellaneousServices,
MdPhone, MdRefresh, MdClose
} from 'react-icons/md'

export default function TrackOrder() {
const [tab, setTab] = useState('order')
const [phone, setPhone] = useState('')
const [orderId, setOrderId] = useState('')
const [results, setResults] = useState(null)
const [loading, setLoading] = useState(false)
const [error, setError] = useState('')
const [searched, setSearched] = useState(false)
const [cancelingId, setCancelingId] = useState(null)

const handleTrack = async (e) => {
  e.preventDefault()
  setError('')
  setResults(null)

  if (tab === 'order') {
    if (!phone && !orderId) {
      setError('Enter phone number or order ID')
      return
    }
    if (phone && !/^[6-9]\d{9}$/.test(phone)) {
      setError('Enter valid 10-digit phone number')
      return
    }
  }

  if (tab === 'service') {
    if (!phone) {
      setError('Enter your phone number')
      return
    }
    if (!/^[6-9]\d{9}$/.test(phone)) {
      setError('Enter valid 10-digit phone number')
      return
    }
  }

  setLoading(true)
  setSearched(true)

  try {
    if (tab === 'order') {
      const params = orderId ? { orderId } : { phone }
      const { data } = await orderAPI.trackByPhone(params)
      setResults(data.orders || data.data || [])
    } else {
      const { data } = await serviceRequestAPI.trackByPhone({ phone })
      setResults(data.requests || data.data || [])
    }
  } catch (err) {
    setError(err.response?.data?.message || 'No records found')
    setResults([])
  } finally {
    setLoading(false)
  }
}

const handleCancelOrder = async (id) => {
  const confirmCancel = window.confirm('Are you sure you want to cancel this order?')
  if (!confirmCancel) return

  setCancelingId(id)
  try {
    await orderAPI.cancelOrder(id, { phone })
    setResults(prev =>
      prev.map(o =>
        o._id === id ? { ...o, status: 'cancelled' } : o
      )
    )
  } catch (err) {
    setError(err.response?.data?.message || 'Failed to cancel order')
  } finally {
    setCancelingId(null)
  }
}

const handleClear = () => {
  setPhone('')
  setOrderId('')
  setResults(null)
  setError('')
  setSearched(false)
}

return (
  <>
    <SEO title="Track Your Order" />

    <div className="page-container py-12 max-w-2xl">
      {/* Tabs */}
      <div className="flex gap-2 mb-6 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl">
        <button
          onClick={() => {
            setTab('order')
            handleClear()
          }}
          className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-colors ${
            tab === 'order'
              ? 'bg-white dark:bg-slate-700 text-brand-600 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <MdShoppingBag className="inline mr-1" />
          Track Order
        </button>

        <button
          onClick={() => {
            setTab('service')
            handleClear()
          }}
          className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-colors ${
            tab === 'service'
              ? 'bg-white dark:bg-slate-700 text-ocean-600 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <MdMiscellaneousServices className="inline mr-1" />
          Track Service
        </button>
      </div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-6 mb-6"
      >
        <form onSubmit={handleTrack} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">
              <MdPhone className="inline mr-1 text-brand-500" />
              Phone / Order ID
            </label>

            <input
              type="text"
              placeholder="9876543210 or ORD123"
              value={phone || orderId}
              maxLength={24}
              onChange={e => {
                const value = e.target.value.toUpperCase()

                if (/^[0-9]*$/.test(value)) {
                  setPhone(value.slice(0, 10))
                  setOrderId('')
                } else {
                  setOrderId(value)
                  setPhone('')
                }
              }}
              className="input-field"
            />
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-500 text-sm flex items-center gap-2"
            >
              <MdClose className="text-lg" />
              {error}
            </motion.p>
          )}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-brand-600 hover:bg-brand-700 disabled:bg-brand-400 text-white py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="animate-spin">⟳</span>
                  Searching...
                </>
              ) : (
                <>
                  <MdSearch /> Track
                </>
              )}
            </button>

            {searched && (
              <button
                onClick={handleClear}
                type="button"
                className="px-4 border border-slate-300 dark:border-slate-600 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                title="Clear"
              >
                <MdRefresh />
              </button>
            )}
          </div>
        </form>
      </motion.div>

      {/* Results */}
      {results !== null && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {results.length === 0 ? (
            <div className="card p-8 text-center text-slate-500">
              <p className="text-lg">No results found</p>
              <p className="text-sm mt-1">Try searching with different details</p>
            </div>
          ) : (
            <>
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                {results.length} result{results.length !== 1 ? 's' : ''} found
              </p>

              {/* Orders */}
              {tab === 'order' &&
                results.map(order => {
                  const canCancel = ['pending', 'confirmed'].includes(order.status)
                  const isCanceling = cancelingId === order._id

                  return (
                    <motion.div
                      key={order._id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="card p-4 space-y-3 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start">
                        <p className="font-semibold text-brand-600">
                          ORD-{order._id.slice(-8).toUpperCase()}
                        </p>
                        <span
                          className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                            order.status === 'cancelled'
                              ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200'
                              : order.status === 'delivered'
                              ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200'
                              : 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                          }`}
                        >
                          {order.status.toUpperCase()}
                        </span>
                      </div>

                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Amount: <span className="font-semibold text-slate-900 dark:text-white">₹{order.totalAmount}</span>
                      </p>

                      <p className="text-xs text-slate-500">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </p>

                      {canCancel && (
                        <button
                          onClick={() => handleCancelOrder(order._id)}
                          disabled={isCanceling}
                          className="mt-3 w-full py-2 text-sm font-semibold text-red-600 border border-red-300 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          {isCanceling ? 'Canceling...' : 'Cancel Order'}
                        </button>
                      )}

                      {!canCancel && order.status !== 'cancelled' && (
                        <p className="text-xs text-slate-400 italic">
                          Cannot cancel at this stage
                        </p>
                      )}
                    </motion.div>
                  )
                })}

              {/* Services */}
              {tab === 'service' &&
                results.map(req => (
                  <motion.div
                    key={req._id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card p-4 hover:shadow-md transition-shadow"
                  >
                    <p className="font-semibold text-ocean-600">
                      REQ-{req._id.slice(-8).toUpperCase()}
                    </p>
                    <p className="text-sm mt-2">
                      Service: <span className="font-medium">{req.serviceType || 'N/A'}</span>
                    </p>
                    <p className="text-sm">
                      Status: <span className="font-medium capitalize">{req.status}</span>
                    </p>
                  </motion.div>
                ))}
            </>
          )}
        </motion.div>
      )}
    </div>
  </>
)
}