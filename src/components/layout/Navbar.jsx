import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HiBars3, HiXMark, HiBriefcase, HiUserCircle, HiSun, HiMoon } from 'react-icons/hi2';
import { motion, AnimatePresence } from 'framer-motion';
import { NAV_LINKS } from '@utils/constants';
import { useTheme } from '@context/ThemeContext';
import AdPlaceholder from '@components/common/AdPlaceholder';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setIsOpen(false); }, [location]);

  const isActive = (path) => location.pathname === path;

  return (
    <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
      scrolled ? 'bg-white/90 backdrop-blur-xl shadow-sm shadow-gray-200/50' : 'bg-transparent'
    }`}>
      <AdPlaceholder type="horizontal" label="Header Ad Space" />
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-md shadow-primary-200">
              <HiBriefcase className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-extrabold text-gray-900">
              Job<span className="text-primary-600">Next</span>
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right */}
          <div className="flex items-center gap-2">
            {/* <button onClick={toggleTheme} className="w-9 h-9 rounded-xl hover:bg-gray-100 flex items-center justify-center text-gray-500 transition-colors" aria-label="Toggle theme">
              {theme === 'light' ? <HiMoon className="w-5 h-5" /> : <HiSun className="w-5 h-5" />}
            </button> */}
            <Link to="/dashboard" className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-xl transition-colors">
              <HiUserCircle className="w-5 h-5" />
              Dashboard
            </Link>
            {/* <Link to="/admin/login" className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 rounded-xl transition-colors">
              Admin
            </Link> */}
            <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden w-9 h-9 rounded-xl hover:bg-gray-100 flex items-center justify-center text-gray-600" aria-label="Toggle menu">
              {isOpen ? <HiXMark className="w-5 h-5" /> : <HiBars3 className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t border-gray-100 overflow-hidden"
          >
            <div className="px-4 py-3 space-y-1">
              {NAV_LINKS.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`block px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive(link.path) ? 'text-primary-600 bg-primary-50' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link to="/dashboard" className="block px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50">Dashboard</Link>
              <Link to="/admin/login" className="block px-4 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:bg-gray-50">Admin Panel</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}