export default function ContactPage() {
  return (
    <div className="mx-auto flex min-h-screen max-w-4xl flex-col gap-10 px-6 py-16 md:py-20">
      <header className="space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">Contact Us</h1>
        <p className="text-xl text-gray-700">
          We are here to help. Whether you found a bug or need a new calculator built.
        </p>
      </header>

      <div className="prose prose-gray max-w-none space-y-8 text-gray-700">
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">Get in Touch</h2>
          <p>
            At CalcPanda, we take user feedback seriously. In fact, over 30% of our new tool ideas come directly from user requests.
          </p>
          
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
              <h3 className="font-bold text-gray-900 mb-2">General Support</h3>
              <p className="text-sm text-gray-600 mb-4">For bug reports, usability issues, or general inquiries.</p>
              <a href="mailto:support@calcpanda.com" className="text-blue-600 font-medium hover:underline">support@calcpanda.com</a>
            </div>
            
            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
              <h3 className="font-bold text-gray-900 mb-2">Partnerships & Press</h3>
              <p className="text-sm text-gray-600 mb-4">For API access, media inquiries, or advertising opportunities.</p>
              <a href="mailto:partners@calcpanda.com" className="text-blue-600 font-medium hover:underline">partners@calcpanda.com</a>
            </div>
          </div>
        </section>

        <section className="space-y-4 rounded-2xl bg-gray-50 p-6 ring-1 ring-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">Our Commitment</h2>
          <ul className="list-inside list-disc space-y-2 text-sm">
            <li><strong>Response Time:</strong> We aim to respond to all support tickets within 24 hours (Monday-Friday).</li>
            <li><strong>Bug Bounties:</strong> If you find a calculation error that we verify, we will acknowledge you in our release notes (if you wish).</li>
            <li><strong>Feature Requests:</strong> We review all tool requests during our weekly product meetings.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">Mailing Address</h2>
          <p>
            CalcPanda Inc.<br />
            123 Tech Plaza, Suite 400<br />
            San Francisco, CA 94107<br />
            United States
          </p>
        </section>
      </div>
    </div>
  );
}
