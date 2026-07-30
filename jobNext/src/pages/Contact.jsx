import { useState } from 'react';
import { motion } from 'framer-motion';
import { HiEnvelope, HiPhone, HiMapPin } from 'react-icons/hi2';
import SEO from '@components/common/SEO';
import { useToast } from '@context/ToastContext';

export default function Contact() {
  const { addToast } = useToast();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    addToast('Message sent successfully! We\'ll get back to you soon.', 'success');
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  const inputClass = 'w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors';

  return (
    <>
      <SEO path="/contact" title="Contact Us" description="Get in touch with the jobView team. We're here to help with any questions about our platform." />
      <div className="pt-28 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Contact Us</h1>
            <p className="text-gray-500 max-w-lg mx-auto">Have a question, suggestion, or need help? We'd love to hear from you.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Info Cards */}
            <div className="space-y-4">
              {[
                { icon: HiEnvelope, label: 'Email', value: 'support@jobview.online' },
                { icon: HiPhone, label: 'Phone', value: '+917563003439' },
                { icon: HiMapPin, label: 'Address', value: 'Tech Avenue, Patna, Bihar, India' },
              ].map(item => (
                <div key={item.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center flex-shrink-0"><item.icon className="w-5 h-5" /></div>
                  <div><p className="text-xs text-gray-400 mb-0.5">{item.label}</p><p className="text-sm font-medium text-gray-800">{item.value}</p></div>
                </div>
              ))}
            </div>

            {/* Form */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2 bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-gray-100">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Name</label><input type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className={inputClass} placeholder="John Doe" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label><input type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} className={inputClass} placeholder="john@example.com" /></div>
                </div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Subject</label><input type="text" required value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} className={inputClass} placeholder="How can we help?" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Message</label><textarea rows={5} required value={form.message} onChange={e => setForm({...form, message: e.target.value})} className={inputClass + ' resize-none'} placeholder="Tell us more..." /></div>
                <button type="submit" className="gradient-btn text-white px-8 py-3 rounded-xl font-semibold text-sm w-full sm:w-auto">Send Message</button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}