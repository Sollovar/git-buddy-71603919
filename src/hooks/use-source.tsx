import { useSyncExternalStore } from "react";

export type MarketSource = "aster" | "kucoin";

const KEY = "chart-source";
const DEFAULT_SOURCE: MarketSource = "aster";

export const SOURCE_LABELS: Record<MarketSource, string> = {
  aster: "Aster",
  kucoin: "KuCoin",
};

let source: MarketSource = DEFAULT_SOURCE;
const listeners = new Set<() => void>();

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

function getSnapshot(): MarketSource {
  if (typeof window !== "undefined") {
    const stored = window.localStorage.getItem(KEY);
    if ((stored === "aster" || stored === "kucoin") && stored !== source) source = stored;
  }
  return source;
}

function getServerSnapshot(): MarketSource {
  return DEFAULT_SOURCE;
}

/** Read the active data source outside React (used by the data layer). */
export function getSource(): MarketSource {
  return getSnapshot();
}

export function setSource(next: MarketSource) {
  source = next;
  if (typeof window !== "undefined") window.localStorage.setItem(KEY, next);
  listeners.forEach((l) => l());
}

export function useSource(): [MarketSource, (next: MarketSource) => void] {
  const value = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return [value, setSource];
}
