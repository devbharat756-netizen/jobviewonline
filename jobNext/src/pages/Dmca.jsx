import SEO from '@components/common/SEO';

export default function Dmca() {
  return (
    <>
      <SEO path="/dmca" title="DMCA Policy" description="viewjob DMCA Copyright Infringement Policy - Guidelines for reporting copyright infringement." />
      <div className="pt-4 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">DMCA Copyright Policy</h1>
          <p className="text-sm text-gray-400 mb-8">Last updated: July 2026</p>
          <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed space-y-6">
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Introduction</h2>
              <p>
                viewjob respects the intellectual property rights of others. In accordance with the Digital Millennium Copyright Act ("DMCA"), we have adopted the following policy toward copyright infringement. We reserve the right to remove or disable access to material that we believe in good faith infringes a copyright, and to terminate the accounts of repeat infringers.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Reporting Copyright Infringement</h2>
              <p>
                If you believe that material hosted on or linked to by our website infringes your copyright, please send a formal written notice of copyright infringement to our Designated Agent. Your notice must include the following information:
              </p>
              <ul className="list-disc pl-5 space-y-2 mt-3">
                <li>A physical or electronic signature of a person authorized to act on behalf of the owner of the copyright that has been allegedly infringed.</li>
                <li>Identification of the copyrighted works claimed to have been infringed.</li>
                <li>Identification of the material that is claimed to be infringing or to be the subject of infringing activity, including specific URLs where the material is located.</li>
                <li>Information reasonably sufficient to permit us to contact you, such as an address, telephone number, and email address.</li>
                <li>A statement that you have a good faith belief that use of the material in the manner complained of is not authorized by the copyright owner, its agent, or the law.</li>
                <li>A statement that the information in the notification is accurate, and under penalty of perjury, that you are authorized to act on behalf of the owner of an exclusive right that is allegedly infringed.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Designated Copyright Agent Contact</h2>
              <p>
                Please send infringement notifications to our designated copyright department at:
              </p>
              <div className="bg-gray-50 dark:bg-slate-800/30 p-4 rounded-xl border border-gray-200/60 dark:border-slate-800 mt-3 font-mono text-sm space-y-1">
                <p>Email: copyright@viewjob.online</p>
                <p>Subject Line: DMCA Copyright Infringement Notice</p>
                <p>Address: viewjob Copyright Agent, 100 Innovation Way, Suite 400, San Francisco, CA 94107</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Counter-Notification Procedures</h2>
              <p>
                If you receive a notification that your content has been removed due to a copyright complaint, and you believe this was done in error or that you have the authorization to use the material, you may submit a counter-notice. Your counter-notice must be in writing and include:
              </p>
              <ul className="list-disc pl-5 space-y-2 mt-3">
                <li>Your physical or electronic signature.</li>
                <li>Identification of the material that was removed and the location/URL where it appeared before removal.</li>
                <li>A statement under penalty of perjury that you have a good faith belief that the material was removed or disabled as a result of mistake or misidentification.</li>
                <li>Your name, address, telephone number, and email address, along with a statement consenting to the jurisdiction of the federal court for your judicial district.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Repeat Infringers</h2>
              <p>
                viewjob takes repeat infringement seriously. Any user account or employer profile that accumulates multiple valid DMCA take-down notifications will be permanently terminated from utilizing our platforms.
              </p>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
