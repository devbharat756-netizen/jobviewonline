import { HiBriefcase, HiBuildingOffice2, HiUsers, HiEye } from 'react-icons/hi2';
import StatisticsCard from '@components/common/StatisticsCard';
import { useJobs } from '@hooks/useJobs';
import { useLocalStorage } from '@hooks/useLocalStorage';

export default function AdminDashboard() {
  const { jobs } = useJobs();
  const [appliedJobs] = useLocalStorage('appliedJobs', []);
  const published = jobs.filter(j => j.published !== false).length;
  const unpublished = jobs.length - published;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatisticsCard icon={HiBriefcase} label="Total Jobs" value={jobs.length} color="primary" index={0} />
        <StatisticsCard icon={HiEye} label="Published" value={published} color="emerald" index={1} />
        <StatisticsCard icon={HiBriefcase} label="Unpublished" value={unpublished} color="amber" index={2} />
        <StatisticsCard icon={HiUsers} label="Applications" value={appliedJobs.length} color="violet" index={3} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-4">Recent Jobs</h3>
          <div className="space-y-3">
            {jobs.slice(0, 5).map(j => (
              <div key={j.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div><p className="text-sm font-medium text-gray-900">{j.title}</p><p className="text-xs text-gray-500">{j.company}</p></div>
                <span className={`text-xs font-medium px-2 py-1 rounded-lg ${j.published !== false ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>{j.published !== false ? 'Published' : 'Draft'}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-4">Jobs by Category</h3>
          <div className="space-y-3">
            {Object.entries(jobs.reduce((acc, j) => { acc[j.category] = (acc[j.category] || 0) + 1; return acc; }, {})).sort((a, b) => b[1] - a[1]).map(([cat, count]) => (
              <div key={cat} className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-700">{cat}</span>
                <div className="flex items-center gap-3">
                  <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-primary-500 rounded-full" style={{ width: `${(count / jobs.length) * 100}%` }} /></div>
                  <span className="text-xs text-gray-500 w-6 text-right">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}