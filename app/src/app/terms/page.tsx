export default function TermsPage() {
  return (
    <div className="mx-auto flex min-h-screen max-w-4xl flex-col gap-10 px-6 py-16 md:py-20">
      <header className="space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">Terms of Service</h1>
        <p className="text-gray-600 italic">Last Updated: December 2025</p>
      </header>

      <div className="prose prose-gray max-w-none space-y-8 text-gray-700">
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">1. Acceptance of Terms</h2>
          <p>
            By accessing and using CalcPanda, you agree to comply with and be bound by these Terms of Service. 
            If you do not agree, please refrain from using our tools.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">2. Use of Tools</h2>
          <p>
            The calculators provided on CalcPanda are for informational purposes only. While we strive for 
            accuracy, results should not be used as the sole basis for critical financial, medical, or 
            engineering decisions. Always consult with a qualified professional.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">3. Intellectual Property</h2>
          <p>
            All content, including the underlying logic and design of the calculators, is the property of 
            CalcPanda and is protected by copyright laws. You may not reproduce or redistribute our tools 
            without explicit permission.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">4. Disclaimer of Warranties</h2>
          <p>
            CalcPanda is provided "as is" without any warranties, express or implied. We do not guarantee 
            that the site will be error-free or uninterrupted.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">5. Limitation of Liability</h2>
          <p>
            In no event shall CalcPanda or its creators be liable for any damages arising from the use or 
            inability to use our tools, even if advised of the possibility of such damages.
          </p>
        </section>
      </div>
    </div>
  );
}
