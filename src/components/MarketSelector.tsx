import { useState } from "react";
import { Search, X, Star } from "lucide-react";

export type Market = {
  symbol: string;
  lev: string;
  volume: string;
  openInterest: string;
  price: string;
  change: string;
  up?: boolean;
  fav?: boolean;
  icon: string;
  iconClass: string;
};

export const markets: Market[] = [
  {
    symbol: "ASTERUSDT",
    lev: "200x",
    volume: "$13,193,784",
    openInterest: "$217,433,009",
    price: "0.6010",
    change: "-1.17%",
    icon: "A",
    iconClass: "bg-primary text-primary-foreground",
  },
  {
    symbol: "BTCUSDT",
    lev: "200x",
    volume: "$1,098,537,718",
    openInterest: "$775,522,983",
    price: "62,922.0",
    change: "-2.98%",
    fav: true,
    icon: "₿",
    iconClass: "bg-chart-1 text-card",
  },
  {
    symbol: "ETHUSDT",
    lev: "200x",
    volume: "$436,841,213",
    openInterest: "$342,783,712",
    price: "1,863.48",
    change: "-2.98%",
    icon: "Ξ",
    iconClass: "bg-chart-3 text-card",
  },
  {
    symbol: "BNBUSDT",
    lev: "200x",
    volume: "$14,651,307",
    openInterest: "$9,620,941",
    price: "587.76",
    change: "-0.89%",
    icon: "B",
    iconClass: "bg-chart-4 text-card",
  },
  {
    symbol: "SOLUSDT",
    lev: "100x",
    volume: "$48,875,990",
    openInterest: "$225,883,702",
    price: "72.89",
    change: "-2.29%",
    icon: "S",
    iconClass: "bg-foreground text-card",
  },
  {
    symbol: "XRPUSDT",
    lev: "100x",
    volume: "$9,350,835",
    openInterest: "$53,518,500",
    price: "1.0624",
    change: "-2.05%",
    icon: "X",
    iconClass: "bg-muted-foreground text-card",
  },
  {
    symbol: "DOGEUSDT",
    lev: "75x",
    volume: "$7,822,915",
    openInterest: "$6,091,635",
    price: "0.06966",
    change: "-1.43%",
    icon: "D",
    iconClass: "bg-chart-5 text-card",
  },
  {
    symbol: "HYPEUSDT",
    lev: "300x",
    volume: "$25,680,512",
    openInterest: "$13,305,307",
    price: "52.676",
    change: "-5.75%",
    icon: "H",
    iconClass: "bg-bid text-card",
  },
  {
    symbol: "ADAUSDT",
    lev: "75x",
    volume: "$471,387",
    openInterest: "$1,109,120",
    price: "0.1685",
    change: "-1.00%",
    icon: "A",
    iconClass: "bg-chart-3 text-card",
  },
  {
    symbol: "DOTUSDT",
    lev: "50x",
    volume: "$29,862",
    openInterest: "$1,137,305",
    price: "0.759",
    change: "-1.30%",
    icon: "P",
    iconClass: "bg-card text-foreground border border-border",
  },
  {
    symbol: "SANDUSDT",
    lev: "10x",
    volume: "$2,871",
    openInterest: "$2,588",
    price: "0.04198",
    change: "+0.74%",
    up: true,
    icon: "S",
    iconClass: "bg-chart-2 text-card",
  },
];

const tabs = ["Favorites", "Futures", "Spot", "Prediction"];
const filters = ["All markets", "Top", "New", "Meme", "AI", "Pre-launch", "Stocks"];

export function MarketSelector({
  open,
  onClose,
  onSelect,
  current = "BTCUSDT",
}: {
  open: boolean;
  onClose: () => void;
  onSelect?: (symbol: string) => void;
  current?: string;
}) {
  const [tab, setTab] = useState("Futures");
  const [filter, setFilter] = useState("All markets");
  const [query, setQuery] = useState("");

  if (!open) return null;

  const rows = markets.filter((m) => m.symbol.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background">
      <div className="flex items-center justify-between px-4 pb-2 pt-4">
        <span className="text-[13px] uppercase tracking-wide text-muted-foreground">Select market</span>
        <button aria-label="Close market selector" onClick={onClose}>
          <X className="size-5 text-muted-foreground" />
        </button>
      </div>

      <div className="px-4">
        <div className="flex items-center gap-2 rounded-xl bg-card px-3 py-2">
          <Search className="size-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search"
            className="w-full bg-transparent text-[13px] outline-none placeholder:text-muted-foreground"
          />
        </div>
      </div>

      <div className="mt-3 flex items-center gap-5 overflow-x-auto border-b border-border px-4">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`whitespace-nowrap pb-2 text-[13.5px] ${
              tab === t
                ? "border-b-2 border-primary font-medium text-foreground"
                : "text-muted-foreground"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="no-scrollbar flex items-center gap-1.5 overflow-x-auto px-4 py-2">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`whitespace-nowrap rounded-lg px-2.5 py-1.5 text-[12px] ${
              filter === f ? "bg-secondary font-medium text-foreground" : "text-muted-foreground"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-[1.1fr_1fr_0.9fr] items-start px-4 pb-1.5 text-[11.5px] leading-tight text-muted-foreground">
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

      <div className="flex-1 overflow-y-auto pb-6">
        {rows.map((m) => (
          <button
            key={m.symbol}
            onClick={() => {
              onSelect?.(m.symbol);
              onClose();
            }}
            className={`grid w-full grid-cols-[1.1fr_1fr_0.9fr] items-center px-4 py-2 text-left ${
              m.symbol === current ? "bg-card" : ""
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Star
                className={`size-3.5 shrink-0 ${
                  m.fav ? "fill-primary text-primary" : "text-muted-foreground"
                }`}
              />
              <span
                className={`flex size-5 shrink-0 items-center justify-center rounded-full text-[9px] font-bold ${m.iconClass}`}
              >
                {m.icon}
              </span>
              <span className="min-w-0">
                <span className="block truncate text-[13px] leading-tight">{m.symbol}</span>
                <span className="mt-0.5 inline-block rounded bg-secondary px-1 py-px text-[10px] leading-tight text-muted-foreground">
                  {m.lev}
                </span>
              </span>
            </span>
            <span className="text-right">
              <span className="block text-[12.5px] leading-tight tabular-nums">{m.volume}</span>
              <span className="block text-[12.5px] leading-tight tabular-nums text-muted-foreground">
                {m.openInterest}
              </span>
            </span>
            <span className="text-right">
              <span className="block text-[12.5px] leading-tight tabular-nums">{m.price}</span>
              <span
                className={`block text-[12.5px] leading-tight tabular-nums ${m.up ? "text-bid" : "text-ask"}`}
              >
                {m.change}
              </span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
