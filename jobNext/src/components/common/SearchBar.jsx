import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiMagnifyingGlass, HiMapPin } from 'react-icons/hi2';
import { motion } from 'framer-motion';

export default function SearchBar({ large = false, onSearch }) {
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (location) params.set('location', location);
    if (onSearch) {
      onSearch({ query, location });
    } else {
      navigate(`/jobs?${params.toString()}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className={`flex flex-col sm:flex-row items-center gap-3 ${large ? 'p-3' : 'p-2'} search-uniform rounded-2xl overflow-hidden`}>
        <div className="flex-1 flex items-center gap-3 px-4 py-2">
          <HiMagnifyingGlass className={`text-gray-300 flex-shrink-0 ${large ? 'w-6 h-6' : 'w-5 h-5'}`} />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Job title, skill, or company"
            className={`w-full py-2 text-gray-100 placeholder-gray-400 focus:outline-none bg-transparent ${large ? 'text-base' : 'text-sm'}`}
          />
        </div>
        <div className="hidden sm:block w-px h-10 bg-gray-700/40" />
        <div className="flex-1 flex items-center gap-3 px-4 py-2">
          <HiMapPin className={`text-gray-300 flex-shrink-0 ${large ? 'w-6 h-6' : 'w-5 h-5'}`} />
          <input
            type="text"
            value={location}
            onChange={e => setLocation(e.target.value)}
            placeholder="Location"
            className={`w-full py-2 text-gray-100 placeholder-gray-400 focus:outline-none bg-transparent ${large ? 'text-base' : 'text-sm'}`}
          />
        </div>
        <motion.button
          whileTap={{ scale: 0.97 }}
          type="submit"
          className={`gradient-btn text-white font-semibold rounded-xl ${large ? 'px-8 py-3.5 text-base' : 'px-6 py-2.5 text-sm'}`}
          style={{ cursor: 'pointer' }}
        >
          Search Jobs
        </motion.button>
      </div>
    </form>
  );
}