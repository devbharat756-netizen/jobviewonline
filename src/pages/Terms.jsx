import SEO from '@components/common/SEO';

export default function Terms() {
  return (
    <>
      <SEO path="/terms" title="Terms of Service" description="jobNext Terms of Service - The rules and guidelines for using our platform." />
      <div className="pt-28 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Terms of Service</h1>
          <p className="text-sm text-gray-400 mb-8">Last updated: January 2025</p>
          <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed space-y-6">
            <section><h2 className="text-xl font-bold text-gray-900 mb-2">1. Acceptance of Terms</h2><p>By accessing and using jobNext, you accept and agree to be bound by these Terms of Service. If you do not agree, please do not use our website.</p></section>
            <section><h2 className="text-xl font-bold text-gray-900 mb-2">2. Description of Service</h2><p>jobNext is a job search platform that displays job listings and provides career-related content. All job listings are provided for informational purposes. We do not guarantee the accuracy, completeness, or legitimacy of any listing.</p></section>
            <section><h2 className="text-xl font-bold text-gray-900 mb-2">3. User Conduct</h2><p>You agree to use jobNext only for lawful purposes. You must not: submit false or misleading information, attempt to gain unauthorized access to any part of the service, use the service to send spam, or impersonate any person or entity.</p></section>
            <section><h2 className="text-xl font-bold text-gray-900 mb-2">4. Intellectual Property</h2><p>All content on jobNext, including text, graphics, logos, and software, is the property of jobNext or its content suppliers and is protected by intellectual property laws.</p></section>
            <section><h2 className="text-xl font-bold text-gray-900 mb-2">5. Disclaimer of Warranties</h2><p>jobNext is provided "as is" and "as available" without warranties of any kind, either express or implied. We do not warrant that the service will be uninterrupted, error-free, or free of viruses.</p></section>
            <section><h2 className="text-xl font-bold text-gray-900 mb-2">6. Limitation of Liability</h2><p>In no event shall jobNext be liable for any indirect, incidental, special, or consequential damages arising out of or in connection with your use of the service.</p></section>
            <section><h2 className="text-xl font-bold text-gray-900 mb-2">7. Changes to Terms</h2><p>We reserve the right to modify these terms at any time. Continued use of the service after changes constitutes acceptance of the new terms.</p></section>
            <section><h2 className="text-xl font-bold text-gray-900 mb-2">8. Governing Law</h2><p>These terms shall be governed by and construed in accordance with the laws of the State of California, without regard to its conflict of law provisions.</p></section>
            <section><h2 className="text-xl font-bold text-gray-900 mb-2">9. Contact</h2><p>For questions about these Terms, contact us at legal@jobNext.com.</p></section>
          </div>
        </div>
      </div>
    </>
  );
}