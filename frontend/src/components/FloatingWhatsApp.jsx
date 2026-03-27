import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import { FaWhatsapp } from 'react-icons/fa'
import { MdClose } from 'react-icons/md'

const WA = import.meta.env.VITE_WHATSAPP_NUMBER || '919876543210'

const QUICK_MSGS = [
  { label: '📦 Track my order', msg: 'Hi! I want to track my order.' },
  { label: '🛍️ Product inquiry', msg: 'Hi! I have a question about a product.' },
  { label: '🪪 Aadhaar service', msg: 'Hi! I need help with Aadhaar services.' },
  { label: '📝 Form filling', msg: 'Hi! I need help filling an online form.' },
]

export default function FloatingWhatsApp() {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  // Hide on admin and checkout pages
  if (location.pathname.startsWith('/admin') || location.pathname === '/checkout') return null

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 z-40 flex flex-col items-end gap-2">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 12 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 overflow-hidden w-64"
          >
            {/* Header */}
            <div className="bg-green-500 px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                  <FaWhatsapp className="text-white text-xl" />
                </div>
                <div>
                  <p className="text-white font-bold text-sm">Loknath Solution</p>
                  <p className="text-green-100 text-xs">Typically replies in minutes</p>
                </div>
              </div>
            </div>

            {/* Quick messages */}
            <div className="p-3 space-y-2">
              <p className="text-xs text-slate-400 font-medium px-1">Quick messages:</p>
              {QUICK_MSGS.map(({ label, msg }) => (
                <a
                  key={label}
                  href={`https://wa.me/${WA}?text=${encodeURIComponent(msg)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  className="flex items-center w-full text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-700 dark:hover:text-green-400 px-3 py-2.5 rounded-xl transition-all font-medium"
                >
                  {label}
                </a>
              ))}
              <a
                href={`https://wa.me/${WA}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl text-sm transition-all mt-1"
              >
                <FaWhatsapp /> Open WhatsApp
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB */}
      <motion.button
        onClick={() => setOpen(v => !v)}
        whileTap={{ scale: 0.9 }}
        className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-xl flex items-center justify-center transition-colors"
        aria-label="WhatsApp chat"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <MdClose className="text-2xl" />
            </motion.div>
          ) : (
            <motion.div key="wa" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <FaWhatsapp className="text-2xl" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  )
}