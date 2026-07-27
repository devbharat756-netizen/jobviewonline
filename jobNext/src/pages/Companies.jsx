import { useState } from 'react';
import { motion } from 'framer-motion';
import { HiMagnifyingGlass } from 'react-icons/hi2';
import SEO from '@components/common/SEO';
import CompanyCard from '@components/common/CompanyCard';
import EmptyState from '@components/common/EmptyState';
import { useJobs } from '@hooks/useJobs';

export default function Companies() {
  const { jobs } = useJobs();
  const [search, setSearch] = useState('');

  const companies = (() => {
    const map = {};
    jobs.forEach(j => {
      if (!map[j.company]) map[j.company] = { name: j.company, logo: j.companyLogo, industry: j.companyDetails?.industry, location: j.location, openJobs: 0, rating: (4 + Math.random() * 0.8).toFixed(1) };
      map[j.company].openJobs++;
    });
    return Object.values(map).sort((a, b) => b.openJobs - a.openJobs);
  })();

  const filtered = companies.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.industry?.toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      <SEO path="/companies" title="Companies" description="Explore top companies hiring on jobNext. Find your next employer from hundreds of leading organizations." />
      <div className="pt-28 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Companies</h1>
            <p className="text-gray-500">Explore {companies.length} companies hiring right now</p>
          </div>

          <div className="max-w-md mb-8">
            <div className="flex items-center gap-3 px-4 py-2.5 bg-white border border-gray-200 rounded-xl">
              <HiMagnifyingGlass className="w-5 h-5 text-gray-400" />
              <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search companies..." className="flex-1 text-sm focus:outline-none bg-transparent" />
            </div>
          </div>

          {filtered.length === 0 ? (
            <EmptyState title="No companies found" description="Try a different search term." />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
              {filtered.map((c, i) => <CompanyCard key={c.name} company={c} index={i} />)}
            </div>
          )}
        </div>
      </div>
    </>
  );
}