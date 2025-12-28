export default function PrivacyPage() {
  return (
    <div className="mx-auto flex min-h-screen max-w-4xl flex-col gap-10 px-6 py-16 md:py-20">
      <header className="space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">Privacy Policy</h1>
        <p className="text-gray-600 italic">Last Updated: December 2025</p>
      </header>

      <div className="prose prose-gray max-w-none space-y-8 text-gray-700">
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">1. Information We Collect</h2>
          <p>
            CalcPanda is designed to be a "tools-first" platform. We do not require account registration. 
            The data you enter into our calculators (e.g., financial numbers, health metrics) is processed locally 
            in your browser or on our secure servers only for the duration of the calculation and is not stored 
            personally by us.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">2. Cookies and Advertising</h2>
          <p>
            We use cookies to improve your experience and analyze site traffic. 
            <strong> Google AdSense:</strong> We use third-party advertising companies to serve ads when you visit our website. 
            These companies may use information (not including your name, address, email address, or telephone number) 
            about your visits to this and other websites in order to provide advertisements about goods and services 
            of interest to you.
          </p>
          <p>
            Google's use of advertising cookies enables it and its partners to serve ads to your users based on 
            their visit to your sites and/or other sites on the Internet. Users may opt out of personalized 
            advertising by visiting <a href="https://www.google.com/settings/ads" className="text-blue-600 hover:underline">Ads Settings</a>.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">3. Local Storage</h2>
          <p>
            We may use your browser's local storage to save your preferences, such as your "Ad-Free Mode" toggle, 
            to ensure a consistent experience across sessions.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">4. Third-Party Links</h2>
          <p>
            Our site may contain links to other websites. We are not responsible for the privacy practices or 
            content of such third-party sites.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">5. Changes to This Policy</h2>
          <p>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting 
            the new Privacy Policy on this page.
          </p>
        </section>
      </div>
    </div>
  );
}
