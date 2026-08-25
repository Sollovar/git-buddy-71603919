import { useEffect, useState } from "react";
import { fetchTicker, type Ticker } from "@/lib/market-data";
import { useSource } from "@/hooks/use-source";

/** Polls the 24h ticker for the given symbol so header stats stay live. */
export function useTicker(symbol: string, intervalMs = 5000) {
  const [ticker, setTicker] = useState<Ticker | null>(null);
  const [source] = useSource();

  useEffect(() => {
    let cancelled = false;
    setTicker(null);

    const load = async () => {
      try {
        const t = await fetchTicker(symbol, source);
        if (!cancelled) setTicker(t);
      } catch {
        /* keep last known values */
      }
    };

    void load();
    const id = setInterval(load, intervalMs);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [symbol, intervalMs, source]);


  return ticker;
}

export function formatPrice(value: number | null | undefined, precision = 2): string {
  if (value === null || value === undefined || !Number.isFinite(value)) return "--";
  return value.toLocaleString(undefined, {
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
  });
}

export function formatCompact(value: number | null | undefined): string {
  if (value === null || value === undefined || !Number.isFinite(value)) return "--";
  if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `${(value / 1e6).toFixed(2)}M`;
  if (value >= 1e3) return `${(value / 1e3).toFixed(2)}K`;
  return value.toFixed(2);
}

export function formatCountdown(target: number | null | undefined): string {
  if (!target) return "--:--:--";
  const diff = Math.max(0, target - Date.now());
  const h = Math.floor(diff / 3_600_000);
  const m = Math.floor((diff % 3_600_000) / 60_000);
  const s = Math.floor((diff % 60_000) / 1000);
  return [h, m, s].map((n) => String(n).padStart(2, "0")).join(":");
}
