import { motion } from 'framer-motion';
import { HiUserGroup, HiBriefcase, HiHeart, HiLightBulb, HiShieldCheck, HiGlobeAlt } from 'react-icons/hi2';
import SEO from '@components/common/SEO';
import StatisticsCard from '@components/common/StatisticsCard';

export default function About() {
  const values = [
    { icon: HiBriefcase, title: 'Mission-Driven', desc: 'We exist to connect talent with opportunity, making the job search process simpler and more effective for everyone.' },
    { icon: HiUserGroup, title: 'People First', desc: 'Every decision we make puts job seekers and employers at the center. Real humans, not just resumes.' },
    { icon: HiLightBulb, title: 'Innovation', desc: 'We constantly improve our platform with smart search, intuitive design, and tools that actually help.' },
    { icon: HiHeart, title: 'Inclusivity', desc: 'We believe great talent comes from everywhere. Our platform is open and welcoming to all.' },
    { icon: HiShieldCheck, title: 'Trust', desc: 'No fake jobs, no spam, no scams. We verify listings and protect our users\' data.' },
    { icon: HiGlobeAlt, title: 'Global Reach', desc: 'From remote roles to local opportunities, we connect people across borders and time zones.' },
  ];

  return (
    <>
      <SEO path="/about" title="About Us" description="Learn about jobNext, our mission, values, and the team behind the platform connecting job seekers with top companies." />
      <div className="pt-28 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4">About <span className="gradient-text">jobNext</span></h1>
            <p className="text-lg text-gray-600 leading-relaxed">We started jobNext with a simple belief: finding the right job shouldn\'t be exhausting. Our platform connects talented professionals with companies that value their skills, creating meaningful career opportunities for everyone.</p>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <StatisticsCard icon={HiUserGroup} label="Job Seekers" value="50,000+" color="primary" index={0} />
            <StatisticsCard icon={HiGlobeAlt} label="Companies" value="1,800+" color="amber" index={1} />
            <StatisticsCard icon={HiBriefcase} label="Jobs Posted" value="5,200+" color="emerald" index={2} />
            <StatisticsCard icon={HiHeart} label="Success Stories" value="12,000+" color="rose" index={3} />
          </div>

          {/* Story */}
          <div className="bg-white rounded-2xl p-8 lg:p-12 shadow-sm border border-gray-100 mb-16">
            <h2 className="text-2xl font-extrabold text-gray-900 mb-4">Our Story</h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>jobNext was founded in 2023 by a team of recruiters, engineers, and designers who were frustrated with the state of online job searching. Too many platforms were cluttered with fake listings, irrelevant results, and poor user experiences.</p>
              <p>We built jobNext to be different. Every job listing is reviewed for quality. Our search and filtering tools are designed to help you find exactly what you\'re looking for — not just show you more ads. And our career resources provide genuine, actionable advice from industry professionals.</p>
              <p>Today, jobNext serves over 50,000 job seekers and 1,800 companies across 120+ locations. But we\'re just getting started. Our roadmap includes AI-powered job matching, skill assessments, and integrated video interviewing — all designed to make the hiring process better for everyone.</p>
            </div>
          </div>

          {/* Values */}
          <div className="mb-16">
            <h2 className="text-2xl font-extrabold text-gray-900 text-center mb-10">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {values.map((v, i) => (
                <motion.div key={v.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center mb-4"><v.icon className="w-6 h-6" /></div>
                  <h3 className="font-bold text-gray-900 mb-2">{v.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{v.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Team placeholder */}
          <div className="text-center bg-gradient-to-br from-primary-50 to-amber-50 dark:from-slate-800/40 dark:via-slate-900/30 dark:to-slate-900/60 rounded-2xl p-12 border border-primary-100 dark:border-slate-800">
            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-slate-100 mb-3">Join Our Team</h2>
            <p className="text-gray-600 dark:text-slate-300 max-w-lg mx-auto mb-6">We're always looking for passionate people to help us build the future of job searching.</p>
            <a href="/jobs" className="inline-block gradient-btn text-white px-8 py-3 rounded-xl font-semibold text-sm">View Open Positions</a>
          </div>
        </div>
      </div>
    </>
  );
}