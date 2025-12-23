"use client";

import { useEffect, useRef, useState } from "react";
import { useAds } from "./ads-context";

const ADS_CLIENT = "ca-pub-1856020780538432";
const ADS_SLOT = "4228883995";

type Props = {
  slotName?: string;
  note?: string;
};

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

export function AdSlot({ slotName = "global", note }: Props) {
  const { adsEnabled } = useAds();
  const [key, setKey] = useState(0);

  // Force re-render on mount and occasional updates to ensure script can find the element
  useEffect(() => {
    setKey(prev => prev + 1);
  }, [adsEnabled]);

  if (!adsEnabled) return null;

  return (
    <div 
      key={key}
      className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-3 text-sm text-gray-700 mx-auto w-full"
      style={{ minHeight: "280px", maxWidth: "100%", overflow: "hidden" }}
    >
      <div
        dangerouslySetInnerHTML={{
          __html: `
            <ins class="adsbygoogle"
                 style="display:block; min-width:250px; min-height:250px;"
                 data-ad-client="${ADS_CLIENT}"
                 data-ad-slot="${ADS_SLOT}"
                 data-ad-format="auto"
                 data-full-width-responsive="true"></ins>
            <script>
                 (adsbygoogle = window.adsbygoogle || []).push({});
            </script>
          `
        }}
      />
      {note && (
        <p className="mt-2 text-xs text-gray-500">{note}</p>
      )}
    </div>
  );
}
