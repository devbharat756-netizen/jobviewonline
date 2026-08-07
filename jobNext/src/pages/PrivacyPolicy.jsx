import SEO from '@components/common/SEO';

const sections = [
  {
    title: '1. Introduction',
    body: 'jobNext ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our website and services.',
  },
  {
    title: '2. Information We Collect',
    body: 'All data on jobNext is stored locally in your browser using LocalStorage. We do not collect, transmit, or store any personal information on our servers. The information you enter (profile data, saved jobs, applications) remains exclusively on your device.',
  },
  {
    title: '3. How We Use Information',
    body: 'Since all data is stored locally, we do not use your information for any purpose beyond providing the core functionality of the website. Your profile, saved jobs, and application data are used only to enhance your experience on the platform.',
  },
  {
    title: '4. Cookies and Tracking',
    body: 'jobNext does not use cookies for tracking purposes. We may use essential cookies for basic website functionality. Third-party services (such as Adsterra, if enabled) may set their own cookies according to their own privacy policies.',
  },
  {
    title: '5. Third-Party Services',
    body: 'Our website may include links to third-party websites or embed third-party content (images from external servers). We are not responsible for the privacy practices of these third parties.',
  },
  {
    title: '6. Data Security',
    body: 'Since your data is stored locally in your browser, its security depends on the security of your device. We recommend using up-to-date browsers and being cautious about shared or public devices.',
  },
  {
    title: '7. Your Rights',
    body: "You have full control over your data. You can view, edit, or delete all your locally stored data at any time through your browser's developer tools or by clearing your browser's LocalStorage.",
  },
  {
    title: "8. Children's Privacy",
    body: 'jobNext is not intended for use by individuals under the age of 16. We do not knowingly collect information from children.',
  },
  {
    title: '9. Changes to This Policy',
    body: 'We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated date.',
  },
  {
    title: '10. Contact Us',
    body: 'If you have questions about this Privacy Policy, please contact us at privacy@jobNext.com or through our Contact page.',
  },
];

export default function PrivacyPolicy() {
  return (
    <>
      <SEO path="/privacy-policy" title="Privacy Policy" description="jobNext Privacy Policy - Learn how we handle your data and protect your privacy." />
      <div className="pt-4 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-slate-100 mb-2">Privacy Policy</h1>
          <p className="text-sm text-gray-400 dark:text-slate-500 mb-8">Last updated: January 2025</p>

          <div className="space-y-4">
            {sections.map((section) => (
              <section
                key={section.title}
                className="bg-white dark:bg-slate-900 rounded-2xl p-6 lg:p-8 shadow-sm border border-gray-100 dark:border-slate-800"
              >
                <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100 mb-2">{section.title}</h2>
                <p className="text-gray-600 dark:text-slate-400 leading-relaxed">{section.body}</p>
              </section>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}