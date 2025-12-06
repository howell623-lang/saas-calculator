"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

type AdsContextValue = {
  adsEnabled: boolean;
  toggleAds: () => void;
};

const AdsContext = createContext<AdsContextValue | undefined>(undefined);

const STORAGE_KEY = "adsEnabled";

export function AdsProvider({ children }: { children: React.ReactNode }) {
  const [adsEnabled, setAdsEnabled] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored !== "false";
  });

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, adsEnabled ? "true" : "false");
  }, [adsEnabled]);

  const value = useMemo(
    () => ({
      adsEnabled,
      toggleAds: () => setAdsEnabled((prev) => !prev),
    }),
    [adsEnabled]
  );

  return <AdsContext.Provider value={value}>{children}</AdsContext.Provider>;
}

export const useAds = () => {
  const context = useContext(AdsContext);
  if (!context) {
    throw new Error("useAds must be used inside AdsProvider");
  }
  return context;
};
