import SEO from '@components/common/SEO';

export default function Disclaimer() {
  return (
    <>
      <SEO path="/disclaimer" title="Disclaimer" description="viewjob Disclaimer - Important information about the limitations of our service." />
      <div className="pt-4 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Disclaimer</h1>
          <p className="text-sm text-gray-400 mb-8">Last updated: January 2025</p>
          <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed space-y-6">
            <section><h2 className="text-xl font-bold text-gray-900 mb-2">General Information</h2><p>The information provided on viewjob is for general informational purposes only. While we strive to keep job listings accurate and up-to-date, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, or suitability of the information.</p></section>
            <section><h2 className="text-xl font-bold text-gray-900 mb-2">No Employment Guarantee</h2><p>viewjob is a job listing platform and does not guarantee employment, interviews, or any specific outcome from using our service. Applying for a job through our platform does not create an employment relationship between you and the listing company.</p></section>
            <section><h2 className="text-xl font-bold text-gray-900 mb-2">Third-Party Content</h2><p>Job listings are provided by third-party employers. viewjob does not verify the accuracy of all information in these listings and is not responsible for the content, policies, or practices of any employer listed on our platform.</p></section>
            <section><h2 className="text-xl font-bold text-gray-900 mb-2">Career Advice</h2><p>The career tips, resume advice, and other content on viewjob are provided for educational purposes only and should not be considered professional career counseling or legal advice. Always consult qualified professionals for specific guidance.</p></section>
            <section><h2 className="text-xl font-bold text-gray-900 mb-2">External Links</h2><p>Our website may contain links to external websites. We have no control over the content and nature of these sites and are not responsible for their content or privacy practices.</p></section>
            <section><h2 className="text-xl font-bold text-gray-900 mb-2">Consent</h2><p>By using viewjob, you hereby consent to our Disclaimer and agree to its terms.</p></section>
          </div>
        </div>
      </div>
    </>
  );
}