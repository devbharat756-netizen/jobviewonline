import { useState } from 'react';
import { useToast } from '@context/ToastContext';
import { useLocalStorage } from '@hooks/useLocalStorage';
import { useJobs } from '@hooks/useJobs';
import { isConfigured } from '@services/cloudStorage';
import { HiTrash, HiArrowDownTray, HiArrowPath, HiCloud, HiCloudArrowUp, HiCheckCircle, HiXCircle, HiArrowUpTray } from 'react-icons/hi2';

export default function AdminSettings() {
  const { addToast } = useToast();
  const [theme, setTheme] = useLocalStorage('theme', 'light');
  const [siteName, setSiteName] = useState('jobNext');
  const [tagline, setTagline] = useState('Find Your Dream Job');
  const { allJobs, resetToDefaults, syncing, cloudStatus, syncToCloud } = useJobs();

  const configured = isConfigured();
  const [apiKey, setApiKey] = useState('');
  const [binId, setBinId] = useState('');

  const handleSave = () => { addToast('Settings saved!', 'success'); };

  const exportJobs = () => {
    const json = JSON.stringify(allJobs, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'jobs.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    addToast('Jobs exported!', 'success');
  };

  const handleReset = () => {
    if (!confirm('Restore original jobs? All admin changes will be lost.')) return;
    resetToDefaults();
    addToast('Jobs reset to defaults.', 'warning');
  };

  const clearAllData = () => {
    if (!confirm('Delete ALL local data?')) return;
    if (!confirm('This cannot be undone!')) return;
    localStorage.clear();
    addToast('All data cleared. Reload the page.', 'warning');
  };

  const handleSyncNow = async () => {
    try {
      await syncToCloud(allJobs);
      addToast('Synced to cloud!', 'success');
    } catch {
      addToast('Sync failed. Check API key and Bin ID.', 'error');
    }
  };

  const saveCloudConfig = () => {
    if (!apiKey.trim() || !binId.trim()) {
      addToast('API Key and Bin ID both required', 'error');
      return;
    }
    localStorage.setItem('cloudApiKey', apiKey.trim());
    localStorage.setItem('cloudBinId', binId.trim());
    addToast('Cloud config saved! Reload the page to activate.', 'success');
  };

  const clearCloudConfig = () => {
    localStorage.removeItem('cloudApiKey');
    localStorage.removeItem('cloudBinId');
    addToast('Cloud config removed. Reload the page.', 'info');
  };

  const statusConfig = {
    not_configured: { icon: HiCloud, color: 'text-gray-400', bg: 'bg-gray-50', border: 'border-gray-200', label: 'Not Configured', desc: 'Add API key below to enable' },
    ready: { icon: HiCloud, color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-200', label: 'Connected', desc: 'Ready to sync' },
    syncing: { icon: HiCloudArrowUp, color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-200', label: 'Syncing...', desc: 'Please wait' },
    synced: { icon: HiCheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-200', label: 'Synced', desc: 'All jobs saved to cloud' },
    error: { icon: HiXCircle, color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-200', label: 'Error', desc: 'Check your API key' },
  };

  const status = statusConfig[cloudStatus] || statusConfig.not_configured;
  const StatusIcon = status.icon;

  const inputClass = 'w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500';
  const labelClass = 'block text-sm font-medium text-gray-700 mb-1.5';

  return (
    <div className="max-w-2xl space-y-6">

      {/* ⭐ CLOUD STORAGE — MAIN FEATURE */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center">
            <HiCloud className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">Cloud Storage (Permanent)</h3>
            <p className="text-xs text-gray-500">Free via JSONBin.io — works across all browsers</p>
          </div>
        </div>

        {/* Status Badge */}
        <div className={`flex items-center gap-3 p-4 rounded-xl border mb-5 ${status.bg} ${status.border}`}>
          <StatusIcon className={`w-6 h-6 ${status.color} flex-shrink-0`} />
          <div>
            <p className={`text-sm font-semibold ${status.color}`}>{status.label}</p>
            <p className="text-xs text-gray-500">{status.desc}</p>
          </div>
          {syncing && (
            <div className="ml-auto">
              <div className="w-5 h-5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>

        {/* Setup Instructions */}
        <div className="bg-gray-50 rounded-xl p-4 mb-5">
          <p className="text-xs font-bold text-gray-700 mb-2">⚡ Setup (one-time, 2 minutes):</p>
          <ol className="text-xs text-gray-600 space-y-1.5 list-decimal list-inside">
            <li>Go to <a href="https://jsonbin.io" target="_blank" rel="noreferrer" className="text-primary-600 font-medium hover:underline">jsonbin.io</a> → Create free account</li>
            <li>Click <strong>"Create new bin"</strong> → paste <code className="bg-white px-1.5 py-0.5 rounded border text-[10px]">{"{}"}</code> → Create</li>
            <li>Copy your <strong>API Key</strong> (top-right profile menu) & <strong>Bin ID</strong> (from bin URL)</li>
            <li>Paste both below & click Save</li>
            <li>Reload this page — done! ✅</li>
          </ol>
        </div>

        {/* API Key Input */}
        {!configured ? (
          <div className="space-y-3 mb-5">
            <div>
              <label className={labelClass}>API Key</label>
              <input
                type="text"
                value={apiKey}
                onChange={e => setApiKey(e.target.value)}
                className={inputClass}
                placeholder="$2a$10$xxxxxxxxxxxxxxxxxxxxxxxx"
              />
            </div>
            <div>
              <label className={labelClass}>Bin ID</label>
              <input
                type="text"
                value={binId}
                onChange={e => setBinId(e.target.value)}
                className={inputClass}
                placeholder="6708a1f0e73b35763f8b4567"
              />
            </div>
            <button onClick={saveCloudConfig} className="gradient-btn text-white px-5 py-2.5 rounded-xl text-sm font-semibold">
              Save & Activate Cloud
            </button>
          </div>
        ) : (
          <div className="flex flex-wrap gap-3 mb-5">
            <button
              onClick={handleSyncNow}
              disabled={syncing}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary-50 text-primary-700 rounded-xl text-sm font-semibold hover:bg-primary-100 transition-colors border border-primary-200 disabled:opacity-50"
            >
              <HiArrowUpTray className="w-4 h-4" />
              {syncing ? 'Syncing...' : 'Sync Now'}
            </button>
            <button
              onClick={clearCloudConfig}
              className="flex items-center gap-2 px-5 py-2.5 bg-gray-50 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-100 transition-colors border border-gray-200"
            >
              <HiTrash className="w-4 h-4" />
              Remove Cloud Config
            </button>
          </div>
        )}

        {/* How it works */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
          <p className="text-xs font-bold text-emerald-700 mb-1">✅ Once configured:</p>
          <ul className="text-xs text-emerald-600 space-y-1">
            <li>• Admin adds/edits/deletes job → auto-syncs to cloud</li>
            <li>• New browser/device opens site → loads from cloud</li>
            <li>• Works forever, no backend needed</li>
            <li>• Free: 10,000 requests/month (plenty for admin use)</li>
          </ul>
        </div>
      </div>

      {/* General Settings */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-900 mb-4">General Settings</h3>
        <div className="space-y-4">
          <div><label className={labelClass}>Site Name</label><input type="text" value={siteName} onChange={e => setSiteName(e.target.value)} className={inputClass} /></div>
          <div><label className={labelClass}>Tagline</label><input type="text" value={tagline} onChange={e => setTagline(e.target.value)} className={inputClass} /></div>
          <div>
            <label className={labelClass}>Default Theme</label>
            <select value={theme} onChange={e => setTheme(e.target.value)} className={inputClass}>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>
          <button onClick={handleSave} className="gradient-btn text-white px-6 py-2.5 rounded-xl text-sm font-semibold">Save Settings</button>
        </div>
      </div>

      {/* Export / Reset */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-900 mb-4">Export & Reset</h3>
        <p className="text-sm text-gray-500 mb-4">Backup option — export jobs as JSON file.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button onClick={exportJobs} className="flex items-center justify-center gap-2 px-5 py-3 bg-primary-50 text-primary-700 rounded-xl text-sm font-semibold hover:bg-primary-100 transition-colors border border-primary-200">
            <HiArrowDownTray className="w-5 h-5" />Export as JSON
          </button>
          <button onClick={handleReset} className="flex items-center justify-center gap-2 px-5 py-3 bg-amber-50 text-amber-700 rounded-xl text-sm font-semibold hover:bg-amber-100 transition-colors border border-amber-200">
            <HiArrowPath className="w-5 h-5" />Reset to Defaults
          </button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-900 mb-4">Data Management</h3>
        <div className="bg-gray-50 rounded-xl p-4 mb-4">
          <h4 className="text-sm font-semibold text-gray-800 mb-2">Storage Keys</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {['adminJobs', 'savedJobs', 'appliedJobs', 'userProfile', 'theme', 'cloudApiKey', 'cloudBinId'].map(key => (
              <div key={key} className="flex items-center justify-between bg-white px-3 py-2 rounded-lg border border-gray-100">
                <code className="text-gray-600">{key}</code>
                <span className="text-gray-400">{localStorage.getItem(key) ? '✓' : '—'}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="border border-red-200 rounded-xl p-4 bg-red-50/50">
          <h4 className="text-sm font-semibold text-red-700 mb-1">Danger Zone</h4>
          <p className="text-xs text-red-600 mb-3">Clearing data is irreversible.</p>
          <button onClick={clearAllData} className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700 transition-colors">
            <HiTrash className="w-4 h-4" />Clear All Local Data
          </button>
        </div>
      </div>
    </div>
  );
}