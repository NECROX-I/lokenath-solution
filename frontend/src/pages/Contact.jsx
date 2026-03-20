import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { contactAPI } from '../services/api'
import toast from 'react-hot-toast'
import { MdLocationOn, MdPhone, MdEmail, MdAccessTime, MdSend, MdCheckCircle } from 'react-icons/md'
import { FaWhatsapp } from 'react-icons/fa'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const wa = import.meta.env.VITE_WHATSAPP_NUMBER || '9883486739'

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.subject || !form.message) {
      toast.error('Please fill all required fields')
      return
    }
    setSubmitting(true)
    try {
      await contactAPI.submit(form)
      setSuccess(true)
      setForm({ name: '', email: '', phone: '', subject: '', message: '' })
      toast.success('Message sent! We\'ll get back to you soon.')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send message.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <Helmet>
        <title>Contact Us – Lokennath Printing & Stationery</title>
        <meta name="description" content="Get in touch with Lokennath Printing & Stationery for any queries about products or services." />
      </Helmet>

      <div className="bg-gradient-to-r from-slate-800 to-slate-900 py-12">
        <div className="page-container text-center">
          <h1 className="text-4xl font-display font-bold text-white">Contact Us</h1>
          <p className="text-slate-400 mt-2">We're here to help. Reach out anytime.</p>
        </div>
      </div>

      <div className="page-container py-14">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Info */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white mb-6">Get In Touch</h2>

            <div className="space-y-5 mb-8">
              {[
                { icon: MdLocationOn, title: 'Visit Us', content: '11b, Rahim Ostagar Rd, Jodhpur Gardens, Jodhpur Park,\nKolkata – 700045, West Bengal', color: 'text-brand-500' },
                { icon: MdPhone, title: 'Call Us', content: '+91 74394 85463', link: 'tel:+919883486739', color: 'text-ocean-500' },
                { icon: MdEmail, title: 'Email Us', content: 'info@loknathasolution.com', link: 'mailto:info@loknathasolution.com', color: 'text-purple-500' },
                { icon: MdAccessTime, title: 'Shop Hours', content: 'Mon–Sat: 9 AM – 8 PM\nSunday: 10 AM – 5 PM', color: 'text-amber-500' },
              ].map(({ icon: Icon, title, content, link, color }) => (
                <div key={title} className="flex gap-4 items-start">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
                    <Icon className={`text-xl ${color}`} />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white text-sm">{title}</p>
                    {link
                      ? <a href={link} className="text-sm text-slate-500 dark:text-slate-400 hover:text-brand-600 transition-colors">{content}</a>
                      : <p className="text-sm text-slate-500 dark:text-slate-400 whitespace-pre-line">{content}</p>
                    }
                  </div>
                </div>
              ))}
            </div>

            <a
              href={`https://wa.me/${wa}?text=Hello Lokennath Printing & Stationery!`}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-4 rounded-xl transition-all w-fit"
            >
              <FaWhatsapp className="text-xl" /> Chat on WhatsApp
            </a>

            {/* Map */}
            <div className="mt-8 rounded-2xl overflow-hidden shadow-card h-52">
              <iframe
                src={import.meta.env.VITE_GOOGLE_MAPS_EMBED || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3684.1!2d88.35!3d22.57!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjLCsDM0JzEyLjAiTiA4OMKwMjEnMDAuMCJF!5e0!3m2!1sen!2sin!4v1"}
                width="100%" height="100%"
                style={{ border: 0 }}
                allowFullScreen loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Shop Location"
              />
            </div>
          </motion.div>

          {/* Form */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="card p-8">
              {success ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center mx-auto mb-4">
                    <MdCheckCircle className="text-3xl text-brand-600" />
                  </div>
                  <h3 className="text-xl font-display font-bold text-slate-900 dark:text-white mb-2">Message Sent!</h3>
                  <p className="text-slate-500 mb-6">We'll get back to you within 24 hours.</p>
                  <button onClick={() => setSuccess(false)} className="btn-primary">Send Another Message</button>
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-display font-bold text-slate-900 dark:text-white mb-6">Send a Message</h2>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Name <span className="text-red-500">*</span></label>
                        <input type="text" placeholder="Your name" value={form.name}
                          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                          className="input-field" required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Phone <span className="text-red-500">*</span></label>
                        <input type="tel" placeholder="10-digit number" value={form.phone} maxLength={10}
                          onChange={e => setForm(f => ({ ...f, phone: e.target.value.replace(/\D/g, '') }))}
                          className="input-field" required />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email <span className="text-red-500">*</span></label>
                      <input type="email" placeholder="your@email.com" value={form.email}
                        onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                        className="input-field" required />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Subject <span className="text-red-500">*</span></label>
                      <input type="text" placeholder="What is this about?" value={form.subject}
                        onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                        className="input-field" required />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Message <span className="text-red-500">*</span></label>
                      <textarea rows={5} placeholder="Write your message..." value={form.message}
                        onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                        className="input-field resize-none" required />
                    </div>

                    <button type="submit" disabled={submitting} className="btn-primary w-full justify-center py-4 text-base">
                      {submitting
                        ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sending...</span>
                        : <><MdSend /> Send Message</>
                      }
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
