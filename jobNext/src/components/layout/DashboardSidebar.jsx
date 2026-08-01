import { Link, useLocation } from 'react-router-dom';
import { HiHome, HiUserCircle, HiDocumentText, HiBookmark, HiArrowLeft } from 'react-icons/hi2';
import { useAuth } from '../../context/AuthContext';

const links = [
  { label: 'Overview', path: '/dashboard', icon: HiHome },
  { label: 'Profile', path: '/dashboard/profile', icon: HiUserCircle },
  { label: 'Applications', path: '/dashboard/applications', icon: HiDocumentText },
  { label: 'Saved Jobs', path: '/dashboard/saved-jobs', icon: HiBookmark },
];

export default function DashboardSidebar() {
  const location = useLocation();
  const { user } = useAuth();
  const isActive = (path) => location.pathname === path;

  const filteredLinks = user?.role === 'recruiter'
    ? links.filter(l => l.path === '/dashboard' || l.path === '/dashboard/profile')
    : links;

  return (
    <aside className="w-full lg:w-64 flex-shrink-0">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        {user?.role === 'recruiter' ? (
          <Link to="/dashboard" className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary-600 transition-colors mb-4 px-3 py-2">
            <HiArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
        ) : (
          <Link to="/" className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary-600 transition-colors mb-4 px-3 py-2">
            <HiArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        )}
        <nav className="space-y-1">
          {filteredLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive(link.path)
                  ? 'bg-primary-50 text-primary-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <link.icon className="w-5 h-5" />
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
}