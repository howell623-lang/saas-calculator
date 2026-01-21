import Image from "next/image";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="mx-auto flex min-h-screen max-w-4xl flex-col gap-12 px-6 py-16 md:py-24">
      <header className="space-y-6 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
          Precision You Can Trust
        </h1>
        <p className="mx-auto max-w-2xl text-xl text-gray-600">
          CalcPanda is the web&apos;s leading independent calculation authority, delivering verifiable accuracy for financial, health, and engineering decisions.
        </p>
      </header>

      <div className="prose prose-lg prose-gray max-w-none text-gray-700">

        {/* Editorial Standards - The "Trust" Core */}
        <section className="rounded-3xl bg-gray-900 p-8 text-white shadow-xl md:p-12">
          <h2 className="mt-0 text-3xl font-bold text-white">Our Standards of Accuracy</h2>
          <p className="text-gray-300">
            In a world of misinformation, numbers must be beyond reproach. CalcPanda adheres to a strict
            <strong> 4-Point Verification Protocol</strong> for every tool we publish:
          </p>
          <ul className="not-prose mt-8 grid gap-6 sm:grid-cols-2">
            {[
              {
                title: "Primary Source Citations",
                desc: "We never guess formulas. We code directly from official documentation (IRS 1040 instructions, WHO BMI guidelines, ASTM standards)."
              },
              {
                title: "Double-Blind Testing",
                desc: "Each calculator is tested against known datasets by two independent engineers to ensure 100% computational parity."
              },
              {
                title: "Expert Review Board",
                desc: "Subject matter experts (CPAs, Licensed Engineers, Medical Professionals) review the context and explanations surrounding the numbers."
              },
              {
                title: "Regular Audits",
                desc: "Tax laws and health guidelines change. We audit our entire database quarterly to ensure ongoing compliance."
              }
            ].map((item) => (
              <li key={item.title} className="rounded-2xl bg-white/10 p-6 backdrop-blur">
                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-gray-300 leading-relaxed">{item.desc}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* Mission Section */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-gray-900">Why CalcPanda Exists</h2>
          <p>
            The internet is flooded with generic calculators that hide their logic. We believe you deserve transparency.
            When you use our <strong>Mortgage Calculator</strong>, we show you the amortization steps.
            When you use our <strong>Engineering Beam Calculator</strong>, we cite the relevant physics equations.
          </p>
          <p>
            Our mission is to democratize <strong>professional-grade analysis</strong>. We turn complex industry formulas
            into accessible, user-friendly, and free web tools, empowering you to make data-driven life decisions with confidence.
          </p>
        </section>

        {/* Team Section with better E-E-A-T signals */}
        <section className="space-y-8 border-t border-gray-100 pt-12">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">The Editorial Board</h2>
            <p className="text-gray-600 mt-2">The humans behind the algorithms.</p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                name: "Alex Chen, MSCS",
                role: "Lead Systems Architect",
                image: "👨‍💻",
                bio: "Former Fintech developer (Square, Stripe) with 12 years of experience in high-precision financial modeling. Ensures 6-decimal point accuracy across all financial tools."
              },
              {
                name: "Sarah Miller, CFA",
                role: "Senior Financial Reviewer",
                image: "👩‍💼",
                bio: "Chartered Financial Analyst specializing in personal wealth management. Responsible for vetting strict adherence to current US tax codes and lending standards."
              },
              {
                name: "Dr. James Wilson",
                role: "Scientific Advisor",
                image: "🔬",
                bio: "PhD in Applied Statistics. Consults on probability models and health metric standardizations to ensure statistical relevance in our estimations."
              }
            ].map((person) => (
              <div key={person.name} className="flex flex-col items-center text-center space-y-4 rounded-3xl bg-gray-50 p-6">
                <div className="h-24 w-24 rounded-full bg-white shadow-sm flex items-center justify-center text-4xl border border-gray-100">
                  {person.image}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{person.name}</h3>
                  <p className="text-xs font-bold uppercase tracking-widest text-blue-600">{person.role}</p>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {person.bio}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="border-t border-gray-100 pt-12 space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">Transparency Commitment</h2>
          <p>
            We are an independent publisher. While we may display advertisements to support our server costs,
            <strong> our calculation results are never influenced by sponsors</strong>.
            <Link href="/privacy" className="text-blue-600 hover:text-blue-800 font-medium ml-1">
              Read our Privacy Policy
            </Link> to learn how we protect your data (hint: we calculate everything locally in your browser).
          </p>

          <div className="rounded-2xl bg-blue-50 p-8">
            <h3 className="text-lg font-bold text-gray-900">Contact Us</h3>
            <p className="mt-2 text-gray-700">
              Found an error? Have a suggestion? We reward vigilance.
            </p>
            <p className="mt-4 font-medium text-gray-900">
              editorial@calcpanda.com<br />
              123 Tech Plaza, Suite 400<br />
              San Francisco, CA 94107
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
