import { useEffect, useState } from 'react';
import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import { HiBriefcase, HiHome, HiRectangleStack, HiBuildingOffice2, HiSquares2X2, HiChartBar, HiCog6Tooth, HiArrowRightOnRectangle, HiBars3, HiXMark, HiUsers, HiEnvelope } from 'react-icons/hi2';
import { motion, AnimatePresence } from 'framer-motion';

const links = [
  { label: 'Dashboard', path: '/admin', icon: HiHome },
  { label: 'Jobs', path: '/admin/jobs', icon: HiRectangleStack },
  { label: 'Companies', path: '/admin/companies', icon: HiBuildingOffice2 },
  { label: 'Categories', path: '/admin/categories', icon: HiSquares2X2 },
  { label: 'Skills', path: '/admin/skills', icon: HiBriefcase },
  { label: 'Applications', path: '/admin/applications', icon: HiUsers },
  { label: 'Newsletter', path: '/admin/newsletter', icon: HiEnvelope },
  { label: 'Analytics', path: '/admin/analytics', icon: HiChartBar },
  { label: 'Settings', path: '/admin/settings', icon: HiCog6Tooth },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem('adminAuth') !== 'true') navigate('/admin/login');
  }, []);

  const logout = () => { sessionStorage.removeItem('adminAuth'); navigate('/admin/login'); };
  const isActive = (path) => path === '/admin' ? location.pathname === '/admin' : location.pathname.startsWith(path);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 w-64 bg-slate-950 border-r border-slate-850/80 z-50 transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between p-5 border-b border-slate-900">
          <Link to="/admin" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-600 rounded-lg flex items-center justify-center shadow-md shadow-primary-500/10"><HiBriefcase className="w-4 h-4 text-white" /></div>
            <span className="text-lg font-extrabold text-white tracking-tight">Job<span className="text-primary-400 font-semibold">Nest</span></span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-400 hover:text-white"><HiXMark className="w-5 h-5" /></button>
        </div>
        <nav className="p-3 space-y-1.5 mt-3">
          {links.map(link => (
            <Link key={link.path} to={link.path} onClick={() => setSidebarOpen(false)} className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${isActive(link.path) ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-lg shadow-primary-500/10' : 'text-slate-400 hover:bg-slate-900 hover:text-white'}`}>
              <link.icon className="w-5 h-5" />{link.label}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-slate-900 bg-slate-950">
          <Link to="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:bg-slate-900 hover:text-white transition-colors mb-1"><HiHome className="w-5 h-5" />View Website</Link>
          <button onClick={logout} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-950/40 hover:text-red-300 transition-colors w-full"><HiArrowRightOnRectangle className="w-5 h-5" />Logout</button>
        </div>
      </aside>
 
      {/* Overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />}
 
      {/* Main */}
      <div className="flex-1 lg:ml-64">
        <header className="bg-white/90 dark:bg-slate-900/90 border-b border-gray-150 dark:border-slate-800/80 px-6 py-4 flex items-center justify-between sticky top-0 z-30 backdrop-blur-md">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden w-9 h-9 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 flex items-center justify-center"><HiBars3 className="w-5 h-5 text-gray-600 dark:text-slate-350" /></button>
          <h2 className="text-lg font-bold text-gray-900 dark:text-slate-100 capitalize">{location.pathname.split('/').pop() || 'Dashboard'}</h2>
          <div className="w-8.5 h-8.5 rounded-full bg-gradient-to-tr from-primary-500 to-secondary-500 text-white flex items-center justify-center text-sm font-extrabold shadow-sm">A</div>
        </header>
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}