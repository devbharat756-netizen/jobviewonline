import { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiBriefcase, HiUsers, HiBuildingOffice2, HiGlobeAlt, HiArrowRight, HiSparkles, HiPaintBrush, HiChartBar, HiShieldCheck, HiUserGroup, HiArrowUp, HiAcademicCap, HiCog6Tooth } from 'react-icons/hi2';
import SEO from '@components/common/SEO';
import SearchBar from '@components/common/SearchBar';
import JobCard from '@components/common/JobCard';
import CompanyCard from '@components/common/CompanyCard';
import StatisticsCard from '@components/common/StatisticsCard';
import Banner300x250 from '@components/common/Banner300x250';
import { useJobs } from '@hooks/useJobs';
import { useFreelance } from '@hooks/useFreelance';
import { CAREER_TIPS, TESTIMONIALS } from '@utils/constants';
import { useToast } from '@context/ToastContext';
import { subscribeNewsletter } from '../services/jobService';

const iconMap = { Engineering: HiBriefcase, Design: HiPaintBrush, 'Data Science': HiChartBar, Mobile: HiAcademicCap, Security: HiShieldCheck, Marketing: HiUserGroup };

export default function Home() {
  const [categories, setCategories] = useState([]);
  const { jobs } = useJobs();
  const freelanceHook = useFreelance();
  const { addToast } = useToast();

  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [submittingNewsletter, setSubmittingNewsletter] = useState(false);

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setSubmittingNewsletter(true);
    try {
      const res = await subscribeNewsletter(newsletterEmail.trim());
      if (res.data.success) {
        addToast(res.data.message || 'Subscribed successfully!', 'success');
        setNewsletterEmail('');
      } else {
        addToast(res.data.message || 'Subscription failed.', 'error');
      }
    } catch (err) {
      console.error(err);
      addToast(err.response?.data?.message || 'Subscription failed. Please try again.', 'error');
    } finally {
      setSubmittingNewsletter(false);
    }
  };

  useEffect(() => {
    fetch('/data/categories.json')
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error('Failed to load categories:', err));
  }, []);
  const featuredJobs = useMemo(() => {
    return [...jobs]
      .sort((a, b) => (b.salaryMax || 0) - (a.salaryMax || 0))
      .slice(0, 4);
  }, [jobs]);
  const latestJobs = useMemo(() => [...jobs].sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate)).slice(0, 6), [jobs]);
  const remoteJobs = useMemo(() => jobs.filter(j => j.mode === 'Remote').slice(0, 6), [jobs]);
  const latestFreelance = useMemo(() => {
    return [...freelanceHook.jobs]
      .sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate))
      .slice(0, 6);
  }, [freelanceHook.jobs]);
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
      <SEO path="/" description="viewjob - Find Your Dream Job. Browse thousands of job listings from top companies worldwide." />

      {/* Hero — clean corporate dark navy */}
      <section className="relative pt-10 pb-24 lg:pt-12 lg:pb-32 overflow-hidden bg-[#0a0f1d] border-b border-slate-800/40">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.02]" style={{backgroundImage: 'radial-gradient(circle, #38bdf8 1px, transparent 1px)', backgroundSize: '40px 40px'}} />
        {/* Horizontal accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-slate-800/60" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}>
            <span className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-7 bg-slate-800/50 border border-slate-700/50 text-sky-400">
              <HiShieldCheck className="w-4 h-4 text-emerald-400" /> Verified Recruiter Network • Safe Apply Standards
            </span>
            <h1 className="text-5xl sm:text-6xl lg:text-[76px] font-black text-white leading-[1.08] mb-6 tracking-tight">
              Find Your Next<br />
              <span className="text-sky-400">Dream Career</span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-400 max-w-xl mx-auto mb-10 leading-relaxed font-normal">
              Direct connection to hiring managers at verified companies. No intermediaries, no spam.
            </p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }} className="max-w-3xl mx-auto">
            <SearchBar large />
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 0.5 }} className="flex flex-wrap items-center justify-center gap-2.5 mt-7 text-sm">
            <span className="font-medium text-slate-500">Popular:</span>
            {['React', 'Remote', 'Node.js', 'UI Designer'].map(t => (
              <Link key={t} to={`/jobs?q=${t}`} className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-800/40 border border-slate-700/50 text-slate-400 hover:border-sky-500/50 hover:text-sky-400 hover:bg-sky-500/10 transition-all">{t}</Link>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-14 bg-white border-y border-gray-100 dark:border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            <StatisticsCard icon={HiBriefcase} label="Active Jobs" value="5,200+" color="primary" index={0} />
            <StatisticsCard icon={HiBuildingOffice2} label="Companies" value="1,800+" color="amber" index={1} />
            <StatisticsCard icon={HiUsers} label="Job Seekers" value="50,000+" color="emerald" index={2} />
            <StatisticsCard icon={HiGlobeAlt} label="Locations" value="120+" color="violet" index={3} />
          </div>
        </div>
      </section>

      {/* Trust & Security Guarantee */}
      <section className="py-16 bg-slate-50 dark:bg-slate-900/10 border-b border-gray-100 dark:border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="section-label mb-3 inline-flex"><HiShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Security Assured</span>
            <h2 className="text-3xl font-black text-gray-900 dark:text-white">Our Trust & Safety Standards</h2>
            <p className="text-gray-500 dark:text-slate-400 mt-2">Every listing is audited to protect candidates from spam and fraud</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex gap-4 p-6 bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800/40 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
                <HiShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 dark:text-slate-100 mb-1">100% Audited Listings</h4>
                <p className="text-sm text-gray-500 dark:text-slate-400 leading-relaxed">No automated scraping. Our moderators manually verify all job post details.</p>
              </div>
            </div>
            <div className="flex gap-4 p-6 bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800/40 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-sky-100 dark:bg-sky-500/10 text-sky-600 dark:text-sky-455 flex items-center justify-center flex-shrink-0">
                <HiUsers className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 dark:text-slate-100 mb-1">Verified Employers</h4>
                <p className="text-sm text-gray-500 dark:text-slate-400 leading-relaxed">Hiring managers are authenticated with verified business credentials before posting.</p>
              </div>
            </div>
            <div className="flex gap-4 p-6 bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800/40 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-500/10 text-indigo-650 dark:text-indigo-400 flex items-center justify-center flex-shrink-0">
                <HiGlobeAlt className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 dark:text-slate-100 mb-1">Secure Privacy Vault</h4>
                <p className="text-sm text-gray-500 dark:text-slate-400 leading-relaxed">Your resume and files are encrypted and only accessible to employers you apply to.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="py-20 bg-gray-50 dark:bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="section-label mb-3 inline-flex"><HiSparkles className="w-3.5 h-3.5" /> Top Picks</span>
              <h2 className="text-3xl lg:text-4xl font-black text-gray-900 dark:text-white">Featured Jobs</h2>
              <p className="text-gray-500 dark:text-slate-400 mt-2 text-base">Handpicked high-paying opportunities from top companies</p>
            </div>
            <Link to="/jobs" className="hidden sm:flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400 group">
              View all
              <span className="w-7 h-7 rounded-lg bg-primary-50 dark:bg-primary-500/10 flex items-center justify-center group-hover:bg-primary-100 dark:group-hover:bg-primary-500/20 transition-colors">
                <HiArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch">
            {featuredJobs.map((job, i) => <JobCard key={job.id} job={job} index={i} />)}
          </div>
          <div className="mt-8 text-center sm:hidden">
            <Link to="/jobs" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600">View all jobs <HiArrowRight className="w-4 h-4" /></Link>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4"><Banner300x250 /></div>

      {/* Popular Categories */}
      <section className="py-20 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="section-label mb-4 inline-flex"><HiBriefcase className="w-3.5 h-3.5" /> Browse by field</span>
            <h2 className="text-3xl lg:text-4xl font-black text-gray-900 dark:text-white">Popular Categories</h2>
            <p className="text-gray-500 dark:text-slate-400 mt-2">Explore thousands of roles across every discipline</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((cat, i) => {
              const Icon = iconMap[cat.icon] || HiBriefcase;
              return (
                <motion.div key={cat.id} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.05 }}>
                  <Link to={`/jobs?category=${cat.name}`} className="flex flex-col items-center bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-800/60 card-hover text-center group">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 duration-300" style={{ backgroundColor: cat.color + '18', color: cat.color }}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <h3 className="font-bold text-gray-900 dark:text-slate-100 text-sm group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{cat.name}</h3>
                    <p className="text-xs text-gray-400 dark:text-slate-500 mt-1 font-medium">{cat.count} open roles</p>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Top Companies */}
      <section className="py-20 bg-gray-50 dark:bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="section-label mb-3 inline-flex"><HiBuildingOffice2 className="w-3.5 h-3.5" /> Who's hiring</span>
              <h2 className="text-3xl lg:text-4xl font-black text-gray-900 dark:text-white">Top Companies</h2>
              <p className="text-gray-500 dark:text-slate-400 mt-2">Work at the world's most innovative organisations</p>
            </div>
            <Link to="/companies" className="hidden sm:flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400 group">
              View all
              <span className="w-7 h-7 rounded-lg bg-primary-50 dark:bg-primary-500/10 flex items-center justify-center group-hover:bg-primary-100 dark:group-hover:bg-primary-500/20 transition-colors">
                <HiArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 items-stretch">
            {topCompanies.map((c, i) => <CompanyCard key={c.name} company={c} index={i} />)}
          </div>
        </div>
      </section>

      {/* Latest Jobs */}
      <section className="py-20 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="section-label mb-3 inline-flex"><HiArrowUp className="w-3.5 h-3.5" /> Just posted</span>
              <h2 className="text-3xl lg:text-4xl font-black text-gray-900 dark:text-white">Latest Jobs</h2>
              <p className="text-gray-500 dark:text-slate-400 mt-2">Freshly posted opportunities updated daily</p>
            </div>
            <Link to="/jobs" className="hidden sm:flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400 group">
              View all
              <span className="w-7 h-7 rounded-lg bg-primary-50 dark:bg-primary-500/10 flex items-center justify-center group-hover:bg-primary-100 dark:group-hover:bg-primary-500/20 transition-colors">
                <HiArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch">
            {latestJobs.map((job, i) => <JobCard key={job.id} job={job} index={i} />)}
          </div>
        </div>
      </section>

      {/* Remote Jobs */}
      <section className="py-20 bg-gray-50 dark:bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="section-label mb-3 inline-flex"><HiGlobeAlt className="w-3.5 h-3.5" /> Work from anywhere</span>
              <h2 className="text-3xl lg:text-4xl font-black text-gray-900 dark:text-white">Remote Jobs</h2>
              <p className="text-gray-500 dark:text-slate-400 mt-2">Location-free roles from global companies</p>
            </div>
            <Link to="/jobs?mode=Remote" className="hidden sm:flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400 group">
              View all
              <span className="w-7 h-7 rounded-lg bg-primary-50 dark:bg-primary-500/10 flex items-center justify-center group-hover:bg-primary-100 dark:group-hover:bg-primary-500/20 transition-colors">
                <HiArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch">
            {remoteJobs.map((job, i) => <JobCard key={job.id} job={job} index={i} />)}
          </div>
        </div>
      </section>

      {/* Latest Freelance Projects */}
      <section className="py-20 bg-white dark:bg-slate-950 border-y border-gray-100 dark:border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="section-label mb-3 inline-flex"><HiCog6Tooth className="w-3.5 h-3.5" /> Project marketplace</span>
              <h2 className="text-3xl lg:text-4xl font-black text-gray-900 dark:text-white">Freelance Projects</h2>
              <p className="text-gray-500 dark:text-slate-400 mt-2">Gigs, contracts, and side-projects</p>
            </div>
            <Link to="/freelance" className="hidden sm:flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400 group">
              View all
              <span className="w-7 h-7 rounded-lg bg-primary-50 dark:bg-primary-500/10 flex items-center justify-center group-hover:bg-primary-100 dark:group-hover:bg-primary-500/20 transition-colors">
                <HiArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          </div>
          {latestFreelance.length === 0 ? (
            <div className="text-center py-20 bg-gray-50/60 dark:bg-slate-900/20 border border-dashed border-gray-200 dark:border-slate-700/60 rounded-3xl">
              <p className="text-gray-400 dark:text-slate-500 text-sm">No freelance projects posted yet — check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch">
              {latestFreelance.map((job, i) => <JobCard key={job.id} job={job} index={i} isFreelance={true} />)}
            </div>
          )}
        </div>
      </section>

      {/* Career Tips */}
      <section className="py-20 bg-gray-50 dark:bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="section-label mb-3 inline-flex"><HiAcademicCap className="w-3.5 h-3.5" /> Grow your career</span>
              <h2 className="text-3xl lg:text-4xl font-black text-gray-900 dark:text-white">Career Tips & Advice</h2>
              <p className="text-gray-500 dark:text-slate-400 mt-2">Expert guidance to accelerate your career</p>
            </div>
            <Link to="/career-tips" className="hidden sm:flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400 group">
              View all
              <span className="w-7 h-7 rounded-lg bg-primary-50 dark:bg-primary-500/10 flex items-center justify-center group-hover:bg-primary-100 dark:group-hover:bg-primary-500/20 transition-colors">
                <HiArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CAREER_TIPS.slice(0, 3).map((tip, i) => (
              <motion.div key={tip.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="h-full">
                <Link to="/career-tips" className="flex flex-col h-full bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-slate-800/60 card-hover group">
                  <div className="h-48 overflow-hidden relative">
                    <img src={tip.image} alt={tip.title} className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex items-center gap-2.5 mb-3">
                      <span className="tag-primary">{tip.category}</span>
                      <span className="text-xs text-gray-400 dark:text-slate-500">{tip.readTime} read</span>
                    </div>
                    <h3 className="font-bold text-gray-900 dark:text-slate-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2 text-base">{tip.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-slate-400 mt-2 line-clamp-2 mt-auto leading-relaxed">{tip.excerpt}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="section-label mb-4 inline-flex"><HiUsers className="w-3.5 h-3.5" /> Social proof</span>
            <h2 className="text-3xl lg:text-4xl font-black text-gray-900 dark:text-white">What Job Seekers Say</h2>
            <p className="text-gray-500 dark:text-slate-400 mt-2">Real stories from real people who found their dream jobs</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TESTIMONIALS.slice(0, 3).map((t, i) => (
              <motion.div key={t.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <div className="h-full bg-white dark:bg-slate-900 rounded-2xl p-7 shadow-sm border border-gray-100 dark:border-slate-800/60 card-hover relative overflow-hidden">
                  {/* Quote mark decoration */}
                  <div className="absolute top-4 right-5 text-6xl font-black text-primary-100 dark:text-primary-900/40 leading-none select-none pointer-events-none">&ldquo;</div>
                  <div className="flex gap-0.5 mb-4">
                    {Array.from({ length: 5 }).map((_, s) => (
                      <svg key={s} className="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                    ))}
                  </div>
                  <p className="text-gray-600 dark:text-slate-300 text-sm leading-relaxed mb-6 relative z-10">&ldquo;{t.text}&rdquo;</p>
                  <div className="flex items-center gap-3 mt-auto">
                    <img src={t.avatar} alt={t.name} className="w-11 h-11 rounded-full object-cover ring-2 ring-primary-100 dark:ring-primary-900/30" loading="lazy" />
                    <div>
                      <p className="text-sm font-bold text-gray-900 dark:text-slate-100">{t.name}</p>
                      <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">{t.role}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#08142a] via-primary-900 to-secondary-900" />
        <div className="absolute inset-0 opacity-[0.06]" style={{backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '30px 30px'}} />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary-600/15 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-secondary-600/15 rounded-full blur-3xl" />
        <div className="relative max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/8 border border-white/12 text-white/80 text-xs font-bold uppercase tracking-widest mb-6">
              <HiSparkles className="w-3.5 h-3.5 text-secondary-400" /> Weekly Newsletter
            </div>
            <h2 className="text-3xl lg:text-5xl font-black text-white mb-4 tracking-tight">Stay Ahead of the Curve</h2>
            <p className="text-slate-400 mb-10 text-lg leading-relaxed">Get curated job picks, resume tips, and career insights delivered to your inbox every week.</p>
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={e => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email address"
                disabled={submittingNewsletter}
                className="flex-1 px-5 py-4 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-400/40 text-gray-900 bg-white shadow-lg placeholder-gray-400"
              />
              <button
                type="submit"
                disabled={submittingNewsletter}
                className="px-7 py-4 bg-secondary-600 text-white font-bold rounded-xl hover:bg-secondary-500 transition-all text-sm disabled:opacity-60 shadow-lg whitespace-nowrap"
              >
                {submittingNewsletter ? 'Subscribing...' : 'Subscribe Free'}
              </button>
            </form>
            <p className="mt-4 text-slate-500 text-xs">No spam, ever. Unsubscribe in one click.</p>
          </motion.div>
        </div>
      </section>
    </>
  );
}