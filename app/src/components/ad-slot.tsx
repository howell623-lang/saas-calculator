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
  const adRef = useRef<HTMLModElement>(null);
  const [adPushed, setAdPushed] = useState(false);
  const [adError, setAdError] = useState(false);

  useEffect(() => {
    // Only push when ads are enabled and component is mounted
    if (!adsEnabled || !adRef.current) return;

    // We use a key to force re-mounting if needed, but here we track push state per mount
    if (adPushed) return;

    const pushAd = () => {
      try {
        if (typeof window !== "undefined") {
          const adsbygoogle = (window as any).adsbygoogle || [];
          // Check if this specific element already has an ad (AdSense adds attributes)
          if (adRef.current && adRef.current.getAttribute("data-adsbygoogle-status") === "done") {
            return;
          }
          adsbygoogle.push({});
          setAdPushed(true);
          setAdError(false);
        }
      } catch (err: any) {
        // Tag already pushed or other common AdSense "errors" that aren't fatal
        if (err?.message?.includes("All 'ins' elements")) {
          setAdPushed(true);
          return;
        }
        console.error("[AdSlot] Error pushing ad:", err);
      }
    };

    // Use requestAnimationFrame to ensure the DOM has updated before pushing
    const rafId = requestAnimationFrame(() => {
      const timeout = setTimeout(pushAd, 200);
      return () => clearTimeout(timeout);
    });

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, [adsEnabled, adPushed]);

  if (!adsEnabled) return null;

  return (
    <div 
      className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-3 text-sm text-gray-700"
      style={{ minHeight: "280px", overflow: "hidden" }}
    >
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ 
          display: "block", 
          minHeight: "250px",
          width: "100%"
        }}
        data-ad-client={ADS_CLIENT}
        data-ad-slot={ADS_SLOT}
        data-ad-format="auto"
        data-full-width-responsive="true"
        aria-label={`Ad slot ${slotName}`}
      />
      {adError && (
        <p className="mt-2 text-xs text-red-500">
          Ad failed to load
        </p>
      )}
      {note && !adError && (
        <p className="mt-2 text-xs text-gray-500">{note}</p>
      )}
    </div>
  );
}
