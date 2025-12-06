"use client";

import { AdsProvider } from "./ads-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return <AdsProvider>{children}</AdsProvider>;
}
