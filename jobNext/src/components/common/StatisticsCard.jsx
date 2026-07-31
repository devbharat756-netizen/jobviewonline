import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function StatisticsCard({ icon: Icon, label, value, color = 'primary', index = 0, to }) {
  const colorMap = {
    primary: { bg: 'bg-primary-500/10 dark:bg-primary-500/15', text: 'text-primary-600 dark:text-primary-400', glow: 'group-hover:shadow-primary-500/20' },
    amber:   { bg: 'bg-amber-500/10 dark:bg-amber-500/15',   text: 'text-amber-600 dark:text-amber-400',   glow: 'group-hover:shadow-amber-500/20' },
    emerald: { bg: 'bg-emerald-500/10 dark:bg-emerald-500/15', text: 'text-emerald-600 dark:text-emerald-400', glow: 'group-hover:shadow-emerald-500/20' },
    rose:    { bg: 'bg-rose-500/10 dark:bg-rose-500/15',    text: 'text-rose-600 dark:text-rose-400',    glow: 'group-hover:shadow-rose-500/20' },
    violet:  { bg: 'bg-violet-500/10 dark:bg-violet-500/15', text: 'text-violet-600 dark:text-violet-400', glow: 'group-hover:shadow-violet-500/20' },
    cyan:    { bg: 'bg-cyan-500/10 dark:bg-cyan-500/15',    text: 'text-cyan-600 dark:text-cyan-400',    glow: 'group-hover:shadow-cyan-500/20' },
  };

  const c = colorMap[color];

  const content = (
    <>
      <div className={`w-13 h-13 rounded-2xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110 ${c.bg}`}>
        <Icon className={`w-6 h-6 ${c.text}`} />
      </div>
      <p className={`text-3xl font-black tracking-tight ${c.text} mb-0.5`}>{value}</p>
      <p className="text-sm text-gray-500 dark:text-slate-400 font-medium">{label}</p>
    </>
  );

  const cardClass = `group bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-800/60 card-hover block transition-all`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      {to ? (
        <Link to={to} className={cardClass}>{content}</Link>
      ) : (
        <div className={cardClass}>{content}</div>
      )}
    </motion.div>
  );
}