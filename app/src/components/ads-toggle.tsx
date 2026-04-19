"use client";

import { useAds } from "./ads-context";

export function AdsToggle() {
  const { adsEnabled, toggleAds } = useAds();

  return (
    <button
      type="button"
      onClick={toggleAds}
      className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-1.5 text-xs font-semibold text-gray-300 ring-1 ring-white/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/10 hover:text-white active:scale-95"
    >
      {adsEnabled ? "Disable ads (subscriber view)" : "Enable ads"}
    </button>
  );
}
