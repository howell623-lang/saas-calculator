"use client";

import { useAds } from "./ads-context";

export function AdsToggle() {
  const { adsEnabled, toggleAds } = useAds();

  return (
    <button
      type="button"
      onClick={toggleAds}
      className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-gray-900 ring-1 ring-gray-200 transition hover:-translate-y-0.5 hover:ring-gray-900/20"
    >
      {adsEnabled ? "Disable ads (subscriber view)" : "Enable ads"}
    </button>
  );
}
