import { Link } from 'react-router-dom'
import { MdStorefront, MdPhone, MdEmail, MdLocationOn } from 'react-icons/md'
import { FaWhatsapp, FaFacebookF, FaInstagram } from 'react-icons/fa'

export default function Footer() {
  const wa = import.meta.env.VITE_WHATSAPP_NUMBER || '919876543210'
  return (
    <footer className="bg-slate-900 text-slate-300 pt-14 pb-6">
      <div className="page-container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-ocean-500 flex items-center justify-center">
                <MdStorefront className="text-white text-xl" />
              </div>
              <span className="font-display font-bold text-white text-base">Loknath Solution</span>
            </div>
            <p className="text-sm leading-relaxed text-slate-400 mb-5">
              Your trusted neighbourhood shop for stationery, educational toys, and essential digital services — all under one roof.
            </p>
            <div className="flex gap-3">
              <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-green-600 flex items-center justify-center transition-all duration-200 text-slate-400 hover:text-white">
                <FaWhatsapp />
              </a>
              <a href="#" className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-blue-600 flex items-center justify-center transition-all duration-200 text-slate-400 hover:text-white">
                <FaFacebookF />
              </a>
              <a href="#" className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-pink-600 flex items-center justify-center transition-all duration-200 text-slate-400 hover:text-white">
                <FaInstagram />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display font-semibold text-white mb-4 text-sm uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-2.5">
              {[
                { to: '/products?category=stationery', label: 'Stationery' },
                { to: '/products?category=toys', label: 'Toys' },
                { to: '/services', label: 'Digital Services' },
                { to: '/contact', label: 'Contact Us' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="text-sm text-slate-400 hover:text-brand-400 transition-colors flex items-center gap-1.5 group">
                    <span className="w-1 h-1 rounded-full bg-brand-500 group-hover:w-2 transition-all" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-display font-semibold text-white mb-4 text-sm uppercase tracking-wider">Services</h3>
            <ul className="space-y-2.5">
              {['Tax Payment', 'Money Transfer', 'Aadhaar Services', 'Voter ID', 'Ration Card', 'Form Filling'].map(s => (
                <li key={s}>
                  <Link to="/services" className="text-sm text-slate-400 hover:text-brand-400 transition-colors flex items-center gap-1.5 group">
                    <span className="w-1 h-1 rounded-full bg-ocean-500 group-hover:w-2 transition-all" />
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display font-semibold text-white mb-4 text-sm uppercase tracking-wider">Contact</h3>
            <ul className="space-y-3">
              <li className="flex gap-3 text-sm text-slate-400">
                <MdLocationOn className="text-brand-500 flex-shrink-0 text-lg mt-0.5" />
                <span>123 Main Market, Near Post Office,<br />Your City – 700001, West Bengal</span>
              </li>
              <li>
                <a href={`tel:+91${wa.replace('91','')}`} className="flex gap-3 text-sm text-slate-400 hover:text-brand-400 transition-colors">
                  <MdPhone className="text-brand-500 flex-shrink-0 text-lg" />
                  +91 {wa.replace('91', '')}
                </a>
              </li>
              <li>
                <a href="mailto:info@loknathasolution.com" className="flex gap-3 text-sm text-slate-400 hover:text-brand-400 transition-colors">
                  <MdEmail className="text-brand-500 flex-shrink-0 text-lg" />
                  info@loknathasolution.com
                </a>
              </li>
              <li className="text-sm text-slate-400 mt-2">
                <span className="text-slate-500 text-xs block mb-1">Shop Hours</span>
                Mon–Sat: 9:00 AM – 8:00 PM<br />
                Sunday: 10:00 AM – 5:00 PM
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} Loknath Solution. All rights reserved.
          </p>
          <Link to="/admin/login" className="text-xs text-slate-600 hover:text-slate-400 transition-colors">
            Admin Login
          </Link>
        </div>
      </div>
    </footer>
  )
}