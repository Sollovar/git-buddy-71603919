import { useEffect, useRef, useState } from "react";
import { Search, Star } from "lucide-react";

import { markets } from "@/components/MarketSelector";

const tabs = ["Favorites", "Futures", "Spot", "Prediction"];
const filters = ["All markets", "Top", "New", "Meme", "AI", "Pre-launch", "Stocks"];

export function MarketSelector({ onClose }: { onClose: () => void }) {
  const listRef = useRef<HTMLDivElement>(null);
  const [tab, setTab] = useState("Futures");
  const [filter, setFilter] = useState("All markets");
  const [query, setQuery] = useState("");

  useEffect(() => {
    listRef.current?.focus();
  }, []);

  const rows = markets.filter((m) => m.symbol.toLowerCase().includes(query.toLowerCase()));

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="fixed left-[10px] top-[128px] z-50 w-[calc(100vw_-_580px)] max-w-[calc(100vw_-_20px)] overflow-hidden rounded-2xl border border-border bg-background shadow-[0_18px_50px_oklch(0.4_0.04_60/0.18)]">
        <div className="p-4">
          <div className="flex items-center gap-3 rounded-xl bg-panel px-4 py-3">
            <Search className="h-[18px] w-[18px] text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search"
              className="min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:text-muted-foreground"
            />
          </div>
        </div>

        <div className="flex items-center gap-7 border-b border-border px-5 text-[15px]">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={
                t === tab
                  ? "flex items-center gap-1.5 border-b-2 border-gold-strong pb-2.5 font-semibold"
                  : "flex items-center gap-1.5 pb-2.5 text-muted-foreground"
              }
            >
              {t}
              {t === "Prediction" && <span className="h-1.5 w-1.5 rounded-full bg-down" />}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-1.5 px-4 py-3 text-[13.5px]">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-lg px-3 py-1.5 ${
                f === filter ? "bg-panel-2 font-medium" : "text-muted-foreground"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)] px-5 pb-1.5 text-[13px] leading-tight text-muted-foreground">
          <span>Symbols</span>
          <span className="text-right">
            Volume
            <br />
            <span className="text-muted-foreground/80">Open interest</span>
          </span>
          <span className="text-right">
            Price
            <br />
            <span className="text-muted-foreground/80">24h change</span>
          </span>
        </div>

        <div
          ref={listRef}
          tabIndex={0}
          className="no-scrollbar max-h-[340px] overflow-y-auto pb-2 outline-none"
          onKeyDown={(e) => {
            const el = e.currentTarget;
            if (e.key === "ArrowDown") { e.preventDefault(); el.scrollTop += 48; }
            if (e.key === "ArrowUp") { e.preventDefault(); el.scrollTop -= 48; }
            if (e.key === "PageDown") { e.preventDefault(); el.scrollTop += el.clientHeight; }
            if (e.key === "PageUp") { e.preventDefault(); el.scrollTop -= el.clientHeight; }
          }}
        >
          {rows.map((r) => (
            <div
              key={r.symbol}
              className="grid grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)] items-center px-5 py-2.5 text-[14.5px] tabular-nums tracking-tight hover:bg-panel"
            >
              <div className="flex items-center gap-3">
                <Star
                  className={`h-4 w-4 shrink-0 ${
                    r.fav ? "fill-gold-strong text-gold-strong" : "text-muted-foreground"
                  }`}
                />
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${r.iconClass}`}
                >
                  {r.icon}
                </span>
                <div className="min-w-0">
                  <div className="truncate font-medium">{r.symbol}</div>
                  <div className="mt-0.5 inline-block rounded bg-panel-2 px-1.5 text-[11px] text-muted-foreground">
                    {r.lev}
                  </div>
                </div>
              </div>
              <span className="text-right leading-tight">
                <span className="block">{r.volume}</span>
                <span className="block text-muted-foreground">{r.openInterest}</span>
              </span>
              <span className="text-right leading-tight">
                <span className="block">{r.price}</span>
                <span className={`block ${r.up ? "text-up" : "text-down"}`}>{r.change}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
