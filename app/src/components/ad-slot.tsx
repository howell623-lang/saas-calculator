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
    // Only push once when ads are enabled and component is mounted
    if (!adsEnabled || adPushed || !adRef.current) return;

    // Wait for adsbygoogle script to be fully loaded
    const pushAd = () => {
      try {
        // Check if the script is loaded
        if (typeof window !== "undefined" && window.adsbygoogle) {
          // Push ad request
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          setAdPushed(true);
          setAdError(false);
        } else {
          // Script not loaded yet, retry after a short delay
          setTimeout(pushAd, 100);
        }
      } catch (err) {
        console.error("[AdSlot] Error pushing ad:", err);
        setAdError(true);
      }
    };

    // Small delay to ensure DOM is ready
    const timeout = setTimeout(pushAd, 50);

    return () => clearTimeout(timeout);
  }, [adsEnabled, adPushed]);

  if (!adsEnabled) return null;

  return (
    <div 
      className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-3 text-sm text-gray-700"
      style={{ minHeight: "150px" }}
    >
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ 
          display: "block", 
          minHeight: "120px",
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
