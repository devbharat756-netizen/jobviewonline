import { HiXMark } from 'react-icons/hi2';
import { SALARY_RANGES, EXPERIENCE_LEVELS, WORK_MODES } from '@utils/constants';

export default function FilterSidebar({ filters, onFilterChange, onClear, isOpen, onClose }) {
  const { locationFilter, companyFilter, salaryFilter, experienceFilter, modeFilter, categoryFilter, companies, locations, categories } = filters;

  const selectClass = 'w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors appearance-none cursor-pointer';

  const hasFilters = locationFilter || companyFilter || salaryFilter || experienceFilter || modeFilter || categoryFilter;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={onClose} />
      )}

      <aside className={`
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 fixed top-0 left-0 h-full w-80 bg-white z-50 lg:static lg:h-auto lg:w-72 lg:z-auto
        transition-transform duration-300 overflow-y-auto
        border-r border-gray-100 lg:border-0
        p-6 lg:p-0
      `}>
        {/* Mobile close */}
        <div className="flex items-center justify-between mb-6 lg:hidden">
          <h3 className="font-bold text-lg">Filters</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center">
            <HiXMark className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center justify-between mb-6 hidden lg:flex">
          <h3 className="font-bold text-gray-900">Filters</h3>
          {hasFilters && (
            <button onClick={onClear} className="text-xs text-primary-600 hover:text-primary-700 font-medium">Clear all</button>
          )}
        </div>

        <div className="space-y-5">
          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
            <select value={locationFilter} onChange={e => onFilterChange('locationFilter', e.target.value)} className={selectClass}>
              <option value="">All Locations</option>
              {locations?.map(loc => <option key={loc} value={loc}>{loc}</option>)}
            </select>
          </div>

          {/* Company */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
            <select value={companyFilter} onChange={e => onFilterChange('companyFilter', e.target.value)} className={selectClass}>
              <option value="">All Companies</option>
              {companies?.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Category */}
          {categories && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select value={categoryFilter} onChange={e => onFilterChange('categoryFilter', e.target.value)} className={selectClass}>
                <option value="">All Categories</option>
                {categories.map(c => <option key={c.id} value={c.name}>{c.name} ({c.count})</option>)}
              </select>
            </div>
          )}

          {/* Salary */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Salary Range</label>
            <select value={salaryFilter} onChange={e => onFilterChange('salaryFilter', e.target.value)} className={selectClass}>
              <option value="">Any Salary</option>
              {SALARY_RANGES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>

          {/* Experience */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Experience</label>
            <select value={experienceFilter} onChange={e => onFilterChange('experienceFilter', e.target.value)} className={selectClass}>
              <option value="">Any Experience</option>
              {EXPERIENCE_LEVELS.map(e => <option key={e.value} value={e.value}>{e.label}</option>)}
            </select>
          </div>

          {/* Work Mode */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Work Mode</label>
            <div className="space-y-2">
              {WORK_MODES.map(mode => (
                <label key={mode} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="radio"
                    name="mode"
                    checked={modeFilter === mode}
                    onChange={() => onFilterChange('modeFilter', modeFilter === mode ? '' : mode)}
                    className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700 group-hover:text-primary-600 transition-colors">{mode}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}