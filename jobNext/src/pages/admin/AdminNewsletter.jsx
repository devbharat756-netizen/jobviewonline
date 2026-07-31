import { useState, useEffect } from 'react';
import { HiEnvelope, HiTrash, HiArrowDownTray, HiMagnifyingGlass } from 'react-icons/hi2';
import { useToast } from '@context/ToastContext';
import { getNewsletterSubscribers, deleteNewsletterSubscriber } from '../../services/jobService';
import { formatDate } from '@utils/helpers';

export default function AdminNewsletter() {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { addToast } = useToast();

  const fetchSubscribers = async () => {
    setLoading(true);
    try {
      const res = await getNewsletterSubscribers();
      if (res.data.success) {
        setSubscribers(res.data.data);
      }
    } catch (err) {
      console.error(err);
      addToast('Failed to fetch subscribers.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this subscriber?')) return;
    try {
      const res = await deleteNewsletterSubscriber(id);
      if (res.data.success) {
        addToast('Subscriber removed successfully.', 'success');
        setSubscribers(prev => prev.filter(s => s._id !== id));
      }
    } catch (err) {
      console.error(err);
      addToast('Failed to remove subscriber.', 'error');
    }
  };

  const exportCSV = () => {
    if (subscribers.length === 0) {
      addToast('No subscribers to export.', 'warning');
      return;
    }
    const headers = ['ID', 'Email Address', 'Subscription Date'];
    const rows = subscribers.map(s => [s._id, s.email, new Date(s.createdAt).toISOString()]);
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `newsletter_subscribers_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('Subscribers list exported as CSV successfully!', 'success');
  };

  const filtered = subscribers.filter(s => 
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-slate-100">Newsletter Subscribers</h1>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Manage and export your newsletter email list</p>
        </div>
        <button
          onClick={exportCSV}
          className="gradient-btn text-white px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2"
        >
          <HiArrowDownTray className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Stats and Search bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-100 dark:border-slate-800/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-950/20 text-primary-600 flex items-center justify-center">
            <HiEnvelope className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-400">Total Subscribers</p>
            <p className="text-xl font-bold text-gray-900 dark:text-slate-200">{subscribers.length}</p>
          </div>
        </div>

        <div className="md:col-span-2 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-gray-100 dark:border-slate-800/80 shadow-sm flex items-center">
          <div className="relative w-full">
            <HiMagnifyingGlass className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search subscribers by email..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:bg-slate-950 dark:text-slate-200"
            />
          </div>
        </div>
      </div>

      {/* Table grid */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800/80 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500 dark:text-slate-400">
            <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            Loading subscribers list...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-gray-500 dark:text-slate-400">
            No subscribers found matching your criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-slate-800/50">
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Email Address</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Subscription Date</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-150 dark:divide-slate-800/60 bg-white dark:bg-slate-900">
                {filtered.map(sub => (
                  <tr key={sub._id} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/10 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-semibold text-gray-900 dark:text-slate-200">{sub.email}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-500 dark:text-slate-400">{formatDate(sub.createdAt)}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleDelete(sub._id)}
                        className="w-8 h-8 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 flex items-center justify-center text-red-600 hover:text-red-700 transition-colors ml-auto"
                        title="Remove Subscriber"
                      >
                        <HiTrash className="w-4.5 h-4.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
