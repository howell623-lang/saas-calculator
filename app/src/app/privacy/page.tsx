export default function PrivacyPage() {
  return (
    <div className="mx-auto flex min-h-screen max-w-4xl flex-col gap-10 px-6 py-16 md:py-20">
      <header className="space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">Privacy Policy</h1>
        <p className="text-gray-600 italic">Last Updated: January 15, 2026</p>
      </header>

      <div className="prose prose-gray max-w-none space-y-8 text-gray-700">
        <div className="rounded-2xl bg-blue-50 p-6 ring-1 ring-blue-100">
          <h2 className="text-lg font-bold text-blue-900 mb-2">The CalcPanda Promise: Zero-Data Retention</h2>
          <p className="text-sm text-blue-800">
            Unlike other online tools, CalcPanda performs all calculations <strong>client-side</strong> within your browser. 
            We do not have a backend database that stores your financial inputs, health metrics, or personal scenarios. 
            What you type here, stays on your device.
          </p>
        </div>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">1. Information We Collect</h2>
          <p>
            Because we do not offer user accounts, our data collection is minimal and strictly non-personal:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>Usage Data:</strong> We use aggregated analytics (like Google Analytics) to see which tools are most popular.</li>
            <li><strong>Technical Data:</strong> We may collect your IP address and browser type for security and debugging purposes.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">2. Cookies & Advertising (Google AdSense)</h2>
          <p>
            To keep this site free, we partner with Google AdSense to serve advertisements. 
            Google uses cookies to serve ads based on your prior visits to our website or other websites.
          </p>
          <p>
             Google's use of advertising cookies enables it and its partners to serve ads to you based on your visit to our sites and/or other sites on the Internet.
          </p>
          <p>
            You may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google Ads Settings</a>.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">3. CCPA & GDPR Rights</h2>
          <p>
            Although we do not store personal data, we respect your rights under the California Consumer Privacy Act (CCPA) and the General Data Protection Regulation (GDPR).
          </p>
          <p>
            <strong>For California Residents:</strong> You have the right to know what personal information is collected and to request deletion. Since we don't store your inputs, there is typically nothing to delete, but you can contact us for verification.
          </p>
          <p>
            <strong>For EEA Users:</strong> We rely on legitimate interests to process technical data for site security. You have the right to object to this processing.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">4. Local Storage</h2>
          <p>
            We use your browser's "Local Storage" mechanism to remember your preferences (like Dark Mode or "Ad-Free" toggles). 
            You can clear this at any time by clearing your browser cache.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">5. Contact Us</h2>
          <p>
            If you have questions about this policy, please contact our Data Protection Officer at:
            <br />
            <a href="mailto:privacy@calcpanda.com" className="text-blue-600 font-medium hover:underline">privacy@calcpanda.com</a>
          </p>
        </section>
      </div>
    </div>
  );
}
