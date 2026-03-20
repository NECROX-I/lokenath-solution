import { useState, useEffect } from 'react'
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore, useThemeStore } from '../../store'
import {
  MdDashboard, MdInventory, MdShoppingBag,
  MdMiscellaneousServices, MdMessage, MdLogout,
  MdMenu, MdClose, MdStore, MdLightMode, MdDarkMode,
  MdOpenInNew
} from 'react-icons/md'

const NAV_ITEMS = [
  { to: '/admin/dashboard',         icon: MdDashboard,             label: 'Dashboard'         },
  { to: '/admin/products',          icon: MdInventory,             label: 'Products'          },
  { to: '/admin/orders',            icon: MdShoppingBag,           label: 'Orders'            },
  { to: '/admin/service-requests',  icon: MdMiscellaneousServices, label: 'Service Requests'  },
  { to: '/admin/messages',          icon: MdMessage,               label: 'Messages'          },
]

export default function AdminLayout() {
  const { logout, user } = useAuthStore()
  const { dark, toggle } = useThemeStore()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Close sidebar on route change (mobile)
  useEffect(() => { setSidebarOpen(false) }, [location.pathname])

  const handleLogout = () => {
    logout()
    window.location.href = '/admin/login'
  }

  // Page title — exact match first, then startsWith for nested routes
  const pageTitle = NAV_ITEMS.find(n => location.pathname === n.to)?.label
    || NAV_ITEMS.find(n => n.to !== '/admin/dashboard' && location.pathname.startsWith(n.to))?.label
    || 'Dashboard'

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 font-body">

      {/* ── Mobile overlay ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-20 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-slate-900 z-30 flex flex-col
        transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-auto
      `}>

        {/* Brand */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-slate-800">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-ocean-500 flex items-center justify-center flex-shrink-0">
            <MdStore className="text-white text-lg" />
          </div>
          <div className="min-w-0">
            <p className="text-white font-display font-bold text-sm leading-tight truncate">Loknath Solution</p>
            <p className="text-slate-500 text-xs">Admin Panel</p>
          </div>
          {/* Close btn mobile */}
          <button
            className="ml-auto lg:hidden text-slate-400 hover:text-white"
            onClick={() => setSidebarOpen(false)}
          >
            <MdClose className="text-xl" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/admin/dashboard'}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium
                transition-all duration-150
                ${isActive
                  ? 'bg-brand-600 text-white shadow-lg shadow-brand-900/50'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }
              `}
            >
              <Icon className="text-lg flex-shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Divider */}
        <div className="mx-3 border-t border-slate-800" />

        {/* View site link */}
        <div className="px-3 py-2">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <MdOpenInNew className="text-lg flex-shrink-0" />
            View Website
          </a>
        </div>

        {/* User + logout */}
        <div className="px-3 pb-4 pt-1">
          <div className="flex items-center gap-3 px-3 py-2 mb-1">
            <div className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
              {user?.name?.[0]?.toUpperCase() || 'A'}
            </div>
            <div className="min-w-0">
              <p className="text-white text-xs font-semibold truncate">{user?.name || 'Admin'}</p>
              <p className="text-slate-500 text-xs truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all text-sm font-medium"
          >
            <MdLogout className="text-lg" />
            Logout
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">

        {/* Top bar */}
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center px-4 gap-3 sticky top-0 z-10 shadow-sm">
          {/* Hamburger */}
          <button
            className="lg:hidden p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <MdMenu className="text-xl" />
          </button>

          {/* Page title */}
          <h2 className="font-display font-bold text-slate-800 dark:text-white text-base flex-1 truncate">
            {pageTitle}
          </h2>

          {/* Dark mode toggle */}
          <button
            onClick={toggle}
            className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            aria-label="Toggle dark mode"
          >
            {dark ? <MdLightMode className="text-xl" /> : <MdDarkMode className="text-xl" />}
          </button>

          {/* Date */}
          <span className="hidden sm:block text-xs text-slate-400 dark:text-slate-500 whitespace-nowrap">
            {new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
          </span>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}