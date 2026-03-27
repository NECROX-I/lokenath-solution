import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import SEO from '../components/SEO'
import { motion } from 'framer-motion'
import { serviceAPI, serviceRequestAPI } from '../services/api'
import toast from 'react-hot-toast'
import { MdArrowBack, MdCheckCircle, MdAccessTime, MdAttachMoney, MdSend } from 'react-icons/md'

const SERVICE_LABELS = {
  'tax-payment': 'Tax Payment',
  'money-transfer': 'Money Transfer',
  'government-schemes': 'Government Schemes',
  'aadhaar-services': 'Aadhaar Services',
  'voter-id': 'Voter ID',
  'ration-card': 'Ration Card',
  'form-filling': 'Form Filling',
}

export default function ServiceDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [service, setService] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '', email: '', description: '' })
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    serviceAPI.getOne(id)
      .then(r => setService(r.data.service))
      .catch(() => navigate('/services'))
      .finally(() => setLoading(false))
  }, [id])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.phone || !form.description) {
      toast.error('Please fill all required fields')
      return
    }
    if (!/^[6-9]\d{9}$/.test(form.phone)) {
      toast.error('Enter a valid 10-digit Indian phone number')
      return
    }
    setSubmitting(true)
    try {
      await serviceRequestAPI.submit({ ...form, serviceType: id })
      setSuccess(true)
      setForm({ name: '', phone: '', email: '', description: '' })
      toast.success('Service request submitted! We will call you soon.')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submission failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return (
    <div className="page-container py-16 space-y-4">
      <div className="skeleton h-8 rounded-xl w-1/4" />
      <div className="skeleton h-6 rounded-lg w-1/2" />
      <div className="skeleton h-40 rounded-2xl" />
    </div>
  )
  if (!service) return null

  return (
    <>
      <SEO
        title={service.title}
        description={`${service.description?.slice(0, 155)}... — ${service.charges || ''} at Loknath Solution, West Bengal.`}
        keywords={`${service.title} West Bengal, ${service.title.toLowerCase()} near me, ${service.id.replace(/-/g,' ')} help`}
        canonical={`/services/${service.id}`}
        schema={{
          "@context": "https://schema.org",
          "@type": "Service",
          "name": service.title,
          "description": service.description,
          "provider": {
            "@type": "LocalBusiness",
            "name": "Loknath Solution",
            "telephone": "+919876543210"
          },
          "areaServed": "West Bengal, India",
          "offers": service.charges ? {
            "@type": "Offer",
            "description": service.charges,
            "priceCurrency": "INR"
          } : undefined
        }}
      />

      <div className="page-container py-8">
        <Link to="/services" className="btn-ghost mb-6 inline-flex">
          <MdArrowBack /> All Services
        </Link>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Left: Service info */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="text-5xl mb-4">{service.icon}</div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-900 dark:text-white">{service.title}</h1>
            <p className="text-slate-600 dark:text-slate-400 mt-4 leading-relaxed">{service.description}</p>

            {/* Meta */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              {service.charges && (
                <div className="card p-4">
                  <MdAttachMoney className="text-brand-500 text-xl mb-1" />
                  <p className="text-xs text-slate-500 dark:text-slate-400">Charges</p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{service.charges}</p>
                </div>
              )}
              {service.duration && (
                <div className="card p-4">
                  <MdAccessTime className="text-ocean-500 text-xl mb-1" />
                  <p className="text-xs text-slate-500 dark:text-slate-400">Duration</p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{service.duration}</p>
                </div>
              )}
            </div>

            {/* Documents required */}
            {service.documents?.length > 0 && (
              <div className="mt-8">
                <h2 className="font-display font-bold text-slate-900 dark:text-white text-lg mb-4">
                  📋 Documents Required
                </h2>
                <ul className="space-y-2">
                  {service.documents.map((doc, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                      <MdCheckCircle className="text-brand-500 flex-shrink-0" />
                      {doc}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>

          {/* Right: Request form */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="card p-6 md:p-8">
              {success ? (
                <div className="text-center py-10">
                  <div className="w-16 h-16 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center mx-auto mb-4">
                    <MdCheckCircle className="text-3xl text-brand-600" />
                  </div>
                  <h3 className="text-xl font-display font-bold text-slate-900 dark:text-white mb-2">Request Submitted!</h3>
                  <p className="text-slate-500 dark:text-slate-400 mb-6">We will call you within 24 hours to confirm your appointment.</p>
                  <button onClick={() => setSuccess(false)} className="btn-primary">Submit Another Request</button>
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-display font-bold text-slate-900 dark:text-white mb-1">Request This Service</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">We'll contact you within 24 hours.</p>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text" placeholder="Your full name"
                        value={form.name}
                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                        className="input-field"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel" placeholder="10-digit mobile number"
                        value={form.phone} maxLength={10}
                        onChange={e => setForm(f => ({ ...f, phone: e.target.value.replace(/\D/g, '') }))}
                        className="input-field"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email (optional)</label>
                      <input
                        type="email" placeholder="your@email.com"
                        value={form.email}
                        onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                        className="input-field"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                        Service: <span className="text-brand-600 dark:text-brand-400 font-semibold">{service.title}</span>
                      </label>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                        Describe Your Requirement <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        rows={4} placeholder="Briefly explain what you need help with..."
                        value={form.description}
                        onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                        className="input-field resize-none"
                        required
                      />
                    </div>

                    <button type="submit" disabled={submitting} className="btn-primary w-full justify-center py-4 text-base">
                      {submitting ? (
                        <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Submitting...</span>
                      ) : (
                        <><MdSend /> Submit Request</>
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </>
  )
}