import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUp } from "lucide-react";

type Level = { price: number; size: number };

const LEVELS = 6;
const BASE = 67432.5;

function seed(side: "bid" | "ask"): Level[] {
  return Array.from({ length: LEVELS }, (_, i) => ({
    price: side === "bid" ? BASE - 1.5 - i * 2.5 : BASE + 1.5 + i * 2.5,
    size: 0.4 + Math.random() * 2.2,
  }));
}

function drift(levels: Level[], side: "bid" | "ask", shift: number): Level[] {
  return levels.map((l, i) => ({
    price: (side === "bid" ? BASE - 1.5 - i * 2.5 : BASE + 1.5 + i * 2.5) + shift,
    size: Math.max(0.15, l.size + (Math.random() - 0.5) * 0.9),
  }));
}

export function LiveOrderBook() {
  const [bids, setBids] = useState<Level[]>(() => seed("bid"));
  const [asks, setAsks] = useState<Level[]>(() => seed("ask"));
  const [last, setLast] = useState(BASE);
  const [up, setUp] = useState(true);
  const shift = useRef(0);

  useEffect(() => {
    const id = setInterval(() => {
      shift.current += (Math.random() - 0.48) * 3;
      setBids((b) => drift(b, "bid", shift.current));
      setAsks((a) => drift(a, "ask", shift.current));
      setLast((prev) => {
        const next = BASE + shift.current + (Math.random() - 0.5);
        setUp(next >= prev);
        return next;
      });
    }, 900);
    return () => clearInterval(id);
  }, []);

  const max = Math.max(...bids.map((l) => l.size), ...asks.map((l) => l.size));

  const Row = ({ level, side }: { level: Level; side: "bid" | "ask" }) => (
    <div className="relative flex items-center justify-between overflow-hidden rounded-lg px-3 py-[7px]">
      <span
        className={`absolute inset-y-0 ${side === "bid" ? "left-0" : "right-0"} rounded-lg transition-[width] duration-700 ease-out ${
          side === "bid" ? "bg-bid/12" : "bg-ask/12"
        }`}
        style={{ width: `${(level.size / max) * 100}%` }}
      />
      <span
        className={`relative font-num text-[12px] font-semibold tabular-nums ${
          side === "bid" ? "text-bid" : "text-ask"
        }`}
      >
        {level.price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </span>
      <span className="relative font-num text-[11px] tabular-nums text-ink-muted transition-all duration-500">
        {level.size.toFixed(3)}
      </span>
    </div>
  );

  return (
    <div className="mx-auto mt-7 max-w-xl overflow-hidden rounded-3xl border border-ink-border bg-ink shadow-[0_30px_60px_-40px_oklch(0.18_0.008_62_/_0.45)]">
      <div className="flex items-center justify-between border-b border-ink-border px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-bid opacity-70" />
            <span className="relative inline-flex size-2 rounded-full bg-bid" />
          </span>
          <span className="text-xs font-semibold text-ink-foreground">BTC-USDT Order Book</span>
        </div>
        <span className="rounded-full bg-ink-elevated px-2.5 py-1 text-[10px] font-medium text-ink-muted">
          Live
        </span>
      </div>

      <div className="grid grid-cols-2 px-4 pt-3 pb-1 text-[10px] uppercase tracking-wide text-ink-muted">
        <span>Price (USDT)</span>
        <span className="text-right">Size (BTC)</span>
      </div>

      <div className="space-y-[3px] px-1.5">
        {[...asks].reverse().map((l, i) => (
          <Row key={`a${i}`} level={l} side="ask" />
        ))}
      </div>

      <div className="my-2 flex items-center justify-between border-y border-ink-border bg-ink-elevated px-4 py-2.5">
        <span
          className={`flex items-center gap-1.5 font-num text-base font-bold tabular-nums transition-colors duration-300 ${
            up ? "text-bid" : "text-ask"
          }`}
        >
          {up ? <ArrowUp className="size-4" /> : <ArrowDown className="size-4" />}
          {last.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
        <span className="text-[11px] text-ink-muted">Spread 3.00</span>
      </div>

      <div className="space-y-[3px] px-1.5 pb-3">
        {bids.map((l, i) => (
          <Row key={`b${i}`} level={l} side="bid" />
        ))}
      </div>
    </div>
  );
}
