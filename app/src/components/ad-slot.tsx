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
            console.log(`[AdSlot:${slotName}] Waiting for adsbygoogle script...`);
            return;
          }

          // Check if the element is already processed by AdSense
          if (adRef.current?.getAttribute("data-adsbygoogle-status") === "done") {
            console.log(`[AdSlot:${slotName}] Ad already marked as done by AdSense.`);
            setAdPushed(true);
            return;
          }

          console.log(`[AdSlot:${slotName}] Pushing ad request...`);
          adsbygoogle.push({});
          setAdPushed(true);
        }
      } catch (err: any) {
        console.error(`[AdSlot:${slotName}] Error pushing ad:`, err);
        setAdPushed(true);
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
