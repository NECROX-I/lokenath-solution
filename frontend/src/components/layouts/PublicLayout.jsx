import { Outlet } from 'react-router-dom'
import { useState } from 'react'
import Navbar from '../Navbar'
import Footer from '../Footer'
import CartDrawer from '../CartDrawer'
import BottomNav from '../BottomNav'
import FloatingWhatsApp from '../FloatingWhatsApp'

export default function PublicLayout() {
  const [cartOpen, setCartOpen] = useState(false)

  return (
    <div className="min-h-screen flex flex-col bg-surface dark:bg-surface-dark">
      <Navbar onCartOpen={() => setCartOpen(true)} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />

      <main className="flex-1 pb-16 md:pb-0">
        <Outlet />
      </main>

      <div className="hidden md:block">
        <Footer />
      </div>

      {/* Mobile: bottom nav + floating WA */}
      <BottomNav onCartOpen={() => setCartOpen(true)} />
      <FloatingWhatsApp />
    </div>
  )
}