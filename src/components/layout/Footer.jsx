import { Link } from 'react-router-dom';
import { HiBriefcase } from 'react-icons/hi2';
import AdPlaceholder from '@components/common/AdPlaceholder';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark-900 text-gray-300">
      <AdPlaceholder type="horizontal" label="Footer Ad Space" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center">
                <HiBriefcase className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-extrabold text-white">job<span className="text-primary-400">Next</span></span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed mb-6">
              Find Your Dream Job. jobNext connects talented professionals with top companies worldwide. Browse thousands of opportunities across every industry.
            </p>
          </div>

          {/* For Job Seekers */}
          <div>
            <h4 className="text-white font-bold mb-4">For Job Seekers</h4>
            <ul className="space-y-2.5">
              <li><Link to="/jobs" className="text-sm text-gray-400 hover:text-primary-400 transition-colors">Browse Jobs</Link></li>
              <li><Link to="/career-tips" className="text-sm text-gray-400 hover:text-primary-400 transition-colors">Career Tips</Link></li>
              <li><Link to="/dashboard" className="text-sm text-gray-400 hover:text-primary-400 transition-colors">My Dashboard</Link></li>
              <li><Link to="/dashboard/saved-jobs" className="text-sm text-gray-400 hover:text-primary-400 transition-colors">Saved Jobs</Link></li>
              <li><Link to="/dashboard/applications" className="text-sm text-gray-400 hover:text-primary-400 transition-colors">My Applications</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-bold mb-4">Company</h4>
            <ul className="space-y-2.5">
              <li><Link to="/about" className="text-sm text-gray-400 hover:text-primary-400 transition-colors">About Us</Link></li>
              <li><Link to="/companies" className="text-sm text-gray-400 hover:text-primary-400 transition-colors">Companies</Link></li>
              <li><Link to="/contact" className="text-sm text-gray-400 hover:text-primary-400 transition-colors">Contact Us</Link></li>
              <li><Link to="/faq" className="text-sm text-gray-400 hover:text-primary-400 transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-bold mb-4">Legal</h4>
            <ul className="space-y-2.5">
              <li><Link to="/privacy-policy" className="text-sm text-gray-400 hover:text-primary-400 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-sm text-gray-400 hover:text-primary-400 transition-colors">Terms of Service</Link></li>
              <li><Link to="/disclaimer" className="text-sm text-gray-400 hover:text-primary-400 transition-colors">Disclaimer</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">&copy; {currentYear} jobNext. All rights reserved.</p>
          <p className="text-xs text-gray-600">Made with care for job seekers everywhere.</p>
        </div>
      </div>
    </footer>
  );
}