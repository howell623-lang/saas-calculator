"use client";

import { useEffect, useRef } from "react";
import { useAds } from "./ads-context";

const ADS_CLIENT = "ca-pub-1246375873484346";
const ADS_SLOT = "2854601889";

type Props = {
  slotName?: string;
  note?: string;
};

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

let adsScriptInjected = false;

export function AdSlot({ slotName = "global", note }: Props) {
  const { adsEnabled } = useAds();
  const adRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!adsEnabled) return;

    if (!adsScriptInjected) {
      const script = document.createElement("script");
      script.async = true;
      script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js";
      script.setAttribute("data-ad-client", ADS_CLIENT);
      document.head.appendChild(script);
      adsScriptInjected = true;
    }

    // Push a new ad request when the slot is mounted
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
        ref={adRef}
      />
      {note ? <p className="mt-2 text-xs text-gray-500">{note}</p> : null}
    </div>
  );
}
