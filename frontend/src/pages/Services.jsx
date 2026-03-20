import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { serviceAPI } from '../services/api'
import ServiceCard from '../components/ServiceCard'
import { ServiceSkeleton } from '../components/Skeletons'
import { Link } from 'react-router-dom'
import { MdArrowForward } from 'react-icons/md'
import { FaWhatsapp } from 'react-icons/fa'

export default function Services() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const wa = import.meta.env.VITE_WHATSAPP_NUMBER || '9883486739'

  useEffect(() => {
    serviceAPI.getAll()
      .then(r => setServices(r.data.services))
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      <Helmet>
        <title>Digital Services – Lokennath Printing & Stationery</title>
        <meta name="description" content="Aadhaar, Voter ID, tax payment, money transfer, and government scheme applications — all at Lokennath Printing & Stationery." />
      </Helmet>

      {/* Header */}
      <div className="bg-gradient-to-r from-ocean-900 to-slate-900 py-16">
        <div className="page-container text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-ocean-400 font-semibold text-sm uppercase tracking-wider">Digital Services</span>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white mt-2">
              Government & Digital Services
            </h1>
            <p className="text-slate-400 mt-4 text-lg max-w-2xl mx-auto">
              Expert assistance for all your documentation and financial needs. Quick, accurate, and hassle-free.
            </p>
          </motion.div>
        </div>
      </div>

      {/* How it works */}
      <section className="bg-slate-50 dark:bg-slate-900/50 py-12">
        <div className="page-container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { step: '01', title: 'Request Service', desc: 'Fill the service request form or WhatsApp us with your requirement.' },
              { step: '02', title: 'Bring Documents', desc: 'Visit our shop with the required documents. We guide you on what to bring.' },
              { step: '03', title: 'Done!', desc: 'We handle the paperwork and submission. You get timely updates.' },
            ].map(({ step, title, desc }) => (
              <motion.div key={step}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex gap-4 items-start"
              >
                <span className="text-4xl font-display font-bold text-ocean-200 dark:text-ocean-800 leading-none">{step}</span>
                <div>
                  <h3 className="font-display font-bold text-slate-900 dark:text-white">{title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services grid */}
      <section className="py-16 page-container">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading
            ? Array(6).fill(0).map((_, i) => <ServiceSkeleton key={i} />)
            : services.map((s, i) => (
                <motion.div key={s.id}
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                >
                  <ServiceCard service={s} />
                </motion.div>
              ))
          }
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-14 rounded-3xl bg-gradient-to-r from-ocean-600 to-brand-600 p-10 text-center text-white"
        >
          <h2 className="text-2xl md:text-3xl font-display font-bold mb-3">Don't see what you need?</h2>
          <p className="text-white/80 mb-6">We handle many more services. Just ask us!</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/contact" className="bg-white text-ocean-700 font-bold px-8 py-3 rounded-xl hover:bg-slate-50 transition-all flex items-center gap-2">
              Contact Us <MdArrowForward />
            </Link>
            <a
              href={`https://wa.me/${wa}?text=Hi! I need help with a service.`}
              target="_blank" rel="noopener noreferrer"
              className="bg-green-500 hover:bg-green-600 text-white font-bold px-8 py-3 rounded-xl transition-all flex items-center gap-2"
            >
              <FaWhatsapp /> WhatsApp Us
            </a>
          </div>
        </motion.div>
      </section>
    </>
  )
}
