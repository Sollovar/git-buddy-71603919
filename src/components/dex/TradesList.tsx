import { useEffect, useState } from "react";

import { usePair } from "@/hooks/use-pair";
import { useSource } from "@/hooks/use-source";
import { fetchTrades, type Trade } from "@/lib/market-data";

function decimalsOf(n: number) {
  const s = String(n);
  const dot = s.indexOf(".");
  return dot === -1 ? 0 : Math.min(4, s.length - dot - 1);
}

function fmtPrice(v: number, d: number) {
  return v.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
}

function fmtSize(v: number) {
  return v.toFixed(1);
}

function fmtTime(ms: number) {
  return new Date(ms).toLocaleTimeString("en-GB", { hour12: false });
}

/** Live recent-trades tape (price / size in USDT / time). */
export function TradesList() {
  const [pair] = usePair();
  const [source] = useSource();
  const [trades, setTrades] = useState<Trade[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setTrades([]);
    setError(null);

    const load = async () => {
      try {
        const rows = await fetchTrades(pair, { limit: 40, source });
        if (!cancelled) {
          setTrades(rows);
          setError(null);
        }
      } catch (e) {
        if (!cancelled && trades.length === 0) {
          setError(e instanceof Error ? e.message : "Unable to load trades");
        }
      }
    };

    void load();
    const id = setInterval(load, 2000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pair, source]);

  const precision = trades.length ? Math.max(...trades.map((t) => decimalsOf(t.price))) : 1;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="grid grid-cols-3 px-3 pb-1 pt-2 text-[12.5px] text-muted-foreground">
        <span>Price(USDT)</span>
        <span className="text-right">Size(USDT)</span>
        <span className="text-right">Time</span>
      </div>

      <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto">
        {trades.length === 0 && (
          <p className="px-3 py-6 text-center text-[12.5px] text-muted-foreground">
            {error ?? "Loading trades…"}
          </p>
        )}
        {trades.map((t) => (
          <div
            key={t.id}
            className="grid grid-cols-3 px-3 py-[7px] tabular-nums tracking-tight text-[13.5px]"
          >
            <span className={t.side === "buy" ? "text-up" : "text-down"}>
              {fmtPrice(t.price, precision)}
            </span>
            <span className="text-right">{fmtSize(t.size)}</span>
            <span className="text-right text-muted-foreground">{fmtTime(t.time)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
