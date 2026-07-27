import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiHome, HiArrowLeft } from 'react-icons/hi2';
import SEO from '@components/common/SEO';

export default function NotFound() {
  return (
    <>
      <SEO path="/404" title="Page Not Found" description="The page you're looking for doesn't exist." />
      <div className="pt-32 pb-16">
        <div className="max-w-lg mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
            <p className="text-8xl font-extrabold gradient-text mb-4">404</p>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">Page Not Found</h1>
            <p className="text-gray-500 mb-8">The page you're looking for doesn't exist or has been moved. Let's get you back on track.</p>
            <div className="flex items-center justify-center gap-4">
              <Link to="/" className="gradient-btn text-white px-6 py-3 rounded-xl font-semibold text-sm flex items-center gap-2"><HiHome className="w-4 h-4" /> Go Home</Link>
              <button onClick={() => window.history.back()} className="px-6 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2"><HiArrowLeft className="w-4 h-4" /> Go Back</button>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}