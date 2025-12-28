export const dynamic = "force-dynamic";

export default function AdTestPage() {
  const ADS_CLIENT = "ca-pub-1856020780538432";
  const ADS_SLOT = "4228883995";

  return (
    <div className="mx-auto flex min-h-screen max-w-4xl flex-col gap-8 px-6 py-12">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">AdSense Test Page</h1>
        <p className="text-gray-600">
          This is a pure HTML-based ad test page to bypass any React component complexity.
        </p>
      </header>

      <section className="rounded-2xl border border-blue-100 bg-blue-50 p-6">
        <h2 className="text-lg font-semibold text-blue-900">Diagnosis Info</h2>
        <ul className="mt-2 list-inside list-disc text-sm text-blue-800">
          <li>Publisher ID: <code className="font-mono">{ADS_CLIENT}</code></li>
          <li>Slot ID: <code className="font-mono">{ADS_SLOT}</code></li>
          <li>Script Strategy: <code>afterInteractive</code> (via Layout)</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Test Slot 1 (Auto Format)</h2>
        <div className="flex min-h-[280px] w-full items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50">
          <ins
            className="adsbygoogle"
            style={{ display: "block", width: "100%", minHeight: "250px" }}
            data-ad-client={ADS_CLIENT}
            data-ad-slot={ADS_SLOT}
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Test Slot 2 (Fixed Rectangle)</h2>
        <div className="flex min-h-[300px] w-full items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50">
          <ins
            className="adsbygoogle"
            style={{ display: "inline-block", width: "300px", height: "250px" }}
            data-ad-client={ADS_CLIENT}
            data-ad-slot={ADS_SLOT}
          />
        </div>
      </section>

      <footer className="mt-12 text-center text-sm text-gray-500">
        <p>If you see empty boxes, check your browser console for 403 or "No Fill" errors.</p>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (adsbygoogle = window.adsbygoogle || []).push({});
              (adsbygoogle = window.adsbygoogle || []).push({});
              console.log("Static test page: Pushed 2 ad units");
            `,
          }}
        />
      </footer>
    </div>
  );
}
