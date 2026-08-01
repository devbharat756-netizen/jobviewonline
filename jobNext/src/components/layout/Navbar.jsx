import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    if (user && user.role === 'recruiter') {
      const candidatePaths = ['/jobs', '/freelance', '/companies', '/career-tips', '/faq', '/about', '/contact', '/dashboard/applications', '/dashboard/saved-jobs'];
      const isCurrentPathCandidate = candidatePaths.some(p => location.pathname === p || location.pathname.startsWith(p + '/'));
      if (location.pathname === '/' || isCurrentPathCandidate) {
        navigate('/dashboard');
      }
    }
  }, [user, location.pathname, navigate]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setIsOpen(false); }, [location]);

  const isActive = (path) => location.pathname === path;

  return (
    <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
      scrolled
        ? 'nav-frosted dark:bg-slate-950/90'
        : 'bg-transparent'
    }`}>
      <AdPlaceholder type="horizontal" label="Header Ad Space" />
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[68px]">
          {/* Logo */}
          <Link to={user?.role === 'recruiter' ? "/dashboard" : "/"} className="flex items-center gap-3 flex-shrink-0 group">
            <div className="w-9 h-9 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-700/30 group-hover:shadow-primary-600/50 transition-shadow duration-300">
              <HiBriefcase className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              view<span className="gradient-text">job</span>
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-1">
            {user?.role !== 'recruiter' && NAV_LINKS.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive(link.path)
                    ? 'text-primary-700 dark:text-primary-400 bg-primary-50 dark:bg-primary-500/12 font-semibold'
                    : 'text-gray-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-300 hover:bg-primary-50/60 dark:hover:bg-primary-500/8'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800/70 flex items-center justify-center text-gray-500 dark:text-slate-400 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <HiMoon className="w-4.5 h-4.5" /> : <HiSun className="w-4.5 h-4.5" />}
            </button>

            {user ? (
              <div className="hidden sm:flex items-center gap-2">
                <Link to="/dashboard" className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800/60 rounded-xl transition-colors">
                  <HiUserCircle className="w-5 h-5" />
                  Dashboard
                </Link>
                <button onClick={logout} className="px-4 py-2 text-sm font-medium text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-colors cursor-pointer">
                  Logout
                </button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link to="/login" className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800/60 rounded-xl transition-colors">
                  Login
                </Link>
                <Link to="/signup" className="gradient-btn text-white px-5 py-2 rounded-xl text-sm font-semibold inline-flex items-center">
                  Sign Up
                </Link>
              </div>
            )}

            <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden w-9 h-9 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800/70 flex items-center justify-center text-gray-600 dark:text-slate-400 transition-colors" aria-label="Toggle menu">
              {isOpen ? <HiXMark className="w-5 h-5" /> : <HiBars3 className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden bg-white/97 dark:bg-slate-950/97 backdrop-blur-2xl border-t border-gray-100 dark:border-slate-800/60 overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1">
              {user?.role !== 'recruiter' && NAV_LINKS.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`block px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    isActive(link.path)
                      ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-500/10 font-semibold'
                      : 'text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800/60'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {user ? (
                <>
                  <Link to="/dashboard" className="block px-4 py-3 rounded-xl text-sm font-medium text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800/60">Dashboard</Link>
                  <Link to="/dashboard/profile" className="block px-4 py-3 rounded-xl text-sm font-medium text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800/60">Profile</Link>
                  <button onClick={logout} className="w-full text-left block px-4 py-3 rounded-xl text-sm font-medium text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20">Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" className="block px-4 py-3 rounded-xl text-sm font-medium text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800/60">Login</Link>
                  <Link to="/signup" className="block px-4 py-3 rounded-xl text-sm font-semibold text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-500/10">Sign Up</Link>
                </>
              )}
              <Link to="/admin/login" className="block px-4 py-3 rounded-xl text-sm font-medium text-gray-400 dark:text-slate-500 hover:bg-gray-50 dark:hover:bg-slate-800/60">Admin Panel</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}