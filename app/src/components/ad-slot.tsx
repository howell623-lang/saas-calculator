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
  const containerRef = useRef<HTMLDivElement>(null);

  // Force re-render on mount and occasional updates to ensure script can find the element
  useEffect(() => {
    setKey((prev) => prev + 1);
  }, [adsEnabled]);

  useEffect(() => {
    if (adsEnabled && key > 0) {
      try {
        if (typeof window !== "undefined") {
          // Initialize adsbygoogle if it doesn't exist
          window.adsbygoogle = window.adsbygoogle || [];
          
          const ins = containerRef.current?.querySelector("ins");
          if (ins && ins.innerHTML.trim() === "") {
            console.log("Pushing ad for slot:", slotName);
            (window.adsbygoogle as any[]).push({});
          }
        }
      } catch (e) {
        console.error("AdSense push error:", e);
      }
    }
  }, [adsEnabled, key, slotName]);

  if (!adsEnabled) return null;

  return (
    <div
      key={key}
      ref={containerRef}
      className="mx-auto w-full rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-3 text-sm text-gray-700"
      style={{ minHeight: "280px", maxWidth: "100%", overflow: "hidden" }}
    >
      <ins
        className="adsbygoogle"
        style={{ display: "block", minWidth: "250px", minHeight: "250px" }}
        data-ad-client={ADS_CLIENT}
        data-ad-slot={ADS_SLOT}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
      {note && <p className="mt-2 text-xs text-gray-500">{note}</p>}
    </div>
  );
}
