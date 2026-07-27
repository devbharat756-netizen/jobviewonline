import { useState, useMemo } from 'react';
import { HiBuildingOffice2 } from 'react-icons/hi2';
import { useJobs } from '@hooks/useJobs';

export default function AdminCompanies() {
  const { jobs } = useJobs();
  const companies = useMemo(() => {
    const map = {};
    jobs.forEach(j => {
      if (!map[j.company]) map[j.company] = { name: j.company, logo: j.companyLogo, industry: j.companyDetails?.industry, location: j.location, jobs: 0 };
      map[j.company].jobs++;
    });
    return Object.values(map).sort((a, b) => b.jobs - a.jobs);
  }, [jobs]);

  return (
    <div>
      <p className="text-sm text-gray-500 mb-6">{companies.length} companies found from job listings</p>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="bg-gray-50 text-left"><th className="px-5 py-3 font-medium text-gray-500">Company</th><th className="px-5 py-3 font-medium text-gray-500">Industry</th><th className="px-5 py-3 font-medium text-gray-500">Location</th><th className="px-5 py-3 font-medium text-gray-500 text-right">Jobs</th></tr></thead>
          <tbody className="divide-y divide-gray-50">
            {companies.map(c => (
              <tr key={c.name} className="hover:bg-gray-50/50">
                <td className="px-5 py-3"><div className="flex items-center gap-3"><img src={c.logo} alt="" className="w-8 h-8 rounded-lg object-cover" /><span className="font-medium text-gray-900">{c.name}</span></div></td>
                <td className="px-5 py-3 text-gray-600">{c.industry || '—'}</td>
                <td className="px-5 py-3 text-gray-600">{c.location}</td>
                <td className="px-5 py-3 text-right font-medium text-gray-900">{c.jobs}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}