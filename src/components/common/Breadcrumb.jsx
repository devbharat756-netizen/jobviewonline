import { Link } from 'react-router-dom';
import { HiChevronRight } from 'react-icons/hi2';

export default function Breadcrumb({ items }) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-gray-500 mb-6">
      <Link to="/" className="hover:text-primary-600 transition-colors">Home</Link>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          <HiChevronRight className="w-3.5 h-3.5" />
          {item.path ? (
            <Link to={item.path} className="hover:text-primary-600 transition-colors">{item.label}</Link>
          ) : (
            <span className="text-gray-800 font-medium">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}