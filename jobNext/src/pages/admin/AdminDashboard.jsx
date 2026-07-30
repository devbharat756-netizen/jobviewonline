import { HiBriefcase, HiBuildingOffice2, HiUsers, HiEye } from 'react-icons/hi2';
import StatisticsCard from '@components/common/StatisticsCard';
import { useJobs } from '@hooks/useJobs';
import { useState, useEffect } from 'react';
import { getAdminApplications } from '../../services/jobService';

export default function AdminDashboard() {
  const { jobs } = useJobs();
  const [applications, setApplications] = useState([]);
  const published = jobs.filter(j => j.published !== false).length;
  const unpublished = jobs.length - published;

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const res = await getAdminApplications();
        if (res.data.success) {
          setApplications(res.data.data || []);
        }
      } catch (err) {
        console.error("Failed to fetch admin applications:", err);
      }
    };
    fetchApps();
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatisticsCard icon={HiBriefcase} label="Total Jobs" value={jobs.length} color="primary" index={0} to="jobs" />
        <StatisticsCard icon={HiEye} label="Published" value={published} color="emerald" index={1} to="jobs" />
        <StatisticsCard icon={HiBriefcase} label="Unpublished" value={unpublished} color="amber" index={2} to="jobs" />
        <StatisticsCard icon={HiUsers} label="Applications" value={applications.length} color="violet" index={3} to="applications" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-gray-150 dark:border-slate-800/80">
          <h3 className="font-bold text-gray-900 dark:text-slate-100 mb-4 text-base border-b border-gray-100 dark:border-slate-800 pb-3">Recent Jobs</h3>
          <div className="space-y-4">
            {jobs.slice(0, 5).map(j => (
              <div key={j.id} className="flex items-center justify-between py-2.5 border-b border-gray-50 dark:border-slate-800/50 last:border-0 last:pb-0">
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-slate-200">{j.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{j.company}</p>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${j.published !== false ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400'}`}>{j.published !== false ? 'Published' : 'Draft'}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-gray-150 dark:border-slate-800/80">
          <h3 className="font-bold text-gray-900 dark:text-slate-100 mb-4 text-base border-b border-gray-100 dark:border-slate-800 pb-3">Jobs by Category</h3>
          <div className="space-y-4.5">
            {Object.entries(jobs.reduce((acc, j) => { acc[j.category || 'Other'] = (acc[j.category || 'Other'] || 0) + 1; return acc; }, {})).sort((a, b) => b[1] - a[1]).map(([cat, count]) => (
              <div key={cat} className="flex items-center justify-between py-1">
                <span className="text-sm font-medium text-gray-700 dark:text-slate-300">{cat}</span>
                <div className="flex items-center gap-3">
                  <div className="w-24 h-2 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full" style={{ width: `${(count / (jobs.length || 1)) * 100}%` }} />
                  </div>
                  <span className="text-xs font-semibold text-gray-500 dark:text-slate-400 w-6 text-right">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}