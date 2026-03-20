import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useCartStore, useThemeStore } from '../store'
import {
  MdStorefront, MdMenu, MdClose, MdShoppingCart,
  MdDarkMode, MdLightMode, MdPhone
} from 'react-icons/md'
import { FaWhatsapp } from 'react-icons/fa'

const LINKS = [
  { to: '/',         label: 'Home'     },
  { to: '/products', label: 'Products' },
  { to: '/services', label: 'Services' },
  { to: '/track',    label: '📦 Track Order' },
  { to: '/contact',  label: 'Contact'  },
]

const WA = import.meta.env.VITE_WHATSAPP_NUMBER || '919876543210'

// Business hours: Mon–Sat 9am–8pm, Sun 10am–5pm (IST)
function useShopStatus() {
  const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }))
  const day  = now.getDay()   // 0=Sun, 6=Sat
  const hour = now.getHours()
  const min  = now.getMinutes()
  const time = hour + min / 60

  if (day === 0) return time >= 10 && time < 17 ? 'open' : 'closed'   // Sunday
  if (day >= 1 && day <= 6) return time >= 9 && time < 20 ? 'open' : 'closed' // Mon–Sat
  return 'closed'
}

export default function Navbar({ onCartOpen }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled]  = useState(false)
  const { items }                = useCartStore()
  const { dark, toggle }         = useThemeStore()
  const location                 = useLocation()
  const shopStatus               = useShopStatus()
  const isOpen                   = shopStatus === 'open'

  const totalItems = items.reduce((s, i) => s + i.quantity, 0)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => setMenuOpen(false), [location])

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled
        ? 'bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-md'
        : 'bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800'
    }`}>
      {/* Top bar */}
      <div className={`text-white text-xs py-1.5 px-4 flex items-center justify-center gap-3 transition-colors ${
        isOpen ? 'bg-brand-600' : 'bg-slate-700'
      }`}>
        {/* Open/Closed pill */}
        <span className={`flex items-center gap-1.5 font-semibold px-2.5 py-0.5 rounded-full text-xs ${
          isOpen
            ? 'bg-green-400/20 text-green-100'
            : 'bg-red-400/20 text-red-200'
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${isOpen ? 'bg-green-300 animate-pulse' : 'bg-red-400'}`} />
          {isOpen ? 'Open Now' : 'Closed'}
        </span>
        <span className="hidden sm:inline text-white/80">
          {isOpen
            ? '📍 Stationery · Toys · Digital Services'
            : '⏰ Mon–Sat 9AM–8PM · Sun 10AM–5PM'
          }
        </span>
        <a href={`tel:+91${WA.replace('91','')}`}
          className="flex items-center gap-1 underline hover:no-underline ml-1">
          <MdPhone className="text-sm" /> Call
        </a>
      </div>

      <div className="page-container">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-ocean-500 flex items-center justify-center shadow-brand group-hover:scale-105 transition-transform">
              <MdStorefront className="text-white text-xl" />
            </div>
            <div>
              <span className="font-display font-bold text-slate-900 dark:text-white text-base leading-tight block">
                Loknath Solution
              </span>
              <span className="text-xs text-brand-600 dark:text-brand-400 leading-none block -mt-0.5">
                Stationery & Services
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-0.5">
            {LINKS.map(({ to, label }) => (
              <NavLink key={to} to={to} end={to === '/'}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400'
                      : 'text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Dark mode */}
            <button onClick={toggle} aria-label="Toggle dark mode"
              className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
              {dark ? <MdLightMode className="text-xl" /> : <MdDarkMode className="text-xl" />}
            </button>

            {/* Cart */}
            <button onClick={onCartOpen} aria-label="Open cart"
              className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
              <MdShoppingCart className="text-xl" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-brand-600 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </button>

            {/* WhatsApp — desktop */}
            <a href={`https://wa.me/${WA}`} target="_blank" rel="noopener noreferrer"
              className="hidden lg:flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all">
              <FaWhatsapp /> WhatsApp
            </a>

            {/* Mobile hamburger */}
            <button onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu"
              className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
              {menuOpen ? <MdClose className="text-xl" /> : <MdMenu className="text-xl" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 px-4 pb-5 pt-2 space-y-1">
          {LINKS.map(({ to, label }) => (
            <NavLink key={to} to={to} end={to === '/'}
              className={({ isActive }) =>
                `block px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
          <div className="pt-2 space-y-2">
            <a href={`https://wa.me/${WA}`} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-xl text-sm">
              <FaWhatsapp /> Chat on WhatsApp
            </a>
            <a href={`tel:+91${WA.replace('91','')}`}
              className="flex items-center justify-center gap-2 w-full border-2 border-brand-200 dark:border-brand-800 text-brand-600 dark:text-brand-400 font-semibold py-3 rounded-xl text-sm">
              <MdPhone /> Call Us
            </a>
          </div>
        </div>
      )}
    </header>
  )
}