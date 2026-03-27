import { useState, useEffect } from 'react'
import SEO from '../../components/SEO'
import { Link } from 'react-router-dom'
import { adminAPI } from '../../services/api'
import { StatSkeleton } from '../../components/Skeletons'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts'
import {
  MdInventory, MdShoppingBag, MdMiscellaneousServices,
  MdMessage, MdTrendingUp, MdTrendingDown, MdPending, MdWarning
} from 'react-icons/md'

const STATUS_COLORS = {
  pending: '#f59e0b', confirmed: '#3b82f6', processing: '#8b5cf6',
  ready: '#06b6d4', delivered: '#10b981', cancelled: '#ef4444'
}

const PIE_COLORS = ['#0a925d', '#2563eb', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4', '#10b981']

export default function AdminDashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminAPI.stats()
      .then(r => setData(r.data))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div>
      <h1 className="text-2xl font-display font-bold text-slate-900 dark:text-white mb-6">Dashboard</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {Array(8).fill(0).map((_, i) => <StatSkeleton key={i} />)}
      </div>
    </div>
  )

  const { stats, charts, recent, topProducts, lowStockProducts } = data

  const statCards = [
    { label: 'Total Products', val: stats.totalProducts, icon: MdInventory, color: 'brand', note: 'Active listings' },
    { label: 'Total Orders', val: stats.totalOrders, icon: MdShoppingBag, color: 'ocean', note: `${stats.pendingOrders} pending` },
    { label: 'Service Requests', val: stats.totalServiceRequests, icon: MdMiscellaneousServices, color: 'purple', note: `${stats.newServiceRequests} new` },
    { label: 'Unread Messages', val: stats.unreadMessages, icon: MdMessage, color: 'amber', note: 'Needs attention' },
    { label: 'This Month Revenue', val: `₹${stats.thisMonthRevenue?.toLocaleString('en-IN') || 0}`, icon: MdTrendingUp, color: 'brand', note: `${stats.revenueGrowth > 0 ? '+' : ''}${stats.revenueGrowth}% vs last month` },
    { label: 'Monthly Orders', val: stats.thisMonthOrders, icon: MdShoppingBag, color: 'ocean', note: 'This month' },
    { label: 'Last Month Revenue', val: `₹${stats.lastMonthRevenue?.toLocaleString('en-IN') || 0}`, icon: MdTrendingDown, color: 'slate', note: 'Previous month' },
    { label: 'Pending Orders', val: stats.pendingOrders, icon: MdPending, color: 'amber', note: 'Awaiting confirmation' },
  ]

  const colorMap = {
    brand: 'bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400',
    ocean: 'bg-ocean-100 dark:bg-ocean-900/30 text-ocean-600 dark:text-ocean-400',
    purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
    amber: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
    slate: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400',
  }

  return (
    <>
      <SEO title="Admin" description="." noIndex={true} />
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display font-bold text-slate-900 dark:text-white">Dashboard</h1>
        <span className="text-sm text-slate-500 dark:text-slate-400">Overview of your business</span>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map(({ label, val, icon: Icon, color, note }) => (
          <div key={label} className="card p-5">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${colorMap[color]}`}>
              <Icon className="text-xl" />
            </div>
            <p className="text-2xl font-display font-bold text-slate-900 dark:text-white">{val}</p>
            <p className="text-xs font-medium text-slate-600 dark:text-slate-300 mt-0.5">{label}</p>
            {note && <p className="text-xs text-slate-400 mt-1">{note}</p>}
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Revenue chart */}
        <div className="card p-6 lg:col-span-2">
          <h2 className="font-display font-semibold text-slate-900 dark:text-white mb-4">Revenue – Last 7 Days</h2>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={charts.last7Days}>
              <defs>
                <linearGradient id="revenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0a925d" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#0a925d" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `₹${v}`} />
              <Tooltip formatter={v => [`₹${v.toLocaleString('en-IN')}`, 'Revenue']} />
              <Area type="monotone" dataKey="revenue" stroke="#0a925d" strokeWidth={2} fill="url(#revenue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Order status pie */}
        <div className="card p-6">
          <h2 className="font-display font-semibold text-slate-900 dark:text-white mb-4">Orders by Status</h2>
          {charts.ordersByStatus?.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={charts.ordersByStatus} dataKey="count" nameKey="_id" cx="50%" cy="50%" outerRadius={80} label={({ _id, percent }) => `${_id} ${(percent * 100).toFixed(0)}%`} labelLine={false} fontSize={10}>
                  {charts.ordersByStatus.map((entry, i) => (
                    <Cell key={i} fill={STATUS_COLORS[entry._id] || PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-52 flex items-center justify-center text-slate-400 text-sm">No orders yet</div>
          )}
        </div>
      </div>

      {/* Recent + Top products */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent orders */}
        <div className="card p-6">
          <h2 className="font-display font-semibold text-slate-900 dark:text-white mb-4">Recent Orders</h2>
          {recent.orders.length === 0
            ? <p className="text-slate-400 text-sm">No orders yet</p>
            : (
              <div className="space-y-3">
                {recent.orders.map(order => (
                  <div key={order._id} className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-700 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">{order.customerName}</p>
                      <p className="text-xs text-slate-400">{new Date(order.createdAt).toLocaleDateString('en-IN')}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-brand-600 dark:text-brand-400">₹{order.totalAmount?.toLocaleString('en-IN')}</p>
                      <span className={`badge text-xs capitalize ${
                        order.status === 'delivered' ? 'badge-green'
                        : order.status === 'cancelled' ? 'badge-red'
                        : 'badge-yellow'
                      }`}>{order.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )
          }
        </div>

        {/* Top products */}
        <div className="card p-6">
          <h2 className="font-display font-semibold text-slate-900 dark:text-white mb-4">Top Products</h2>
          {topProducts.length === 0
            ? <p className="text-slate-400 text-sm">No sales yet</p>
            : (
              <div className="space-y-3">
                {topProducts.map((p, i) => (
                  <div key={p._id} className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-400 w-4">#{i + 1}</span>
                    <img src={p.image} alt={p.name}
                      className="w-10 h-10 rounded-lg object-cover bg-slate-100"
                      onError={e => e.target.src = 'https://placehold.co/40x40'} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 dark:text-white line-clamp-1">{p.name}</p>
                      <p className="text-xs text-slate-400 capitalize">{p.category}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-bold text-brand-600 dark:text-brand-400">₹{p.price}</p>
                      <p className="text-xs text-slate-400">{p.soldCount} sold</p>
                    </div>
                  </div>
                ))}
              </div>
            )
          }
        </div>
      </div>

      {/* ── Low Stock Alert ── */}
      {(lowStockProducts.length > 0 || stats.outOfStockCount > 0) && (
        <div className="mt-6">
          {/* Banner */}
          <div className="flex items-center gap-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl px-5 py-4 mb-4">
            <MdWarning className="text-amber-500 text-2xl flex-shrink-0" />
            <div className="flex-1">
              <p className="font-display font-bold text-amber-800 dark:text-amber-300 text-sm">
                Stock Alert
              </p>
              <p className="text-amber-700 dark:text-amber-400 text-xs mt-0.5">
                {stats.lowStockCount > 0 && `${stats.lowStockCount} product${stats.lowStockCount !== 1 ? 's' : ''} running low (≤10 units)`}
                {stats.lowStockCount > 0 && stats.outOfStockCount > 0 && ' · '}
                {stats.outOfStockCount > 0 && `${stats.outOfStockCount} product${stats.outOfStockCount !== 1 ? 's' : ''} out of stock`}
              </p>
            </div>
            <Link to="/admin/products" className="flex-shrink-0 text-xs font-bold text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/40 px-3 py-1.5 rounded-lg hover:bg-amber-200 dark:hover:bg-amber-900/60 transition-all">
              Manage Stock →
            </Link>
          </div>

          {/* Low stock product list */}
          <div className="card p-6">
            <h2 className="font-display font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <MdWarning className="text-amber-500" /> Low Stock Products
            </h2>
            <div className="space-y-3">
              {lowStockProducts.map(p => (
                <div key={p._id} className="flex items-center gap-3">
                  <img src={p.image} alt={p.name}
                    className="w-10 h-10 rounded-lg object-cover bg-slate-100 flex-shrink-0"
                    onError={e => e.target.src = 'https://placehold.co/40x40'} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 dark:text-white line-clamp-1">{p.name}</p>
                    <p className="text-xs text-slate-400 capitalize">{p.category} · ₹{p.price}</p>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <span className={`badge text-xs font-bold px-2.5 py-1 ${
                      p.stock <= 3
                        ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                        : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                    }`}>
                      {p.stock} left
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  )
}