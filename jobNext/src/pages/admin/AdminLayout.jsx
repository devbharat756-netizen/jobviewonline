import { useEffect, useState } from 'react';
import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import { HiBriefcase, HiHome, HiRectangleStack, HiBuildingOffice2, HiSquares2X2, HiChartBar, HiCog6Tooth, HiArrowRightOnRectangle, HiBars3, HiXMark } from 'react-icons/hi2';
import { motion, AnimatePresence } from 'framer-motion';

const links = [
  { label: 'Dashboard', path: '/admin', icon: HiHome },
  { label: 'Jobs', path: '/admin/jobs', icon: HiRectangleStack },
  { label: 'Companies', path: '/admin/companies', icon: HiBuildingOffice2 },
  { label: 'Categories', path: '/admin/categories', icon: HiSquares2X2 },
  { label: 'Skills', path: '/admin/skills', icon: HiBriefcase },
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
      <aside className={`fixed inset-y-0 left-0 w-64 bg-gray-900 z-50 transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between p-5 border-b border-gray-800">
          <Link to="/admin" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center"><HiBriefcase className="w-4 h-4 text-white" /></div>
            <span className="text-lg font-extrabold text-white">Job<span className="text-primary-400">Nest</span></span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-400 hover:text-white"><HiXMark className="w-5 h-5" /></button>
        </div>
        <nav className="p-3 space-y-1">
          {links.map(link => (
            <Link key={link.path} to={link.path} onClick={() => setSidebarOpen(false)} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${isActive(link.path) ? 'bg-primary-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
              <link.icon className="w-5 h-5" />{link.label}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-gray-800">
          <Link to="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white transition-colors mb-1"><HiHome className="w-5 h-5" />View Website</Link>
          <button onClick={logout} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-900/20 hover:text-red-300 transition-colors w-full"><HiArrowRightOnRectangle className="w-5 h-5" />Logout</button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main */}
      <div className="flex-1 lg:ml-64">
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden w-9 h-9 rounded-lg hover:bg-gray-100 flex items-center justify-center"><HiBars3 className="w-5 h-5 text-gray-600" /></button>
          <h2 className="text-lg font-bold text-gray-900 capitalize">{location.pathname.split('/').pop() || 'Dashboard'}</h2>
          <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-sm font-bold">A</div>
        </header>
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}