import { useState } from "react";
import { ChevronDown, Star } from "lucide-react";

import { MarketSelector } from "./MarketSelector";

const stats = [
  { label: "Mark", value: "61,207.5", underline: false },
  { label: "Index", value: "61,241.4", underline: false },
  { label: "Funding(8h)/Countdown", value: "-0.0024% / 01:52:56", underline: true },
  { label: "24h Volume (USDT)", value: "1,002,644,028.04", underline: false },
  { label: "Open Interest (USDT)", value: "686,241,882.31", underline: false },
  { label: "24h High", value: "62,817.6", underline: false },
  { label: "24h Low", value: "60,705.4", underline: false },
];

export function MarketBar() {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative flex h-[62px] items-center gap-[36px] bg-background px-4">
      <div className="flex shrink-0 items-center gap-3">
        <div className="grid h-8 w-8 place-items-center rounded-full bg-gold [background-image:var(--gradient-gold)] text-[15px] font-bold text-primary-foreground">
          ₿
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[22px] font-semibold">BTCUSDT</span>
            <span className="rounded bg-panel-2 px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground">
              Perp
            </span>
            <button
              aria-label="Open market list"
              onClick={() => setOpen((v) => !v)}
              className="grid h-5 w-5 place-items-center"
            >
              <ChevronDown className="h-4 w-4 opacity-60" />
            </button>
          </div>
          <div className="tabular-nums tracking-tight text-[15px] font-medium text-down">61,203.6 -0.70%</div>
        </div>
      </div>

      <div className="flex min-w-0 flex-1 items-center gap-[42px] overflow-hidden">
        {stats.map((s) => (
          <div key={s.label} className="min-w-0 shrink-0">
            <div
              className={`text-[13px] text-muted-foreground ${
                s.underline ? "underline decoration-dotted underline-offset-4" : ""
              }`}
            >
              {s.label}
            </div>
            <div className="mt-1.5 tabular-nums tracking-tight text-[15px]">{s.value}</div>
          </div>
        ))}
      </div>

      <button className="grid h-8 w-8 shrink-0 place-items-center rounded-md border border-border bg-panel">
        <Star className="h-4 w-4 text-muted-foreground" />
      </button>

      {open && <MarketSelector onClose={() => setOpen(false)} />}
    </div>
  );
}