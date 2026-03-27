import { NavLink, useLocation } from 'react-router-dom'
import { useCartStore } from '../store'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MdHome, MdShoppingBag, MdMiscellaneousServices,
  MdTrackChanges, MdShoppingCart
} from 'react-icons/md'

const TABS = [
  { to: '/',         icon: MdHome,                 label: 'Home'     },
  { to: '/products', icon: MdShoppingBag,           label: 'Shop'     },
  { to: '/services', icon: MdMiscellaneousServices, label: 'Services' },
  { to: '/track',    icon: MdTrackChanges,          label: 'Track'    },
]

export default function BottomNav({ onCartOpen }) {
  const { getCount } = useCartStore()
  const location      = useLocation()
  const totalItems    = getCount()

  // Hide on admin pages
  if (location.pathname.startsWith('/admin')) return null

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 shadow-2xl">
      <div className="flex items-center justify-around px-2 py-1 safe-area-bottom">
        {TABS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-4 py-2 rounded-2xl transition-all duration-200 min-w-[56px] ${
                isActive
                  ? 'text-brand-600 dark:text-brand-400'
                  : 'text-slate-400 dark:text-slate-500'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className={`w-10 h-8 flex items-center justify-center rounded-xl transition-all duration-200 ${
                  isActive ? 'bg-brand-50 dark:bg-brand-900/30' : ''
                }`}>
                  <Icon className="text-xl" />
                </div>
                <span className="text-[10px] font-semibold leading-none">{label}</span>
              </>
            )}
          </NavLink>
        ))}

        {/* Cart tab */}
        <button
          onClick={onCartOpen}
          className="flex flex-col items-center gap-0.5 px-4 py-2 rounded-2xl transition-all duration-200 min-w-[56px] text-slate-400 dark:text-slate-500 relative"
        >
          <div className="w-10 h-8 flex items-center justify-center rounded-xl relative">
            <MdShoppingCart className="text-xl" />
            <AnimatePresence>
              {totalItems > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-1 -right-1 w-4 h-4 bg-brand-600 text-white text-[9px] rounded-full flex items-center justify-center font-bold"
                >
                  {totalItems > 9 ? '9+' : totalItems}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
          <span className="text-[10px] font-semibold leading-none">Cart</span>
        </button>
      </div>
    </nav>
  )
}