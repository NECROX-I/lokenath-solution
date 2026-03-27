import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import SEO from '../components/SEO'
import { motion } from 'framer-motion'
import { productAPI, serviceAPI } from '../services/api'
import ProductCard from '../components/ProductCard'
import ServiceCard from '../components/ServiceCard'
import { ProductSkeleton, ServiceSkeleton } from '../components/Skeletons'
import {
  MdArrowForward, MdStar, MdPhone, MdLocationOn,
  MdVerified, MdAccessTime, MdPeople
} from 'react-icons/md'
import { FaWhatsapp } from 'react-icons/fa'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } })
}

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [services, setServices] = useState([])
  const [loadingP, setLoadingP] = useState(true)
  const [loadingS, setLoadingS] = useState(true)
  const wa = import.meta.env.VITE_WHATSAPP_NUMBER || '919876543210'

  useEffect(() => {
    productAPI.getAll({ featured: 'true', limit: 4 })
      .then(r => setFeaturedProducts(r.data.products))
      .finally(() => setLoadingP(false))

    serviceAPI.getAll()
      .then(r => setServices(r.data.services.slice(0, 4)))
      .finally(() => setLoadingS(false))
  }, [])

  return (
    <>
      <SEO
        description="Loknath Solution — your trusted neighbourhood shop in West Bengal for notebooks, pens, school stationery, educational toys, Aadhaar services, Voter ID, tax filing, money transfer and government schemes."
        keywords="Loknath Solution, stationery shop West Bengal, Aadhaar center, Voter ID services, tax filing help, online money transfer, educational toys, notebooks pens, government schemes"
        canonical="/"
        schema={{
          "@context": "https://schema.org",
          "@type": "Store",
          "name": "Loknath Solution",
          "description": "Stationery, Toys & Digital Services",
          "url": "https://loknathasolution.com",
          "telephone": "+919876543210"
        }}
      />

      {/* ── Hero ───────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden min-h-[90vh] flex items-center">
        {/* Background mesh */}
        <div className="absolute inset-0 bg-mesh opacity-60" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=60 height=60 viewBox=0 0 60 60 xmlns=http://www.w3.org/2000/svg%3E%3Cg fill=none fill-rule=evenodd%3E%3Cg fill=%23ffffff opacity=.03%3E%3Ccircle cx=30 cy=30 r=1/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]" />

        {/* Floating elements */}
        <div className="absolute top-20 right-20 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-20 left-20 w-48 h-48 bg-ocean-500/10 rounded-full blur-3xl animate-pulse-slow" />

        <div className="page-container relative z-10 py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial="hidden"
              animate="show"
              variants={{ show: { transition: { staggerChildren: 0.1 } } }}
            >
              <motion.div variants={fadeUp} custom={0}>
                <span className="inline-flex items-center gap-2 bg-brand-600/20 border border-brand-500/30 text-brand-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
                  <MdVerified /> Trusted Since 2010 · Your Neighbourhood Shop
                </span>
              </motion.div>

              <motion.h1 variants={fadeUp} custom={1} className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white leading-tight">
                Everything You Need,{' '}
                <span className="text-gradient">Right Here</span>
              </motion.h1>

              <motion.p variants={fadeUp} custom={2} className="text-slate-300 text-lg mt-5 leading-relaxed max-w-lg">
                From school stationery and educational toys to Aadhaar services and tax filing — Loknath Solution is your one-stop shop for all essentials.
              </motion.p>

              <motion.div variants={fadeUp} custom={3} className="flex flex-wrap gap-3 mt-8">
                <Link to="/products" className="btn-primary text-base px-7 py-3.5">
                  Shop Now <MdArrowForward />
                </Link>
                <Link to="/services" className="btn-outline border-white/30 text-white hover:bg-white hover:text-slate-900 text-base px-7 py-3.5">
                  Our Services
                </Link>
                <a
                  href={`https://wa.me/${wa}?text=Hello%20Loknath%20Solution!%20I%20have%20an%20inquiry.`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold text-base px-7 py-3.5 rounded-xl transition-all hover:-translate-y-0.5"
                >
                  <FaWhatsapp className="text-lg" /> WhatsApp
                </a>
              </motion.div>

              <motion.div variants={fadeUp} custom={4} className="flex flex-wrap gap-6 mt-10">
                {[
                  { icon: MdPeople, val: '5000+', label: 'Happy Customers' },
                  { icon: MdStar, val: '4.9★', label: 'Customer Rating' },
                  { icon: MdAccessTime, val: '14 yrs', label: 'In Business' },
                ].map(({ icon: Icon, val, label }) => (
                  <div key={label} className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                      <Icon className="text-brand-400 text-lg" />
                    </div>
                    <div>
                      <p className="text-white font-bold text-sm">{val}</p>
                      <p className="text-slate-400 text-xs">{label}</p>
                    </div>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Hero cards */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="hidden lg:grid grid-cols-2 gap-4"
            >
              {[
                { emoji: '📚', title: 'Stationery', desc: 'Notebooks, pens, office supplies & more', color: 'from-ocean-500/20 to-ocean-600/10', to: '/products?category=stationery' },
                { emoji: '🧸', title: 'Toys', desc: 'Educational & fun toys for all ages', color: 'from-brand-500/20 to-brand-600/10', to: '/products?category=toys' },
                { emoji: '🪪', title: 'Aadhaar & ID', desc: 'All government ID services', color: 'from-purple-500/20 to-purple-600/10', to: '/services/aadhaar-services' },
                { emoji: '🧾', title: 'Tax & Finance', desc: 'ITR, GST, money transfers', color: 'from-amber-500/20 to-amber-600/10', to: '/services/tax-payment' },
              ].map(({ emoji, title, desc, color, to }) => (
                <Link key={title} to={to}
                  className={`bg-gradient-to-br ${color} backdrop-blur-sm border border-white/10 rounded-2xl p-5 hover:border-white/20 hover:-translate-y-1 transition-all duration-300`}
                >
                  <span className="text-4xl block mb-3">{emoji}</span>
                  <h3 className="text-white font-display font-bold text-sm">{title}</h3>
                  <p className="text-slate-400 text-xs mt-1 leading-relaxed">{desc}</p>
                </Link>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Stats bar ──────────────────────────────── */}
      <section className="bg-brand-600 text-white py-6">
        <div className="page-container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { val: '500+', label: 'Products' },
              { val: '7', label: 'Digital Services' },
              { val: '5000+', label: 'Happy Customers' },
              { val: '14 yrs', label: 'Experience' },
            ].map(({ val, label }) => (
              <div key={label}>
                <p className="text-2xl md:text-3xl font-display font-bold">{val}</p>
                <p className="text-brand-100 text-sm mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Products ──────────────────────── */}
      <section className="py-20 page-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10"
        >
          <div>
            <span className="text-brand-600 dark:text-brand-400 font-semibold text-sm uppercase tracking-wider">Top Picks</span>
            <h2 className="section-title mt-1">Featured Products</h2>
          </div>
          <Link to="/products" className="btn-outline whitespace-nowrap">
            View All Products <MdArrowForward />
          </Link>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {loadingP
            ? Array(4).fill(0).map((_, i) => <ProductSkeleton key={i} />)
            : featuredProducts.map((p, i) => (
                <motion.div key={p._id}
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                >
                  <ProductCard product={p} />
                </motion.div>
              ))
          }
        </div>
      </section>

      {/* ── Services ───────────────────────────────── */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900/50">
        <div className="page-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5 }}
            className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10"
          >
            <div>
              <span className="text-ocean-600 dark:text-ocean-400 font-semibold text-sm uppercase tracking-wider">Digital Services</span>
              <h2 className="section-title mt-1">How Can We Help?</h2>
              <p className="section-subtitle">Government services, documentation, and financial assistance — all in one place.</p>
            </div>
            <Link to="/services" className="btn-secondary whitespace-nowrap">
              All Services <MdArrowForward />
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {loadingS
              ? Array(4).fill(0).map((_, i) => <ServiceSkeleton key={i} />)
              : services.map((s, i) => (
                  <motion.div key={s.id}
                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  >
                    <ServiceCard service={s} />
                  </motion.div>
                ))
            }
          </div>
        </div>
      </section>

      {/* ── WhatsApp CTA ───────────────────────────── */}
      <section className="py-20 page-container">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="rounded-3xl bg-gradient-to-r from-brand-600 to-ocean-600 p-10 md:p-16 text-white text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=40 height=40 viewBox=0 0 40 40 xmlns=http://www.w3.org/2000/svg%3E%3Cg fill=%23fff opacity=.05%3E%3Ccircle cx=20 cy=20 r=1/%3E%3C/g%3E%3C/svg%3E')]" />
          <div className="relative z-10">
            <FaWhatsapp className="text-5xl mx-auto mb-4 opacity-90" />
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-3">Need Help? Chat With Us!</h2>
            <p className="text-white/80 text-lg mb-8 max-w-lg mx-auto">
              Have questions about a service or want to place an order? We're just a WhatsApp message away.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a
                href={`https://wa.me/${wa}?text=Hello%20Loknath%20Solution!`}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 bg-white text-green-700 hover:bg-green-50 font-bold px-8 py-4 rounded-xl transition-all hover:-translate-y-1 shadow-xl"
              >
                <FaWhatsapp className="text-xl" /> Chat on WhatsApp
              </a>
              <a href={`tel:+91${wa.replace('91','')}`}
                className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white border border-white/30 font-semibold px-8 py-4 rounded-xl transition-all"
              >
                <MdPhone className="text-xl" /> Call Us
              </a>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── Location ───────────────────────────────── */}
      <section className="pb-20 page-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="card overflow-hidden"
        >
          <div className="grid md:grid-cols-2">
            <div className="p-8 md:p-10 flex flex-col justify-center">
              <span className="text-brand-600 dark:text-brand-400 font-semibold text-sm uppercase tracking-wider mb-2">Find Us</span>
              <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white mb-4">Visit Our Shop</h2>
              <div className="space-y-4 text-sm text-slate-600 dark:text-slate-400">
                <div className="flex gap-3 items-start">
                  <MdLocationOn className="text-brand-600 text-xl flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">Address</p>
                    <p>123 Main Market, Near Post Office,<br />Your City – 700001, West Bengal</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <MdAccessTime className="text-brand-600 text-xl flex-shrink-0" />
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">Shop Hours</p>
                    <p>Mon–Sat: 9:00 AM – 8:00 PM</p>
                    <p>Sunday: 10:00 AM – 5:00 PM</p>
                  </div>
                </div>
              </div>
              <Link to="/contact" className="btn-primary mt-6 w-fit">
                Get Directions <MdArrowForward />
              </Link>
            </div>
            <div className="h-64 md:h-auto">
              <iframe
                src={import.meta.env.VITE_GOOGLE_MAPS_EMBED || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3684.1!2d88.35!3d22.57!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjLCsDM0JzEyLjAiTiA4OMKwMjEnMDAuMCJF!5e0!3m2!1sen!2sin!4v1"}
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '280px' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Loknath Solution Location"
              />
            </div>
          </div>
        </motion.div>
      </section>
    </>
  )
}