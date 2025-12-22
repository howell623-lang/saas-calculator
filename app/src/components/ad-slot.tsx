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

    const pushAd = () => {
      if (adPushed) return;

      try {
        if (typeof window !== "undefined") {
          const adsbygoogle = (window as any).adsbygoogle;
          
          if (!adsbygoogle) {
            console.warn("[AdSlot] AdSense script (adsbygoogle) not found on window. Retrying...");
            return;
          }

          // Double check if already initialized by AdSense attributes
          if (adRef.current?.getAttribute("data-adsbygoogle-status") === "done") {
            setAdPushed(true);
            return;
          }

          // Check if the element is visible
          if (adRef.current && adRef.current.offsetHeight === 0) {
             console.warn("[AdSlot] Container not visible yet");
          }

          adsbygoogle.push({});
          setAdPushed(true);
        }
      } catch (err: any) {
        if (err?.message?.includes("All 'ins' elements")) {
          setAdPushed(true);
          return;
        }
        // In dev or on rapid re-mount, this might fail, we mark as pushed to avoid loop
        setAdPushed(true);
        console.warn("[AdSlot] AdSense push notice:", err.message);
      }
    };

    // Use a slightly longer timeout and direct dependency check
    const timeout = setTimeout(pushAd, 500);
    return () => clearTimeout(timeout);
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
