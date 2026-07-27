import SEO from '@components/common/SEO';

export default function PrivacyPolicy() {
  return (
    <>
      <SEO path="/privacy-policy" title="Privacy Policy" description="jobNext Privacy Policy - Learn how we handle your data and protect your privacy." />
      <div className="pt-28 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Privacy Policy</h1>
          <p className="text-sm text-gray-400 mb-8">Last updated: January 2025</p>
          <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed space-y-6">
            <section><h2 className="text-xl font-bold text-gray-900 mb-2">1. Introduction</h2><p>jobNext ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our website and services.</p></section>
            <section><h2 className="text-xl font-bold text-gray-900 mb-2">2. Information We Collect</h2><p>All data on jobNext is stored locally in your browser using LocalStorage. We do not collect, transmit, or store any personal information on our servers. The information you enter (profile data, saved jobs, applications) remains exclusively on your device.</p></section>
            <section><h2 className="text-xl font-bold text-gray-900 mb-2">3. How We Use Information</h2><p>Since all data is stored locally, we do not use your information for any purpose beyond providing the core functionality of the website. Your profile, saved jobs, and application data are used only to enhance your experience on the platform.</p></section>
            <section><h2 className="text-xl font-bold text-gray-900 mb-2">4. Cookies and Tracking</h2><p>jobNext does not use cookies for tracking purposes. We may use essential cookies for basic website functionality. Third-party services (such as Google AdSense, if enabled) may set their own cookies according to their own privacy policies.</p></section>
            <section><h2 className="text-xl font-bold text-gray-900 mb-2">5. Third-Party Services</h2><p>Our website may include links to third-party websites or embed third-party content (images from external servers). We are not responsible for the privacy practices of these third parties.</p></section>
            <section><h2 className="text-xl font-bold text-gray-900 mb-2">6. Data Security</h2><p>Since your data is stored locally in your browser, its security depends on the security of your device. We recommend using up-to-date browsers and being cautious about shared or public devices.</p></section>
            <section><h2 className="text-xl font-bold text-gray-900 mb-2">7. Your Rights</h2><p>You have full control over your data. You can view, edit, or delete all your locally stored data at any time through your browser's developer tools or by clearing your browser's LocalStorage.</p></section>
            <section><h2 className="text-xl font-bold text-gray-900 mb-2">8. Children's Privacy</h2><p>jobNext is not intended for use by individuals under the age of 16. We do not knowingly collect information from children.</p></section>
            <section><h2 className="text-xl font-bold text-gray-900 mb-2">9. Changes to This Policy</h2><p>We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated date.</p></section>
            <section><h2 className="text-xl font-bold text-gray-900 mb-2">10. Contact Us</h2><p>If you have questions about this Privacy Policy, please contact us at privacy@jobNext.com or through our Contact page.</p></section>
          </div>
        </div>
      </div>
    </>
  );
}