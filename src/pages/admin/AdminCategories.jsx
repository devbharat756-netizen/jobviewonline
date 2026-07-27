import { useState, useEffect } from 'react';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch('/data/categories.json')
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error('Failed to load categories:', err));
  }, []);
  return (
    <div>
      <p className="text-sm text-gray-500 mb-6">{categories.length} categories (managed via JSON — edit <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">public/data/categories.json</code> to modify)</p>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="bg-gray-50 text-left"><th className="px-5 py-3 font-medium text-gray-500">Category</th><th className="px-5 py-3 font-medium text-gray-500">Icon</th><th className="px-5 py-3 font-medium text-gray-500">Jobs Count</th><th className="px-5 py-3 font-medium text-gray-500">Color</th></tr></thead>
          <tbody className="divide-y divide-gray-50">
            {categories.map(c => (
              <tr key={c.id} className="hover:bg-gray-50/50">
                <td className="px-5 py-3 font-medium text-gray-900">{c.name}</td>
                <td className="px-5 py-3 text-gray-600 font-mono text-xs">{c.icon}</td>
                <td className="px-5 py-3 text-gray-600">{c.count}</td>
                <td className="px-5 py-3"><div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full" style={{ backgroundColor: c.color }} /><span className="text-xs text-gray-500 font-mono">{c.color}</span></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}