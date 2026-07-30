import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HiBars3, HiXMark, HiBriefcase, HiUserCircle, HiSun, HiMoon } from 'react-icons/hi2';
import { motion, AnimatePresence } from 'framer-motion';
import { NAV_LINKS } from '@utils/constants';
import { useTheme } from '@context/ThemeContext';
import AdPlaceholder from '@components/common/AdPlaceholder';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setIsOpen(false); }, [location]);

  const isActive = (path) => location.pathname === path;

  return (
    <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
      scrolled
        ? 'bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl shadow-sm shadow-gray-200/50 dark:shadow-slate-950/40'
        : 'bg-transparent'
    }`}>
      <AdPlaceholder type="horizontal" label="Header Ad Space" />
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center shadow-md shadow-primary-500/25">
              <HiBriefcase className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-extrabold text-gray-900 dark:text-slate-100 tracking-tight">
              Job<span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">View</span>
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-1.5">
            {NAV_LINKS.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  isActive(link.path)
                    ? 'text-primary-700 bg-primary-50/80 border border-primary-100/60 dark:bg-primary-500/10 dark:text-primary-400 dark:border-primary-500/10 shadow-sm'
                    : 'text-gray-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50/60 dark:hover:bg-slate-800/60'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800/70 flex items-center justify-center text-gray-600 dark:text-slate-300 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <HiMoon className="w-5 h-5" /> : <HiSun className="w-5 h-5" />}
            </button>

            {user ? (
              <div className="hidden sm:flex items-center gap-2">
                <Link to="/dashboard" className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800/70 rounded-xl transition-colors">
                  <HiUserCircle className="w-5 h-5" />
                  Dashboard
                </Link>
                <button onClick={logout} className="px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-colors cursor-pointer">
                  Logout
                </button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link to="/login" className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800/70 rounded-xl transition-colors">
                  Login
                </Link>
                <Link to="/signup" className="gradient-btn text-white px-4 py-2 rounded-xl text-sm font-semibold">
                  Sign Up
                </Link>
              </div>
            )}

            <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden w-9 h-9 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800/70 flex items-center justify-center text-gray-600 dark:text-slate-300" aria-label="Toggle menu">
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
            className="lg:hidden bg-white/95 dark:bg-slate-950/95 border-t border-gray-100 dark:border-slate-800 overflow-hidden"
          >
            <div className="px-4 py-3 space-y-1">
              {NAV_LINKS.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`block px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive(link.path)
                      ? 'text-primary-600 bg-primary-50 dark:bg-primary-500/10 dark:text-primary-400'
                      : 'text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800/70'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {user ? (
                <>
                  <Link to="/dashboard" className="block px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800/70">Dashboard</Link>
                  <Link to="/dashboard/profile" className="block px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800/70">Profile</Link>
                  <button onClick={logout} className="w-full text-left block px-4 py-2.5 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20">Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" className="block px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800/70">Login</Link>
                  <Link to="/signup" className="block px-4 py-2.5 rounded-xl text-sm font-medium text-primary-600 dark:text-primary-400 hover:bg-gray-50 dark:hover:bg-slate-800/70">Sign Up</Link>
                </>
              )}
              <Link to="/admin/login" className="block px-4 py-2.5 rounded-xl text-sm font-medium text-gray-400 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800/70">Admin Panel</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}