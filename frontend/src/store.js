import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// ─── Cart Store ───────────────────────────────────────────────
export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) => {
        const items = get().items
        const existing = items.find(i => i._id === product._id)
        if (existing) {
          set({
            items: items.map(i =>
              i._id === product._id
                ? { ...i, quantity: Math.min(i.quantity + 1, product.stock) }
                : i
            )
          })
        } else {
          set({ items: [...items, { ...product, quantity: 1 }] })
        }
      },

      removeItem: (id) => set({ items: get().items.filter(i => i._id !== id) }),

      updateQuantity: (id, quantity) => {
        if (quantity < 1) {
          set({ items: get().items.filter(i => i._id !== id) })
          return
        }
        set({ items: get().items.map(i => i._id === id ? { ...i, quantity } : i) })
      },

      clearCart: () => set({ items: [] }),
    }),
    { name: 'loknath-cart' }
  )
)

// ─── Theme Store ──────────────────────────────────────────────
export const useThemeStore = create(
  persist(
    (set, get) => ({
      dark: false,
      toggle: () => {
        const next = !get().dark
        if (next) document.documentElement.classList.add('dark')
        else document.documentElement.classList.remove('dark')
        set({ dark: next })
      },
      init: () => {
        if (get().dark) document.documentElement.classList.add('dark')
      },
    }),
    { name: 'loknath-theme' }
  )
)

// ─── Admin Auth Store ─────────────────────────────────────────
export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      _hasHydrated: false,

      setHasHydrated: (val) => set({ _hasHydrated: val }),

      login: (user, token) => set({
        user, token, isAuthenticated: true, _hasHydrated: true
      }),

      logout: () => set({ user: null, token: null, isAuthenticated: false }),
    }),
    {
      name: 'loknath-auth',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) state.setHasHydrated(true)
      },
    }
  )
)