import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MdArrowForward } from 'react-icons/md'

export default function ServiceCard({ service }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="card p-6 flex flex-col group cursor-pointer"
    >
      <Link to={`/services/${service.id}`} className="flex flex-col flex-1">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-50 to-ocean-50 dark:from-brand-900/20 dark:to-ocean-900/20 flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">
          {service.icon}
        </div>
        <h3 className="font-display font-bold text-slate-900 dark:text-white text-base mb-2 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
          {service.title}
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed flex-1">
          {service.shortDesc}
        </p>
        {service.charges && (
          <p className="text-xs text-brand-600 dark:text-brand-400 font-semibold mt-3">
            {service.charges}
          </p>
        )}
        <div className="flex items-center gap-1 text-brand-600 dark:text-brand-400 text-sm font-semibold mt-4 group-hover:gap-2 transition-all">
          Learn More <MdArrowForward className="text-base" />
        </div>
      </Link>
    </motion.div>
  )
}
