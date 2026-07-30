import { Link } from 'react-router-dom';
import { HiBookmark, HiMapPin, HiClock, HiBriefcase } from 'react-icons/hi2';
import { motion } from 'framer-motion';
import { useLocalStorage } from '@hooks/useLocalStorage';
import { useToast } from '@context/ToastContext';
import { formatDate, getModeColor } from '@utils/helpers';

export default function JobCard({ job, index = 0 }) {
  const [savedJobs, setSavedJobs] = useLocalStorage('savedJobs', []);
  const { addToast } = useToast();
  const isSaved = savedJobs.some(s => s.id === job.id);

  const toggleSave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isSaved) {
      setSavedJobs(prev => prev.filter(s => s.id !== job.id));
      addToast('Job removed from saved', 'info');
    } else {
      setSavedJobs(prev => [...prev, { id: job.id, savedAt: new Date().toISOString() }]);
      addToast('Job saved successfully', 'success');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link to={`/jobs/${job.id}`} className="block bg-white rounded-2xl p-6 shadow-sm border border-gray-100 card-hover group">
        <div className="flex items-start gap-4 mb-4">
          <img
            src={job.companyLogo || `https://ui-avatars.com/api/?name=${encodeURIComponent(job.company)}&background=random&size=80`}
            alt={job.company}
            className="w-12 h-12 rounded-xl object-cover bg-gray-100 flex-shrink-0"
            loading="lazy"
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900 group-hover:text-primary-600 transition-colors truncate">{job.title}</h3>
            <p className="text-sm text-gray-500">{job.company}</p>
          </div>
          <button
            onClick={toggleSave}
            className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all flex-shrink-0 ${
              isSaved ? 'bg-primary-50 text-primary-600' : 'hover:bg-gray-100 text-gray-400'
            }`}
            aria-label={isSaved ? 'Unsave job' : 'Save job'}
          >
            <HiBookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-600 bg-gray-50 px-2.5 py-1 rounded-lg">
            <HiMapPin className="w-3.5 h-3.5" />{job.location}
          </span>
          <span className={`inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-lg ${getModeColor(job.mode)}`}>
            {job.mode}
          </span>
          <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-600 bg-gray-50 px-2.5 py-1 rounded-lg">
            <HiClock className="w-3.5 h-3.5" />{job.experience}
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {job.skills.slice(0, 3).map(skill => (
            <span key={skill} className="text-xs text-primary-700 bg-primary-50 px-2 py-0.5 rounded-md">{skill}</span>
          ))}
          {job.skills.length > 3 && (
            <span className="text-xs text-gray-400 px-2 py-0.5">+{job.skills.length - 3}</span>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-50">
          <span className="text-sm font-semibold text-gray-800 flex items-center gap-1">
            <HiBriefcase className="w-4 h-4 text-primary-500" />{job.salary}
          </span>
          <span className="text-xs text-gray-400">{formatDate(job.postedDate)}</span>
        </div>
      </Link>
    </motion.div>
  );
}