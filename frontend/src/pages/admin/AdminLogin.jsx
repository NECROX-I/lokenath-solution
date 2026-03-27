import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SEO from '../../components/SEO'
import { authAPI } from '../../services/api'
import { useAuthStore } from '../../store'
import toast from 'react-hot-toast'
import { MdStorefront, MdLock, MdVisibility, MdVisibilityOff } from 'react-icons/md'

export default function AdminLogin() {
  const navigate = useNavigate()
  const { login } = useAuthStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Please enter both email and password')
      return
    }

    setLoading(true)
    try {
      const { data } = await authAPI.login({ email: email.trim(), password })
      login(data.user, data.token)
      toast.success(`Welcome, ${data.user.name}!`)
      // Hard navigate — avoids any router state issues
      window.location.href = '/admin/dashboard'
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid email or password'
      setError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <SEO title="Admin Login" description="Admin login." noIndex={true} />

      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">

        {/* Background glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative w-full max-w-md">

          {/* Logo card */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-ocean-600 shadow-brand mb-4">
              <MdStorefront className="text-white text-3xl" />
            </div>
            <h1 className="text-2xl font-display font-bold text-white">Loknath Solution</h1>
            <p className="text-slate-400 text-sm mt-1">Admin Panel · Sign in to manage your store</p>
          </div>

          {/* Login card */}
          <div className="bg-slate-800/80 backdrop-blur border border-slate-700/60 rounded-2xl p-8 shadow-2xl">
            <h2 className="text-lg font-display font-semibold text-white mb-6">Sign In</h2>

            {/* Error alert */}
            {error && (
              <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="admin@loknathasolution.com"
                  autoComplete="email"
                  className="w-full bg-slate-900/60 border border-slate-600 text-white placeholder-slate-500
                             rounded-xl px-4 py-3 text-sm
                             focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent
                             transition-all duration-200"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    className="w-full bg-slate-900/60 border border-slate-600 text-white placeholder-slate-500
                               rounded-xl px-4 py-3 pr-12 text-sm
                               focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent
                               transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors p-1"
                  >
                    {showPw ? <MdVisibilityOff className="text-xl" /> : <MdVisibility className="text-xl" />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 bg-brand-600 hover:bg-brand-500 disabled:bg-brand-800
                           disabled:cursor-not-allowed text-white font-semibold
                           py-3.5 rounded-xl transition-all duration-200 text-sm
                           flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <MdLock className="text-lg" />
                    Sign In to Admin Panel
                  </>
                )}
              </button>
            </form>

            {/* Hint */}
            <div className="mt-6 pt-5 border-t border-slate-700/50">
              <p className="text-xs text-slate-500 text-center">
                Default: <span className="text-slate-400 font-mono">admin@loknathasolution.com</span>
                <br />Run <span className="text-slate-400 font-mono">npm run seed</span> in backend to create admin
              </p>
            </div>
          </div>

          <p className="text-center mt-6">
            <a href="/" className="text-slate-500 hover:text-slate-300 text-sm transition-colors">
              ← Back to Website
            </a>
          </p>
        </div>
      </div>
    </>
  )
}