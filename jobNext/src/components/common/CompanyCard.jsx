import { Link } from 'react-router-dom';
import { HiMapPin, HiBriefcase, HiStar } from 'react-icons/hi2';
import { motion } from 'framer-motion';

export default function CompanyCard({ company, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="h-full"
    >
      <Link
        to={`/jobs?company=${encodeURIComponent(company.name)}`}
        className="flex flex-col h-full bg-white rounded-2xl p-6 shadow-sm border border-gray-100 card-hover group text-center"
      >
        <img
          src={company.logo}
          alt={company.name}
          className="w-16 h-16 rounded-xl object-cover mx-auto mb-4 bg-gray-100 flex-shrink-0"
          loading="lazy"
        />
        <h3 className="font-bold text-gray-900 group-hover:text-primary-600 transition-colors mb-1 line-clamp-2 min-h-[2.75rem] leading-snug">{company.name}</h3>
        <p className="text-sm text-gray-500 mb-4 line-clamp-1">{company.industry}</p>
        <div className="flex items-center justify-center gap-1 mb-3">
          <HiStar className="w-4 h-4 text-amber-400 fill-current" />
          <span className="text-sm font-medium text-gray-700">{company.rating}</span>
        </div>
        <div className="flex flex-col gap-1.5 text-xs text-gray-500 mt-auto">
          <span className="flex items-center justify-center gap-1"><HiMapPin className="w-3.5 h-3.5 flex-shrink-0" />{company.location}</span>
          <span className="flex items-center justify-center gap-1"><HiBriefcase className="w-3.5 h-3.5 flex-shrink-0" />{company.openJobs} open jobs</span>
        </div>
      </Link>
    </motion.div>
  );
}