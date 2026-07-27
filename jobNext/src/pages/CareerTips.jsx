import { useState } from 'react';
import { motion } from 'framer-motion';
import { HiClock, HiArrowRight } from 'react-icons/hi2';
import SEO from '@components/common/SEO';
import Modal from '@components/common/Modal';
import AdPlaceholder from '@components/common/AdPlaceholder';
import { CAREER_TIPS } from '@utils/constants';

export default function CareerTips() {
  const [selectedTip, setSelectedTip] = useState(null);
  const [filter, setFilter] = useState('All');
  const tipCategories = ['All', ...new Set(CAREER_TIPS.map(t => t.category))];
  const filtered = filter === 'All' ? CAREER_TIPS : CAREER_TIPS.filter(t => t.category === filter);

  return (
    <>
      <SEO path="/career-tips" title="Career Tips & Advice" description="Expert career advice, resume tips, interview strategies, salary negotiation guides, and more." />
      <div className="pt-28 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Career Tips & Advice</h1>
            <p className="text-gray-500">Expert guidance to help you at every stage of your career</p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-8">
            {tipCategories.map(cat => (
              <button key={cat} onClick={() => setFilter(cat)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${filter === cat ? 'bg-primary-50 text-primary-600' : 'text-gray-500 hover:bg-gray-100'}`}>{cat}</button>
            ))}
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filtered.map((tip, i) => (
                  <motion.article key={tip.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 card-hover cursor-pointer group" onClick={() => setSelectedTip(tip)}>
                    <div className="h-48 overflow-hidden"><img src={tip.image} alt={tip.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" /></div>
                    <div className="p-5">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-xs font-medium text-primary-600 bg-primary-50 px-2.5 py-1 rounded-lg">{tip.category}</span>
                        <span className="text-xs text-gray-400 flex items-center gap-1"><HiClock className="w-3.5 h-3.5" />{tip.readTime}</span>
                      </div>
                      <h2 className="font-bold text-gray-900 group-hover:text-primary-600 transition-colors mb-2 line-clamp-2">{tip.title}</h2>
                      <p className="text-sm text-gray-500 line-clamp-2">{tip.excerpt}</p>
                      <span className="inline-flex items-center gap-1 text-sm text-primary-600 font-medium mt-3 group-hover:gap-2 transition-all">Read more <HiArrowRight className="w-4 h-4" /></span>
                    </div>
                  </motion.article>
                ))}
              </div>
            </div>
            <div className="hidden lg:block w-[300px] flex-shrink-0">
              <div className="sticky top-28 space-y-6">
                <AdPlaceholder type="vertical" label="Sidebar Ad" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Article Modal */}
      <Modal isOpen={!!selectedTip} onClose={() => setSelectedTip(null)} title={selectedTip?.title || ''} size="lg">
        {selectedTip && (
          <article>
            <img src={selectedTip.image} alt={selectedTip.title} className="w-full h-56 object-cover rounded-xl mb-6" />
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs font-medium text-primary-600 bg-primary-50 px-2.5 py-1 rounded-lg">{selectedTip.category}</span>
              <span className="text-xs text-gray-400">{selectedTip.readTime} read</span>
            </div>
            <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed whitespace-pre-line">
              {selectedTip.content.split('\n\n').map((para, i) => {
                if (para.startsWith('**') && para.endsWith('**')) return <h3 key={i} className="text-lg font-bold text-gray-900 mt-6 mb-2">{para.replace(/\*\*/g, '')}</h3>;
                if (para.startsWith('**')) return <p key={i} className="mb-3">{para.replace(/\*\*(.*?)\*\*/g, '<strong class="text-gray-900">$1</strong>')}</p>;
                return <p key={i} className="mb-3">{para}</p>;
              })}
            </div>
          </article>
        )}
      </Modal>
    </>
  );
}