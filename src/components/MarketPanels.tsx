import { ChevronDown, LayoutList } from "lucide-react";
import { useMemo, useState } from "react";
import { usePair } from "@/hooks/use-pair";
import { getTickOptions } from "@/lib/tick-size";
import { TickSizeSheet } from "@/components/TickSizeSheet";

/* ---------------- Order Book ---------------- */

const bidRows: [string, string, number][] = [
  ["167.34K", "64,838.1", 167.34],
  ["262.85K", "64,837.9", 262.85],
  ["282.95K", "64,837.2", 282.95],
  ["473.44K", "64,836.8", 473.44],
  ["498.40K", "64,836.6", 498.4],
  ["523.36K", "64,836.5", 523.36],
  ["543.46K", "64,835.9", 543.46],
  ["600.32K", "64,835.2", 600.32],
  ["620.42K", "64,835.0", 620.42],
  ["790.80K", "64,832.9", 790.8],
  ["813.62K", "64,831.5", 813.62],
  ["814.27K", "64,831.4", 814.27],
  ["886.23K", "64,830.9", 886.23],
  ["890.84K", "64,828.9", 890.84],
];

const askRows: [string, string, number][] = [
  ["64,838.2", "35.33K", 35.33],
  ["64,839.8", "36.30K", 36.3],
  ["64,840.8", "57.31K", 57.31],
  ["64,840.9", "77.02K", 77.02],
  ["64,841.0", "101.99K", 101.99],
  ["64,841.1", "126.95K", 126.95],
  ["64,841.6", "147.31K", 147.31],
  ["64,841.7", "196.72K", 196.72],
  ["64,841.8", "228.30K", 228.3],
  ["64,842.2", "435.73K", 435.73],
  ["64,843.3", "970.69K", 970.69],
  ["64,843.8", "1.16M", 1160],
  ["64,845.2", "1.19M", 1190],
  ["64,845.3", "1.21M", 1210],
];

const MAX = 1210;

export function OrderBookPanel() {
  const [pair] = usePair();
  const [tickIndex, setTickIndex] = useState(0);
  const [tickOpen, setTickOpen] = useState(false);
  const tickOptions = useMemo(() => getTickOptions(pair), [pair]);
  const tick = tickOptions[tickIndex] ?? tickOptions[0]!;

  return (
    <div className="mt-3">
      <TickSizeSheet
        open={tickOpen}
        options={tickOptions}
        current={tick}
        onSelect={(t) => setTickIndex(Math.max(0, tickOptions.indexOf(t)))}
        onClose={() => setTickOpen(false)}
      />
      <div className="flex items-center justify-between">
        <LayoutList className="size-5 text-muted-foreground" />
        <div className="flex items-center gap-4 text-sm">
          <button className="flex items-center gap-1" onClick={() => setTickOpen(true)}>
            {tick} <ChevronDown className="size-4 text-muted-foreground" />
          </button>
          <button className="flex items-center gap-1">
            USDT <ChevronDown className="size-4 text-muted-foreground" />
          </button>
        </div>
      </div>


      <div className="mt-3 grid grid-cols-2 gap-x-2 text-[11px] text-muted-foreground">
        <div className="flex justify-between">
          <span>Total (USDT)</span>
          <span>Price (USDT)</span>
        </div>
        <div className="flex justify-between">
          <span>Price (USDT)</span>
          <span>Total (USDT)</span>
        </div>
      </div>

      <div className="mt-1 grid grid-cols-2 gap-x-2">
        <div className="space-y-[3px]">
          {bidRows.map(([total, price, v]) => (
            <div
              key={price}
              className="relative flex items-center justify-between overflow-hidden rounded-[3px] py-[3px] text-[13px]"
            >
              <span
                className="absolute inset-y-0 right-0 bg-bid-fill"
                style={{ width: `${(v / MAX) * 100}%` }}
              />
              <span className="relative">{total}</span>
              <span className="relative text-bid">{price}</span>
            </div>
          ))}
        </div>
        <div className="space-y-[3px]">
          {askRows.map(([price, total, v]) => (
            <div
              key={price}
              className="relative flex items-center justify-between overflow-hidden rounded-[3px] py-[3px] text-[13px]"
            >
              <span
                className="absolute inset-y-0 left-0 bg-ask-fill"
                style={{ width: `${(v / MAX) * 100}%` }}
              />
              <span className="relative text-ask">{price}</span>
              <span className="relative">{total}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------- Trades ---------------- */

const trades: [string, string, string, "ask" | "bid"][] = [
  ["64,831.5", "3047.1", "18:10:39", "ask"],
  ["64,831.6", "259.4", "18:10:39", "bid"],
  ["64,831.5", "2398.8", "18:10:37", "bid"],
  ["64,831.6", "129.7", "18:10:37", "bid"],
  ["64,831.5", "2723.0", "18:10:35", "ask"],
  ["64,831.5", "2658.1", "18:10:33", "bid"],
  ["64,841.5", "129.7", "18:10:32", "bid"],
  ["64,841.4", "2593.7", "18:10:30", "ask"],
  ["64,843.8", "2399.3", "18:10:27", "bid"],
  ["64,843.9", "129.7", "18:10:27", "bid"],
  ["64,835.0", "1296.7", "18:10:23", "bid"],
  ["64,835.0", "1037.4", "18:10:22", "bid"],
  ["64,835.1", "129.7", "18:10:22", "bid"],
];

export function TradesPanel() {
  return (
    <div className="mt-3">
      <div className="flex items-center justify-between text-[13px] text-muted-foreground">
        <span>Price(USDT)</span>
        <span>Size(USDT)</span>
        <span>Time</span>
      </div>
      <div className="mt-2 space-y-[7px] text-[13px]">
        {trades.map(([price, size, time, side], i) => (
          <div key={i} className="flex items-center justify-between">
            <span className={side === "ask" ? "text-ask" : "text-bid"}>{price}</span>
            <span>{size}</span>
            <span>{time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Depth ---------------- */

const bidCurve = [
  0, 3, 8, 13, 17, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 28, 29, 29, 30, 30, 30,
];
const askCurve = [
  0, 4, 9, 14, 18, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 29, 30, 30, 31, 31, 32,
];

function buildPath(curve: number[], side: "bid" | "ask", W: number, H: number) {
  const half = W / 2;
  const scale = (v: number) => H - (v / 50) * H;
  const pts = curve.map((v, i) => {
    const t = i / (curve.length - 1);
    const x = side === "bid" ? half - t * half : half + t * half;
    return [x, scale(v)] as const;
  });
  const ordered = (side === "bid" ? [...pts].reverse() : pts) as ReadonlyArray<readonly [number, number]>;
  const first = ordered[0]!;
  let d = `M ${first[0]} ${first[1]}`;
  for (let i = 1; i < ordered.length; i++) {
    const cur = ordered[i]!;
    const prev = ordered[i - 1]!;
    d += ` L ${cur[0]} ${prev[1]} L ${cur[0]} ${cur[1]}`;
  }
  return d;
}

export function DepthPanel() {
  const W = 700;
  const H = 420;
  const yFor = (m: number) => H - (m / 50) * H;
  const bidPath = buildPath(bidCurve, "bid", W, H);
  const askPath = buildPath(askCurve, "ask", W, H);

  return (
    <div className="mt-3">
      <div className="flex">
        <svg viewBox={`0 0 ${W} ${H}`} className="h-72 w-full" preserveAspectRatio="none">
          <path d={`${bidPath} L 0 ${H} Z`} fill="var(--bid-fill)" />
          <path d={bidPath} fill="none" stroke="var(--bid)" strokeWidth="2" />
          <path d={`${askPath} L ${W} ${H} Z`} fill="var(--ask-fill)" />
          <path d={askPath} fill="none" stroke="var(--ask)" strokeWidth="2" />
          <line x1={W / 2} x2={W / 2} y1="0" y2={H} stroke="var(--border)" strokeWidth="1.5" />
        </svg>
        <div className="relative w-14 shrink-0 text-[11px] text-muted-foreground">
          {[50, 40, 30, 20, 10].map((m) => (
            <span
              key={m}
              className="absolute left-0 -translate-y-1/2"
              style={{ top: `${(yFor(m) / H) * 100}%` }}
            >
              - {m}M
            </span>
          ))}
        </div>
      </div>
      <div className="flex pr-14 text-[13px] text-muted-foreground">
        <span className="w-1/3 text-center">63,270.8</span>
        <span className="w-1/3 text-center">64,831.5</span>
        <span className="w-1/3 text-center">66,392.3</span>
      </div>
    </div>
  );
}

/* ---------------- Details ---------------- */

const details: [string, string][] = [
  ["Contract", "BTCUSDT Perpetual"],
  ["Mark price", "64,865.3"],
  ["Index price", "64,867.8"],
  ["24h High", "65,412.0"],
  ["24h Low", "63,270.8"],
  ["24h Vol (USDT)", "695.16M"],
  ["OI (USDT)", "792.63M"],
  ["Funding (8h)", "0.0041%"],
  ["Countdown", "06:49:09"],
];

export function DetailsPanel() {
  return (
    <div className="mt-3 space-y-3 text-[13px]">
      {details.map(([k, v]) => (
        <div key={k} className="flex items-center justify-between">
          <span className="text-muted-foreground">{k}</span>
          <span>{v}</span>
        </div>
      ))}
    </div>
  );
}
