import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiBriefcase, HiLockClosed } from 'react-icons/hi2';
import { motion } from 'framer-motion';
import { ADMIN_PASSWORD } from '@utils/constants';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem('adminAuth', 'true');
      navigate('/admin');
    } else {
      setError('Invalid password');
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary-500/30">
            <HiBriefcase className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-white">Admin Panel</h1>
          <p className="text-gray-400 text-sm mt-1">jobNext Administration</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Password</label>
            <div className="relative">
              <HiLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input type="password" value={password} onChange={e => { setPassword(e.target.value); setError(''); }} className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500" placeholder="Enter admin password" autoFocus />
            </div>
            {error && <p className="text-red-400 text-xs mt-1.5">{error}</p>}
          </div>
          <button type="submit" className="w-full gradient-btn text-white py-3 rounded-xl font-semibold text-sm">Sign In</button>
        </form>
      </motion.div>
    </div>
  );
}