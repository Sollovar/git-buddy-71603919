import { useState } from "react";
import { ChevronDown, ArrowDown, Rows3, AlignLeft, AlignRight } from "lucide-react";

import { TradesList } from "@/components/dex/TradesList";

const asks = [
  ["61,207.3", "175.05K", "284.79K", 47],
  ["61,206.6", "24.97K", "109.73K", 18],
  ["61,205.0", "122.41", "84.76K", 14],
  ["61,204.7", "16.89K", "84.64K", 14],
  ["61,204.6", "6.18K", "67.75K", 11],
  ["61,204.4", "1.04K", "61.57K", 10],
  ["61,203.7", "56.79K", "56.79K", 9],
] as const;

const bids = [
  ["61,195.3", "24.96K", "24.96K", 5],
  ["61,195.2", "673.15", "25.64K", 5],
  ["61,194.4", "673.14", "26.31K", 5],
  ["61,192.1", "9.97K", "36.28K", 7],
  ["61,191.3", "16.88K", "53.17K", 10],
  ["61,189.3", "51.03K", "104.57K", 19],
  ["61,189.1", "79.97K", "184.54K", 33],
] as const;

function Row({
  price,
  size,
  total,
  depth,
  side,
}: {
  price: string;
  size: string;
  total: string;
  depth: number;
  side: "ask" | "bid";
}) {
  return (
    <div className="relative grid grid-cols-3 px-3 py-[7px] tabular-nums tracking-tight text-[13.5px]">
      <div
        className="absolute right-0 top-0 h-full"
        style={{
          width: `${depth}%`,
          background: side === "ask" ? "var(--down-soft)" : "var(--up-soft)",
        }}
      />
      <span className={`relative ${side === "ask" ? "text-down" : "text-up"}`}>{price}</span>
      <span className="relative text-right">{size}</span>
      <span className="relative text-right">{total}</span>
    </div>
  );
}

export function OrderBook() {
  const [tab, setTab] = useState<"book" | "trades">("book");

  return (
    <section className="flex h-full w-[280px] shrink-0 flex-col overflow-hidden bg-background">
      <div className="grid shrink-0 grid-cols-2 border-b border-border">
        <button
          onClick={() => setTab("book")}
          className={
            tab === "book"
              ? "border-b-2 border-gold-strong py-[11px] text-[16px] font-semibold"
              : "py-[11px] text-[16px] text-muted-foreground"
          }
        >
          Order Book
        </button>
        <button
          onClick={() => setTab("trades")}
          className={
            tab === "trades"
              ? "border-b-2 border-gold-strong py-[11px] text-[16px] font-semibold"
              : "py-[11px] text-[16px] text-muted-foreground"
          }
        >
          Trades
        </button>
      </div>

      {tab === "trades" ? (
        <TradesList />
      ) : (
        <>
      <div className="flex items-center gap-2 px-3 py-1.5">
        <Rows3 className="h-[18px] w-[18px] text-gold-strong" />
        <AlignLeft className="h-[18px] w-[18px] text-muted-foreground" />
        <AlignRight className="h-[18px] w-[18px] text-muted-foreground" />
        <div className="ml-auto flex items-center gap-4 text-[13px]">
          <button className="flex items-center gap-1">
            0.1 <ChevronDown className="h-3.5 w-3.5 opacity-60" />
          </button>
          <button className="flex items-center gap-1">
            USDT <ChevronDown className="h-3.5 w-3.5 opacity-60" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 px-3 pb-1 text-[12.5px] text-muted-foreground">
        <span>Price (USDT)</span>
        <span className="text-right">Size (USDT)</span>
        <span className="text-right">Total (USDT)</span>
      </div>

      <div>
        {asks.map((r) => (
          <Row key={r[0]} price={r[0]} size={r[1]} total={r[2]} depth={r[3]} side="ask" />
        ))}
      </div>

      <div className="flex items-center gap-2 px-3 py-2">
        <span className="tabular-nums tracking-tight text-[21px] font-semibold text-down">61,203.6</span>
        <ArrowDown className="h-4 w-4 text-down" />
        <span className="tabular-nums tracking-tight text-[15px] text-muted-foreground">61,207.5</span>
      </div>

      <div>
        {bids.map((r) => (
          <Row key={r[0]} price={r[0]} size={r[1]} total={r[2]} depth={r[3]} side="bid" />
        ))}
      </div>
        </>
      )}
    </section>
  );
}