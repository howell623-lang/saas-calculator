import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <h1 className="text-9xl font-bold text-gray-200">404</h1>
      <h2 className="mt-4 text-3xl font-semibold text-gray-900">Page Not Found</h2>
      <p className="mt-4 text-lg text-gray-600 max-w-md">
        The calculation you are looking for seems to have been deleted or moved.
      </p>
      
      <div className="mt-8 flex flex-col gap-4 sm:flex-row">
        <Link 
          href="/"
          className="rounded-xl bg-gray-900 px-6 py-3 font-semibold text-white transition hover:bg-gray-800"
        >
          Go to Home
        </Link>
        <Link
          href="/contact"
          className="rounded-xl border border-gray-200 bg-white px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-50 hover:text-gray-900"
        >
          Report Broken Link
        </Link>
      </div>

      <div className="mt-12">
        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Popular Tools</p>
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          <Link href="/loan-amortization-calculator" className="text-sm text-blue-600 hover:underline">Loan Amortization</Link>
          <span className="text-gray-300">•</span>
          <Link href="/bmi-calculator" className="text-sm text-blue-600 hover:underline">BMI Calculator</Link>
          <span className="text-gray-300">•</span>
          <Link href="/compound-interest-projector" className="text-sm text-blue-600 hover:underline">Compound Interest</Link>
        </div>
      </div>
    </div>
  );
}
