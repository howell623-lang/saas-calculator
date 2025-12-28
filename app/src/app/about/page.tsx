export default function AboutPage() {
  return (
    <div className="mx-auto flex min-h-screen max-w-4xl flex-col gap-10 px-6 py-16 md:py-20">
      <header className="space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">About CalcPanda</h1>
        <p className="text-xl text-gray-700">
          Empowering your daily decisions with precise, easy-to-use calculation tools.
        </p>
      </header>

      <div className="prose prose-gray max-w-none space-y-8 text-gray-700">
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">Our Mission</h2>
          <p>
            At CalcPanda, we believe that complex calculations shouldn't be a barrier to informed decision-making. 
            Whether you're managing personal finances, tracking health metrics, or solving engineering problems, 
            our goal is to provide instant, accurate, and accessible tools that simplify your life.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">What We Offer</h2>
          <p>
            We host a growing collection of JSON-driven calculators across various categories:
          </p>
          <ul className="list-inside list-disc space-y-2">
            <li><strong>Finance:</strong> From loan amortizations to investment growth projections.</li>
            <li><strong>Health & Fitness:</strong> Tools to track BMI, calorie needs, and more.</li>
            <li><strong>Engineering & Science:</strong> Quick estimators for technical professionals.</li>
            <li><strong>Daily Life:</strong> Simple solutions for everyday planning and conversion.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">Commitment to Quality</h2>
          <p>
            Every calculator on our platform is built with rigorous logic and tested for accuracy. 
            We value user privacy and transparency, offering a distraction-free experience with an optional ad-free mode.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">Our Story</h2>
          <p>
            CalcPanda started as a micro-SaaS project aimed at creating a "factory" for high-performance, 
            SEO-friendly calculators. Today, it serves thousands of users who seek reliable answers without 
            the clutter of traditional spreadsheet software.
          </p>
        </section>
      </div>
    </div>
  );
}
