export function formatDate(dateStr) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now - date;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
}

export function truncateText(text, maxLength = 120) {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}

export function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export function generateId() {
  return Date.now() + Math.floor(Math.random() * 1000);
}

export function getInitials(name) {
  if (!name) return '?';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
}

export function getStatusColor(status) {
  const colors = {
    'Applied': 'bg-blue-100 text-blue-700',
    'Shortlisted': 'bg-amber-100 text-amber-700',
    'Interview': 'bg-purple-100 text-purple-700',
    'Rejected': 'bg-red-100 text-red-700',
    'Hired': 'bg-emerald-100 text-emerald-700',
  };
  return colors[status] || 'bg-gray-100 text-gray-700';
}

export function getModeColor(mode) {
  const colors = {
    'Remote': 'bg-emerald-100 text-emerald-700',
    'Hybrid': 'bg-amber-100 text-amber-700',
    'Onsite': 'bg-blue-100 text-blue-700',
  };
  return colors[mode] || 'bg-gray-100 text-gray-700';
}