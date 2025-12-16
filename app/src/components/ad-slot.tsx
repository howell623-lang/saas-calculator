"use client";

import { useEffect } from "react";
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

  useEffect(() => {
    if (!adsEnabled) return;

    // Script is loaded globally in layout; push a fill request when enabled.
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error("adsbygoogle push error", err);
    }
  }, [adsEnabled]);

  if (!adsEnabled) return null;

  return (
    <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-3 text-sm text-gray-700">
      <ins
        className="adsbygoogle block w-full"
        style={{ display: "block", minHeight: 120 }}
        data-ad-client={ADS_CLIENT}
        data-ad-slot={ADS_SLOT}
        data-ad-format="auto"
        data-full-width-responsive="true"
        aria-label={`Ad slot ${slotName}`}
      />
      {note ? <p className="mt-2 text-xs text-gray-500">{note}</p> : null}
    </div>
  );
}
