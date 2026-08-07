import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiEnvelope, HiLockClosed, HiArrowRight, HiEye, HiEyeSlash, HiBriefcase } from 'react-icons/hi2';
import SEO from '@components/common/SEO';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('candidate');
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};
    if (!email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = 'Please enter a valid email address';
    }
    if (!password) errs.password = 'Password is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    await login(email, password, role);
    setSubmitting(false);
  };

  const inputClass = (field) => `w-full pl-11 ${field === 'password' ? 'pr-11' : 'pr-4'} py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors ${errors[field] ? 'border-red-300 bg-red-50/30' : 'border-gray-200 dark:border-slate-800'}`;

  return (
    <>
      <SEO path="/login" title="Login" description="Sign in to your candidate account on viewjob." />

      <div className="min-h-screen pt-4 pb-16 flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-amber-50/50 dark:from-slate-950 dark:via-slate-900/40 dark:to-slate-950 px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full"
        >
          {/* Logo & Header */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-md shadow-primary-200">
                <HiBriefcase className="w-5.5 h-5.5 text-white" />
              </div>
              <span className="text-2xl font-extrabold text-gray-900 dark:text-slate-100">
                view<span className="text-primary-600">job</span>
              </span>
            </Link>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100">Welcome Back</h2>
            <p className="text-sm text-gray-500 mt-1.5">
              {role === 'candidate'
                ? 'Sign in to search jobs and manage applications'
                : 'Sign in to post jobs and review candidates'}
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-slate-800/80">
            {/* Role Selection Tabs */}
            <div className="flex bg-gray-100 dark:bg-slate-800 p-1 rounded-xl mb-6">
              <button
                type="button"
                onClick={() => setRole('candidate')}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${role === 'candidate'
                    ? 'bg-white dark:bg-slate-700 text-primary-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700 dark:hover:text-slate-300'
                  }`}
              >
                Candidate
              </button>
              <button
                type="button"
                onClick={() => setRole('recruiter')}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${role === 'recruiter'
                    ? 'bg-white dark:bg-slate-700 text-primary-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700 dark:hover:text-slate-300'
                  }`}
              >
                Employer / Company
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">Email Address</label>
                <div className="relative">
                  <HiEnvelope className="w-5 h-5 text-gray-400 absolute left-4 top-3.5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={inputClass('email')}
                    placeholder="john@example.com"
                    disabled={submitting}
                  />
                </div>
                {errors.email && <p className="text-xs text-red-500 mt-1.5">{errors.email}</p>}
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">Password</label>
                </div>
                <div className="relative">
                  <HiLockClosed className="w-5 h-5 text-gray-400 absolute left-4 top-3.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={inputClass('password')}
                    placeholder="••••••••"
                    disabled={submitting}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600 dark:hover:text-slate-200 transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <HiEyeSlash className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-red-500 mt-1.5">{errors.password}</p>}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full gradient-btn text-white py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-60 transition-opacity"
              >
                {submitting ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    Sign In
                    <HiArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center border-t border-gray-50 dark:border-slate-800/80 pt-5">
              <p className="text-sm text-gray-500">
                New to viewjob?{' '}
                <Link to="/signup" className="text-primary-600 hover:text-primary-700 font-semibold">
                  Create an account
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}
