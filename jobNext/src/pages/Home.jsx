import { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiBriefcase, HiUsers, HiBuildingOffice2, HiGlobeAlt, HiArrowRight, HiSparkles, HiPaintBrush, HiChartBar, HiShieldCheck, HiUserGroup, HiArrowUp, HiAcademicCap, HiCog6Tooth } from 'react-icons/hi2';
import SEO from '@components/common/SEO';
import SearchBar from '@components/common/SearchBar';
import JobCard from '@components/common/JobCard';
import CompanyCard from '@components/common/CompanyCard';
import StatisticsCard from '@components/common/StatisticsCard';
import AdPlaceholder from '@components/common/AdPlaceholder';
import Banner300x250 from '@components/common/Banner300x250';
import { useJobs } from '@hooks/useJobs';
import { CAREER_TIPS, TESTIMONIALS } from '@utils/constants';

const iconMap = { Engineering: HiBriefcase, Design: HiPaintBrush, 'Data Science': HiChartBar, Mobile: HiAcademicCap, Security: HiShieldCheck, Marketing: HiUserGroup };

export default function Home() {
  const [categories, setCategories] = useState([]);
  const { jobs } = useJobs();

  useEffect(() => {
    fetch('/data/categories.json')
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error('Failed to load categories:', err));
  }, []);
  const featuredJobs = useMemo(() => jobs.filter(j => j.salaryMax >= 130000).slice(0, 6), [jobs]);
  const latestJobs = useMemo(() => [...jobs].sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate)).slice(0, 6), [jobs]);
  const remoteJobs = useMemo(() => jobs.filter(j => j.mode === 'Remote').slice(0, 6), [jobs]);
  const topCompanies = useMemo(() => {
    const map = {};
    jobs.forEach(j => {
      if (!map[j.company]) map[j.company] = { name: j.company, logo: j.companyLogo, industry: j.companyDetails?.industry, location: j.location, openJobs: 0, rating: (4 + Math.random() * 0.8).toFixed(1) };
      map[j.company].openJobs++;
    });
    return Object.values(map).sort((a, b) => b.openJobs - a.openJobs).slice(0, 6);
  }, [jobs]);

  return (
    <>
      <SEO path="/" description="jobNext - Find Your Dream Job. Browse thousands of job listings from top companies worldwide." />

      {/* Hero */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-amber-50/50" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 text-sm font-medium text-primary-700 bg-primary-100 px-4 py-1.5 rounded-full mb-6">
              <HiSparkles className="w-4 h-4" /> Trusted by 50,000+ job seekers
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
              Find Your <span className="gradient-text">Dream Job</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-10">Discover opportunities at the world's best companies. Your next career move starts here.</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="max-w-4xl mx-auto">
            <SearchBar large />
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="flex flex-wrap items-center justify-center gap-3 mt-6 text-sm text-gray-500">
            <span>Popular:</span>
            {['React', 'Remote', 'Data Scientist', 'Product Designer'].map(t => (
              <Link key={t} to={`/jobs?q=${t}`} className="text-primary-600 hover:text-primary-700 font-medium hover:underline">{t}</Link>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <StatisticsCard icon={HiBriefcase} label="Active Jobs" value="5,200+" color="primary" index={0} />
            <StatisticsCard icon={HiBuildingOffice2} label="Companies" value="1,800+" color="amber" index={1} />
            <StatisticsCard icon={HiUsers} label="Job Seekers" value="50,000+" color="emerald" index={2} />
            <StatisticsCard icon={HiGlobeAlt} label="Locations" value="120+" color="violet" index={3} />
          </div>
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="py-16 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl lg:text-3xl font-extrabold text-gray-900">Featured Jobs</h2>
              <p className="text-gray-500 mt-1">High-paying opportunities from top companies</p>
            </div>
            <Link to="/jobs" className="hidden sm:flex items-center gap-1 text-sm font-semibold text-primary-600 hover:text-primary-700">View all <HiArrowRight className="w-4 h-4" /></Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredJobs.map((job, i) => <JobCard key={job.id} job={job} index={i} />)}
          </div>
          <div className="mt-8 text-center sm:hidden">
            <Link to="/jobs" className="inline-flex items-center gap-1 text-sm font-semibold text-primary-600">View all jobs <HiArrowRight className="w-4 h-4" /></Link>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4"><Banner300x250 /></div>

      {/* Popular Categories */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl lg:text-3xl font-extrabold text-gray-900">Popular Categories</h2>
            <p className="text-gray-500 mt-1">Explore jobs by category</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((cat, i) => {
              const Icon = iconMap[cat.icon] || HiBriefcase;
              return (
                <motion.div key={cat.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.05 }}>
                  <Link to={`/jobs?category=${cat.name}`} className="block bg-white rounded-2xl p-5 shadow-sm border border-gray-100 card-hover text-center group">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: cat.color + '15', color: cat.color }}><Icon className="w-6 h-6" /></div>
                    <h3 className="font-semibold text-gray-900 text-sm group-hover:text-primary-600 transition-colors">{cat.name}</h3>
                    <p className="text-xs text-gray-400 mt-1">{cat.count} jobs</p>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Top Companies */}
      <section className="py-16 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div><h2 className="text-2xl lg:text-3xl font-extrabold text-gray-900">Top Companies</h2><p className="text-gray-500 mt-1">Work at the best companies</p></div>
            <Link to="/companies" className="hidden sm:flex items-center gap-1 text-sm font-semibold text-primary-600 hover:text-primary-700">View all <HiArrowRight className="w-4 h-4" /></Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {topCompanies.map((c, i) => <CompanyCard key={c.name} company={c} index={i} />)}
          </div>
        </div>
      </section>

      {/* Latest Jobs */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div><h2 className="text-2xl lg:text-3xl font-extrabold text-gray-900">Latest Jobs</h2><p className="text-gray-500 mt-1">Freshly posted opportunities</p></div>
            <Link to="/jobs" className="hidden sm:flex items-center gap-1 text-sm font-semibold text-primary-600 hover:text-primary-700">View all <HiArrowRight className="w-4 h-4" /></Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestJobs.map((job, i) => <JobCard key={job.id} job={job} index={i} />)}
          </div>
        </div>
      </section>

      {/* Remote Jobs */}
      <section className="py-16 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div><h2 className="text-2xl lg:text-3xl font-extrabold text-gray-900">Remote Jobs</h2><p className="text-gray-500 mt-1">Work from anywhere</p></div>
            <Link to="/jobs?mode=Remote" className="hidden sm:flex items-center gap-1 text-sm font-semibold text-primary-600 hover:text-primary-700">View all <HiArrowRight className="w-4 h-4" /></Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {remoteJobs.map((job, i) => <JobCard key={job.id} job={job} index={i} />)}
          </div>
        </div>
      </section>

      {/* Career Tips */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div><h2 className="text-2xl lg:text-3xl font-extrabold text-gray-900">Career Tips & Advice</h2><p className="text-gray-500 mt-1">Expert guidance for your career</p></div>
            <Link to="/career-tips" className="hidden sm:flex items-center gap-1 text-sm font-semibold text-primary-600 hover:text-primary-700">View all <HiArrowRight className="w-4 h-4" /></Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CAREER_TIPS.slice(0, 3).map((tip, i) => (
              <motion.div key={tip.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <Link to="/career-tips" className="block bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 card-hover group">
                  <div className="h-48 overflow-hidden"><img src={tip.image} alt={tip.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" /></div>
                  <div className="p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-xs font-medium text-primary-600 bg-primary-50 px-2.5 py-1 rounded-lg">{tip.category}</span>
                      <span className="text-xs text-gray-400">{tip.readTime} read</span>
                    </div>
                    <h3 className="font-bold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2">{tip.title}</h3>
                    <p className="text-sm text-gray-500 mt-2 line-clamp-2">{tip.excerpt}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl lg:text-3xl font-extrabold text-gray-900">What Job Seekers Say</h2>
            <p className="text-gray-500 mt-1">Real stories from real people</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TESTIMONIALS.slice(0, 3).map((t, i) => (
              <motion.div key={t.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex gap-1 mb-4">{Array.from({ length: 5 }).map((_, s) => <HiSparkles key={s} className="w-4 h-4 text-amber-400" />)}</div>
                <p className="text-gray-600 text-sm leading-relaxed mb-5">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover" loading="lazy" />
                  <div><p className="text-sm font-semibold text-gray-900">{t.name}</p><p className="text-xs text-gray-500">{t.role}</p></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-primary-800">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl lg:text-3xl font-extrabold text-white mb-3">Stay Updated</h2>
          <p className="text-primary-100 mb-8">Get the latest jobs and career tips delivered to your inbox weekly.</p>
          <form onSubmit={e => { e.preventDefault(); alert('Subscribed! (Demo only)'); }} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
            <input type="email" required placeholder="Enter your email" className="flex-1 px-5 py-3.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-white/30" />
            <button type="submit" className="px-8 py-3.5 bg-white text-primary-700 font-semibold rounded-xl hover:bg-primary-50 transition-colors text-sm">Subscribe</button>
          </form>
        </div>
      </section>
    </>
  );
}