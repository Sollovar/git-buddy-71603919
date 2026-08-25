import {
  Maximize2,
  ChevronDown,
  Settings,
  SlidersHorizontal,
  ListChecks,
  Columns2,
  Minus,
  TrendingUp,
  Type,
  GitBranch,
  Rows3,
  Smile,
  Ruler,
  Search,
  Magnet,
  Pencil,
  Lock,
  ChevronUp,
} from "lucide-react";

type Candle = { o: number; h: number; l: number; c: number; v: number };

function buildCandles(count: number): Candle[] {
  let seed = 20260610;
  const rand = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
  const out: Candle[] = [];
  let price = 63000;
  for (let i = 0; i < count; i++) {
    const phase = i / count;
    const drift =
      phase < 0.18 ? -280 : phase < 0.62 ? 420 : phase < 0.78 ? 120 : -900;
    const o = price;
    const c = Math.max(58500, o + drift * (0.4 + rand()) + (rand() - 0.5) * 900);
    const h = Math.max(o, c) + rand() * 700;
    const l = Math.min(o, c) - rand() * 700;
    out.push({ o, h, l, c, v: 8000 + rand() * 32000 });
    price = c;
  }
  return out;
}

function sma(values: number[], period: number) {
  return values.map((_, i) => {
    if (i < period - 1) return null;
    let sum = 0;
    for (let k = i - period + 1; k <= i; k++) sum += values[k] ?? 0;
    return sum / period;
  });
}

const CANDLES = buildCandles(120);
const CLOSES = CANDLES.map((c) => c.c);
const MA7 = sma(CLOSES, 7);
const MA30 = sma(CLOSES, 30);
const MA99 = sma(CLOSES, 60);

const W = 1000;
const H = 470;
const VH = 150;
const PAD_R = 74;
const plotW = W - PAD_R;
const step = plotW / CANDLES.length;

const hi = Math.max(...CANDLES.map((c) => c.h));
const lo = Math.min(...CANDLES.map((c) => c.l));
const y = (p: number) => H - ((p - lo) / (hi - lo)) * (H - 20) - 10;
const maxVol = Math.max(...CANDLES.map((c) => c.v));
const vy = (v: number) => VH - (v / maxVol) * (VH - 16);

function linePath(series: (number | null)[]) {
  let d = "";
  series.forEach((val, i) => {
    if (val == null) return;
    const px = i * step + step / 2;
    d += `${d ? "L" : "M"}${px.toFixed(1)},${y(val).toFixed(1)}`;
  });
  return d;
}

const priceTicks = [84000, 80000, 76000, 72000, 68000, 64000];
const tools = [
  Minus, TrendingUp, Rows3, Pencil, Type, GitBranch, SlidersHorizontal,
  Smile, Ruler, Search, Magnet, ListChecks, Lock,
];
const intervals = ["5m", "15m", "1H", "4H", "1D", "1W"];

export function ChartPanel() {
  return (
    <section className="flex min-w-0 flex-1 flex-col bg-background">
      <div className="flex h-[42px] items-center gap-4 border-b border-border px-3 text-[13px]">
        {intervals.map((i) => (
          <button
            key={i}
            className={
              i === "1D"
                ? "font-semibold text-gold-strong"
                : "text-muted-foreground hover:text-foreground"
            }
          >
            {i}
          </button>
        ))}
        <ChevronDown className="h-3.5 w-3.5 opacity-60" />
        <span className="mx-1 h-4 w-px bg-border" />
        <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
        <Columns2 className="h-4 w-4 text-muted-foreground" />
        <ListChecks className="h-4 w-4 text-muted-foreground" />
        <Settings className="h-4 w-4 text-muted-foreground" />
        <button className="ml-1 flex items-center gap-1 text-muted-foreground">
          Last Price <ChevronDown className="h-3.5 w-3.5" />
        </button>
        <div className="ml-auto flex items-center gap-4">
          <span className="font-semibold">Chart</span>
          <span className="text-muted-foreground">Depth</span>
          <span className="text-muted-foreground">Details</span>
          <Maximize2 className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>

      <div className="flex min-h-0 flex-1">
        <div className="flex w-[46px] shrink-0 flex-col items-center gap-4 border-r border-border py-3">
          {tools.map((Icon, i) => (
            <Icon key={i} className="h-[18px] w-[18px] text-muted-foreground" />
          ))}
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="relative min-h-0 flex-1">
          <div className="pointer-events-none absolute left-3 top-2 z-10 space-y-1.5 tabular-nums tracking-tight text-[14.5px]">
            <div>
              <span className="text-muted-foreground">O</span>
              <span className="text-up">61697.8</span>{" "}
              <span className="text-muted-foreground">H</span>
              <span className="text-up">62817.6</span>{" "}
              <span className="text-muted-foreground">L</span>
              <span className="text-down">60705.4</span>{" "}
              <span className="text-muted-foreground">C</span>
              <span className="text-down">61203.6 -494.2 (-0.80%)</span>
            </div>
            <div className="text-muted-foreground">
              MA 7 close 0 SMA 9 <span className="text-[oklch(0.55_0.16_300)]">62140.6</span>
            </div>
            <div className="text-muted-foreground">
              MA 30 close 0 SMA 9 <span className="text-gold-strong">72427.8</span>
            </div>
            <div className="text-muted-foreground">
              MA 99 close 0 SMA 9 <span className="text-[oklch(0.6_0.12_240)]">72891.9</span>
            </div>
          </div>

          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="absolute inset-0 h-full w-full"
            preserveAspectRatio="none"
          >
            {priceTicks.map((p) => (
              <line
                key={p}
                x1="0"
                x2={plotW}
                y1={y(p)}
                y2={y(p)}
                stroke="var(--border)"
                strokeDasharray="2 4"
              />
            ))}
            {CANDLES.map((c, i) => {
              const x = i * step + step / 2;
              const up = c.c >= c.o;
              const color = up ? "var(--up)" : "var(--down)";
              return (
                <g key={i}>
                  <line x1={x} x2={x} y1={y(c.h)} y2={y(c.l)} stroke={color} strokeWidth="1" />
                  <rect
                    x={x - step * 0.32}
                    width={step * 0.64}
                    y={y(Math.max(c.o, c.c))}
                    height={Math.max(1, Math.abs(y(c.o) - y(c.c)))}
                    fill={color}
                  />
                </g>
              );
            })}
            <path d={linePath(MA7)} fill="none" stroke="oklch(0.55 0.16 300)" strokeWidth="1.6" />
            <path d={linePath(MA30)} fill="none" stroke="var(--gold-strong)" strokeWidth="1.6" />
            <path d={linePath(MA99)} fill="none" stroke="oklch(0.6 0.12 240)" strokeWidth="1.6" />
          </svg>

          <div className="pointer-events-none absolute right-0 top-0 h-full w-[74px] tabular-nums tracking-tight text-[11.5px] text-muted-foreground">
            {[82810.3, 84000, 80000, 76000, 72000, 68000, 64000, 59101].map((p, i) => (
              <div
                key={p}
                className="absolute left-1"
                style={{ top: `${(y(p) / H) * 100}%`, transform: "translateY(-50%)" }}
              >
                {i === 0 || i === 7 ? (
                  <span className="rounded-sm bg-down px-1.5 py-0.5 text-destructive-foreground">
                    {p.toFixed(1)}
                  </span>
                ) : (
                  p.toFixed(1)
                )}
              </div>
            ))}
            <div
              className="absolute left-1 rounded-sm bg-down px-1.5 py-0.5 text-destructive-foreground"
              style={{ top: `${(y(61203.6) / H) * 100}%`, transform: "translateY(-50%)" }}
            >
              61203.6
            </div>
          </div>

          <button className="absolute left-3 top-[128px] grid h-6 w-8 place-items-center rounded border border-border bg-panel">
            <ChevronUp className="h-3.5 w-3.5 text-muted-foreground" />
          </button>
          </div>

          <div className="relative h-[24%] min-h-[90px] shrink-0 border-t border-border">
            <div className="absolute left-3 top-2 z-10 tabular-nums tracking-tight text-[12.5px] text-muted-foreground">
              Volume SMA 9 <span className="text-down">15.721K</span>
            </div>
            <svg
              viewBox={`0 0 ${W} ${VH}`}
              className="absolute inset-0 h-full w-full"
              preserveAspectRatio="none"
            >
              {CANDLES.map((c, i) => {
                const x = i * step + step / 2;
                const up = c.c >= c.o;
                return (
                  <rect
                    key={i}
                    x={x - step * 0.32}
                    width={step * 0.64}
                    y={vy(c.v)}
                    height={VH - vy(c.v)}
                    fill={up ? "var(--up)" : "var(--down)"}
                    opacity="0.85"
                  />
                );
              })}
            </svg>
            <div className="pointer-events-none absolute right-0 top-0 h-full w-[74px] tabular-nums tracking-tight text-[11.5px] text-muted-foreground">
              {["40K", "30K", "20K", "10K"].map((t, i) => (
                <div key={t} className="absolute left-1" style={{ top: `${16 + i * 24}%` }}>
                  {t}
                </div>
              ))}
              <div className="absolute left-1 top-[57%] rounded-sm bg-down px-1.5 py-0.5 text-destructive-foreground">
                15.721K
              </div>
            </div>
          </div>

          <div className="flex shrink-0 items-center justify-between border-t border-border px-4 py-2 tabular-nums tracking-tight text-[12px] text-muted-foreground">
            <div className="flex flex-1 justify-around pr-24">
              {["Apr", "15", "May", "15 ", "Jun"].map((m) => (
                <span key={m}>{m.trim()}</span>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <span>15:07:02 (UTC-7)</span>
              <span className="h-3 w-px bg-border" />
              <span>%</span>
              <span>log</span>
              <span className="font-semibold text-foreground">auto</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}