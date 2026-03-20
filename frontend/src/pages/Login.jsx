import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion, AnimatePresence } from 'framer-motion'
import { customerAPI } from '../services/api'
import { useCustomerStore } from '../store'
import toast from 'react-hot-toast'
import {
  MdEmail, MdArrowForward, MdArrowBack,
  MdPerson, MdCheckCircle, MdRefresh
} from 'react-icons/md'

const STEPS = { EMAIL: 'email', OTP: 'otp', NAME: 'name' }

export default function Login() {
  const navigate = useNavigate()
  const { customerLogin } = useCustomerStore()

  const [step, setStep] = useState(STEPS.EMAIL)
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [name, setName] = useState('')
  const [isNewUser, setIsNewUser] = useState(false)
  const [loading, setLoading] = useState(false)
  const [resendTimer, setResendTimer] = useState(0)

  // OTP input refs for auto-focus
  const inputRefs = Array(6).fill(null).map(() => ({ current: null }))

  const startResendTimer = () => {
    setResendTimer(60)
    const interval = setInterval(() => {
      setResendTimer(t => {
        if (t <= 1) { clearInterval(interval); return 0 }
        return t - 1
      })
    }, 1000)
  }

  // Step 1: Request OTP
  const handleEmailSubmit = async (e) => {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)
    try {
      const { data } = await customerAPI.requestOTP({ email: email.trim() })
      setIsNewUser(data.isNewUser)
      setStep(data.isNewUser ? STEPS.NAME : STEPS.OTP)
      toast.success(`OTP sent to ${email}!`)
      startResendTimer()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send OTP. Try again.')
    } finally {
      setLoading(false)
    }
  }

  // Step 1b: Name input for new users before OTP
  const handleNameNext = () => {
    if (!name.trim() || name.trim().length < 2) {
      toast.error('Please enter your full name (at least 2 characters)')
      return
    }
    setStep(STEPS.OTP)
  }

  // Resend OTP
  const handleResend = async () => {
    if (resendTimer > 0) return
    setLoading(true)
    try {
      await customerAPI.requestOTP({ email })
      setOtp(['', '', '', '', '', ''])
      toast.success('New OTP sent!')
      startResendTimer()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to resend OTP.')
    } finally {
      setLoading(false)
    }
  }

  // OTP box input handler
  const handleOtpChange = (index, value) => {
    const digit = value.replace(/\D/g, '').slice(-1)
    const newOtp = [...otp]
    newOtp[index] = digit
    setOtp(newOtp)
    // Auto-advance
    if (digit && index < 5) {
      inputRefs[index + 1]?.current?.focus()
    }
  }

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs[index - 1]?.current?.focus()
    }
  }

  const handleOtpPaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (pasted.length === 6) {
      setOtp(pasted.split(''))
      inputRefs[5]?.current?.focus()
    }
  }

  // Step 2: Verify OTP
  const handleVerifyOTP = async (e) => {
    e?.preventDefault()
    const otpStr = otp.join('')
    if (otpStr.length !== 6) { toast.error('Enter the complete 6-digit OTP'); return }
    setLoading(true)
    try {
      const { data } = await customerAPI.verifyOTP({
        email,
        otp: otpStr,
        ...(isNewUser && { name: name.trim() })
      })
      customerLogin(data.customer, data.token)
      toast.success(`Welcome${isNewUser ? '' : ' back'}, ${data.customer.name}! 🎉`)
      navigate('/profile')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid OTP. Please try again.')
      setOtp(['', '', '', '', '', ''])
      inputRefs[0]?.current?.focus()
    } finally {
      setLoading(false)
    }
  }

  // Auto-submit when all 6 digits filled
  const otpStr = otp.join('')
  if (otpStr.length === 6 && step === STEPS.OTP && !loading) {
    handleVerifyOTP()
  }

  return (
    <>
      <Helmet>
        <title>Login — Loknath Solution</title>
        <meta name="description" content="Sign in to your Loknath Solution account to track orders and manage your profile." />
      </Helmet>

      <div className="min-h-[80vh] flex items-center justify-center py-12 page-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {/* Card */}
          <div className="card p-8">
            {/* Logo */}
            <div className="text-center mb-8">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 to-ocean-500 flex items-center justify-center mx-auto mb-3 shadow-brand">
                <MdPerson className="text-white text-2xl" />
              </div>
              <h1 className="text-2xl font-display font-bold text-slate-900 dark:text-white">
                {isNewUser ? 'Create Account' : 'Welcome Back'}
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                {step === STEPS.EMAIL && 'Enter your email to get started'}
                {step === STEPS.NAME && 'Tell us your name'}
                {step === STEPS.OTP && `Check ${email} for your code`}
              </p>
            </div>

            {/* Progress dots */}
            <div className="flex justify-center gap-2 mb-8">
              {[STEPS.EMAIL, STEPS.OTP].map((s, i) => (
                <div key={s} className={`h-1.5 rounded-full transition-all duration-300 ${
                  step === STEPS.EMAIL && i === 0 ? 'w-8 bg-brand-500' :
                  step === STEPS.NAME && i === 0 ? 'w-8 bg-brand-500' :
                  step === STEPS.OTP && i === 0 ? 'w-4 bg-brand-300' :
                  step === STEPS.OTP && i === 1 ? 'w-8 bg-brand-500' :
                  'w-4 bg-slate-200 dark:bg-slate-700'
                }`} />
              ))}
            </div>

            <AnimatePresence mode="wait">
              {/* Step 1: Email */}
              {step === STEPS.EMAIL && (
                <motion.form key="email"
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  onSubmit={handleEmailSubmit} className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                      Email Address
                    </label>
                    <div className="relative">
                      <MdEmail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
                      <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        autoFocus
                        className="input-field pl-10"
                        required
                      />
                    </div>
                  </div>

                  <button type="submit" disabled={loading || !email}
                    className="btn-primary w-full justify-center py-3.5">
                    {loading
                      ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sending OTP...</>
                      : <>Continue <MdArrowForward /></>
                    }
                  </button>

                  <p className="text-center text-xs text-slate-400">
                    We'll send a one-time code to your email. No password needed.
                  </p>
                </motion.form>
              )}

              {/* Step 1b: Name (new users) */}
              {step === STEPS.NAME && (
                <motion.div key="name"
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                      Your Full Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="e.g. Rahul Kumar"
                      autoFocus
                      className="input-field"
                      onKeyDown={e => e.key === 'Enter' && handleNameNext()}
                    />
                    <p className="text-xs text-slate-400 mt-1">This will appear on your orders.</p>
                  </div>

                  <button onClick={handleNameNext} className="btn-primary w-full justify-center py-3.5">
                    Continue to Verify <MdArrowForward />
                  </button>
                  <button onClick={() => setStep(STEPS.EMAIL)}
                    className="w-full flex items-center justify-center gap-1 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
                    <MdArrowBack className="text-sm" /> Change email
                  </button>
                </motion.div>
              )}

              {/* Step 2: OTP */}
              {step === STEPS.OTP && (
                <motion.div key="otp"
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 text-center">
                      Enter the 6-digit code sent to<br />
                      <span className="text-brand-600 dark:text-brand-400 font-semibold">{email}</span>
                    </label>

                    {/* OTP boxes */}
                    <div className="flex gap-2 justify-center" onPaste={handleOtpPaste}>
                      {otp.map((digit, i) => (
                        <input
                          key={i}
                          ref={inputRefs[i]}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={e => handleOtpChange(i, e.target.value)}
                          onKeyDown={e => handleOtpKeyDown(i, e)}
                          autoFocus={i === 0}
                          className={`w-12 h-14 text-center text-xl font-bold rounded-xl border-2 transition-all
                            bg-white dark:bg-slate-800 text-slate-900 dark:text-white
                            focus:outline-none focus:border-brand-500
                            ${digit ? 'border-brand-400 bg-brand-50 dark:bg-brand-900/20' : 'border-slate-200 dark:border-slate-600'}`}
                        />
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={handleVerifyOTP}
                    disabled={loading || otpStr.length !== 6}
                    className="btn-primary w-full justify-center py-3.5"
                  >
                    {loading
                      ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Verifying...</>
                      : <><MdCheckCircle /> Verify & Login</>
                    }
                  </button>

                  {/* Resend + Back */}
                  <div className="flex items-center justify-between text-sm">
                    <button onClick={() => { setStep(STEPS.EMAIL); setOtp(['','','','','','']) }}
                      className="flex items-center gap-1 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
                      <MdArrowBack className="text-sm" /> Change email
                    </button>
                    <button onClick={handleResend} disabled={resendTimer > 0}
                      className="flex items-center gap-1 text-brand-600 dark:text-brand-400 disabled:text-slate-400 hover:underline disabled:no-underline">
                      <MdRefresh className="text-sm" />
                      {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP'}
                    </button>
                  </div>

                  <p className="text-xs text-slate-400 text-center">
                    ⏰ Code expires in 10 minutes · Check spam folder if not received
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <p className="text-center text-xs text-slate-400 mt-4">
            By continuing, you agree to our terms of service.
          </p>
        </motion.div>
      </div>
    </>
  )
}