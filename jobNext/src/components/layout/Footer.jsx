import { Link } from 'react-router-dom';
import AdPlaceholder from '@components/common/AdPlaceholder';
import viewjobLogo from '../../assets/viewjobLogo.png';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 text-slate-400">
      <AdPlaceholder type="horizontal" label="Footer Ad Space" />
      {/* Gradient accent bar */}
      <div className="h-px bg-gradient-to-r from-transparent via-primary-500/60 to-transparent" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center mb-5">
              <img src={viewjobLogo} alt="viewjob Logo" className="h-9 w-auto object-contain brightness-0 invert" />
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed mb-6 max-w-xs">
              Connecting talented professionals with world-class companies. Your next great opportunity is just a search away.
            </p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-slate-500 font-medium">50,000+ active job seekers</span>
            </div>
          </div>

          {/* For Job Seekers */}
          <div>
            <h4 className="text-white font-bold mb-5 text-sm uppercase tracking-wider">For Job Seekers</h4>
            <ul className="space-y-3">
              {[['Browse Jobs', '/jobs'], ['Freelance Projects', '/freelance'], ['Career Tips', '/career-tips'], ['My Dashboard', '/dashboard'], ['Saved Jobs', '/dashboard/saved-jobs'], ['My Applications', '/dashboard/applications']].map(([label, path]) => (
                <li key={path}><Link to={path} className="text-sm text-slate-400 hover:text-primary-400 transition-colors duration-200">{label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-bold mb-5 text-sm uppercase tracking-wider">Company</h4>
            <ul className="space-y-3">
              {[['About Us', '/about'], ['Companies', '/companies'], ['Contact Us', '/contact'], ['FAQ', '/faq']].map(([label, path]) => (
                <li key={path}><Link to={path} className="text-sm text-slate-400 hover:text-primary-400 transition-colors duration-200">{label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-bold mb-5 text-sm uppercase tracking-wider">Legal</h4>
            <ul className="space-y-3">
              {[['Privacy Policy', '/privacy-policy'], ['Terms of Service', '/terms'], ['Disclaimer', '/disclaimer'], ['DMCA Policy', '/dmca']].map(([label, path]) => (
                <li key={path}><Link to={path} className="text-sm text-slate-400 hover:text-primary-400 transition-colors duration-200">{label}</Link></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 pt-8 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">&copy; {currentYear} viewjob. All rights reserved.</p>
          <p className="text-xs text-slate-600">Made with ♥ for job seekers everywhere.</p>
        </div>
      </div>
    </footer>
  );
}