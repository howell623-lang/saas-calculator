export default function ContactPage() {
  return (
    <div className="mx-auto flex min-h-screen max-w-4xl flex-col gap-10 px-6 py-16 md:py-20">
      <header className="space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">Contact Us</h1>
        <p className="text-xl text-gray-700">
          Have a question or feedback? We'd love to hear from you.
        </p>
      </header>

      <div className="prose prose-gray max-w-none space-y-8 text-gray-700">
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">Get in Touch</h2>
          <p>
            Whether you have a suggestion for a new calculator, found a bug, or want to share a 
            success story of how CalcPanda helped you, please reach out.
          </p>
          <div className="rounded-2xl bg-gray-50 p-6 ring-1 ring-gray-200">
            <p className="font-semibold text-gray-900">Email:</p>
            <p className="text-lg">support@calcpanda.com</p>
            <p className="mt-4 text-sm text-gray-500 italic">
              Note: We typically respond within 24-48 hours.
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">Follow Our Progress</h2>
          <p>
            We are constantly adding new tools and features. Stay tuned for updates as we expand 
            our "calculator factory" to cover more aspects of your daily life.
          </p>
        </section>
      </div>
    </div>
  );
}
