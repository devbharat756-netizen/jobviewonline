import { useMemo } from 'react';
import { HiBriefcase, HiGlobeAlt, HiChartBar } from 'react-icons/hi2';
import StatisticsCard from '@components/common/StatisticsCard';
import { useJobs } from '@hooks/useJobs';

export default function AdminAnalytics() {
  const { jobs } = useJobs();

  const stats = useMemo(() => {
    const byMode = jobs.reduce((a, j) => { a[j.mode] = (a[j.mode] || 0) + 1; return a; }, {});
    const byCategory = jobs.reduce((a, j) => { a[j.category] = (a[j.category] || 0) + 1; return a; }, {});
    const byType = jobs.reduce((a, j) => { a[j.type] = (a[j.type] || 0) + 1; return a; }, {});
    const avgSalary = jobs.length ? Math.round(jobs.reduce((a, j) => a + (j.salaryMin + j.salaryMax) / 2, 0) / jobs.length) : 0;
    const topPaying = [...jobs].sort((a, b) => b.salaryMax - a.salaryMax).slice(0, 5);
    return { byMode, byCategory, byType, avgSalary, topPaying };
  }, [jobs]);

  const BarChart = ({ data, label }) => {
    const max = Math.max(...Object.values(data));
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-900 mb-4">{label}</h3>
        <div className="space-y-3">
          {Object.entries(data).sort((a, b) => b[1] - a[1]).map(([k, v]) => (
            <div key={k} className="flex items-center gap-3"><span className="text-sm text-gray-700 w-24 flex-shrink-0">{k}</span><div className="flex-1 h-6 bg-gray-100 rounded-lg overflow-hidden"><div className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-end pr-2 transition-all duration-500" style={{ width: `${max > 0 ? (v / max) * 100 : 0}%`, minWidth: '2rem' }}><span className="text-xs text-white font-medium">{v}</span></div></div></div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatisticsCard icon={HiChartBar} label="Avg Salary" value={`$${stats.avgSalary.toLocaleString()}`} color="primary" index={0} />
        <StatisticsCard icon={HiGlobeAlt} label="Locations" value={new Set(jobs.map(j => j.location)).size} color="amber" index={1} />
        <StatisticsCard icon={HiBriefcase} label="Categories" value={Object.keys(stats.byCategory).length} color="emerald" index={2} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BarChart data={stats.byMode} label="Jobs by Work Mode" />
        <BarChart data={stats.byCategory} label="Jobs by Category" />
        <BarChart data={stats.byType} label="Jobs by Employment Type" />
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-4">Top Paying Jobs</h3>
          <div className="space-y-3">
            {stats.topPaying.map((j, i) => (
              <div key={j.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div className="flex items-center gap-3"><span className="w-6 h-6 rounded-full bg-primary-50 text-primary-700 text-xs font-bold flex items-center justify-center">{i + 1}</span><div><p className="text-sm font-medium text-gray-900">{j.title}</p><p className="text-xs text-gray-500">{j.company}</p></div></div>
                <span className="text-sm font-semibold text-gray-900">${j.salaryMax.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}