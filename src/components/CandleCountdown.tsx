import { useEffect, useState } from "react";

import type { Interval } from "@/lib/market-data";

/** Bar duration in ms per interval. */
const MS: Record<Interval, number> = {
  "1m": 60_000,
  "3m": 180_000,
  "5m": 300_000,
  "15m": 900_000,
  "30m": 1_800_000,
  "1h": 3_600_000,
  "2h": 7_200_000,
  "4h": 14_400_000,
  "6h": 21_600_000,
  "12h": 43_200_000,
  "1d": 86_400_000,
  "3d": 259_200_000,
  "1w": 604_800_000,
  "1M": 2_592_000_000,
};

function pad(n: number) {
  return String(Math.floor(n)).padStart(2, "0");
}

function remaining(interval: Interval, now: number) {
  const span = MS[interval];
  const left = span - (now % span);
  const h = left / 3_600_000;
  const m = (left % 3_600_000) / 60_000;
  const s = (left % 60_000) / 1000;
  return left >= 86_400_000
    ? `${Math.floor(left / 86_400_000)}d ${pad((left % 86_400_000) / 3_600_000)}:${pad(m)}:${pad(s)}`
    : `${pad(h)}:${pad(m)}:${pad(s)}`;
}

/**
 * Live countdown to the close of the current candle plus the wall clock,
 * rendered at the bottom of the chart. KLineCharts has no built-in
 * countdown widget, so it is drawn as an overlay above the x-axis.
 */
export function CandleCountdown({
  interval,
  className,
}: {
  interval: Interval;
  className?: string;
}) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  if (now === null) return null;

  const clock = new Date(now).toLocaleTimeString("en-GB", { hour12: false });

  return (
    <div
      className={`pointer-events-none absolute z-10 flex items-center gap-2 font-medium tabular-nums tracking-tight text-[11.5px] text-muted-foreground ${className ?? ""}`}
    >
      <span className="text-foreground">{remaining(interval, now)}</span>
      <span className="h-3 w-px bg-border" />
      <span>{clock}</span>
    </div>
  );
}
