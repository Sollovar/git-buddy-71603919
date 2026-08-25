import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  init,
  dispose,
  getSupportedIndicators,
  getSupportedOverlays,
  type Chart,
  type CandleType,
  type Period,
  type DeepPartial,
  type Styles,
} from "klinecharts";
import {
  Camera,
  CandlestickChart,
  Check,
  ChevronDown,
  Eraser,
  Expand,
  LineChart,
  Lock,
  Magnet,
  Minimize2,
  MousePointer2,
  PenLine,
  Search,
  SlidersHorizontal,
  Unlock,
} from "lucide-react";

import { fetchCandles, subscribeCandles, type Interval } from "@/lib/market-data";
import { useSource, SOURCE_LABELS, type MarketSource } from "@/hooks/use-source";
import { useTheme } from "@/hooks/use-theme";
import { CandleCountdown } from "@/components/CandleCountdown";

/* ------------------------------ config ------------------------------ */

const INTERVALS: { label: string; value: Interval; period: Period }[] = [
  { label: "1m", value: "1m", period: { type: "minute", span: 1 } },
  { label: "3m", value: "3m", period: { type: "minute", span: 3 } },
  { label: "5m", value: "5m", period: { type: "minute", span: 5 } },
  { label: "15m", value: "15m", period: { type: "minute", span: 15 } },
  { label: "30m", value: "30m", period: { type: "minute", span: 30 } },
  { label: "1H", value: "1h", period: { type: "hour", span: 1 } },
  { label: "2H", value: "2h", period: { type: "hour", span: 2 } },
  { label: "4H", value: "4h", period: { type: "hour", span: 4 } },
  { label: "6H", value: "6h", period: { type: "hour", span: 6 } },
  { label: "12H", value: "12h", period: { type: "hour", span: 12 } },
  { label: "1D", value: "1d", period: { type: "day", span: 1 } },
  { label: "3D", value: "3d", period: { type: "day", span: 3 } },
  { label: "1W", value: "1w", period: { type: "week", span: 1 } },
  { label: "1M", value: "1M", period: { type: "month", span: 1 } },
];

const QUICK: Interval[] = ["5m", "15m", "1h", "4h", "1d", "1w"];

const CHART_TYPES: { label: string; value: CandleType }[] = [
  { label: "Candles", value: "candle_solid" },
  { label: "Hollow candles", value: "candle_stroke" },
  { label: "Bars (OHLC)", value: "ohlc" },
  { label: "Area", value: "area" },
];

/** Indicators that render on top of the candles. Everything else gets its own pane. */
const MAIN_INDICATORS = new Set(["MA", "EMA", "SMA", "BOLL", "SAR", "BBI"]);

/** Every indicator the library ships with — nothing hand-rolled. */
const ALL_INDICATORS = getSupportedIndicators()
  .map((name) => ({ name, kind: MAIN_INDICATORS.has(name) ? "main" : "sub" }) as const)
  .sort((a, b) => a.name.localeCompare(b.name));

/** Every drawing tool the library ships with. */
const ALL_OVERLAYS = getSupportedOverlays().filter(
  (n) => !["simpleAnnotation", "simpleTag"].includes(n),
);

function humanize(name: string) {
  return name
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (c) => c.toUpperCase())
    .trim();
}

/* ------------------------------ theming ------------------------------ */

function readTheme(el: HTMLElement) {
  const cs = getComputedStyle(el);
  const v = (name: string, fallback: string) => cs.getPropertyValue(name).trim() || fallback;
  return {
    up: v("--up", "#16a34a"),
    down: v("--down", "#dc2626"),
    text: v("--foreground", "#111"),
    muted: v("--muted-foreground", "#888"),
    grid: v("--border", "#e5e5e5"),
    card: v("--card", "#fff"),
  };
}

function buildStyles(t: ReturnType<typeof readTheme>, candleType: CandleType): DeepPartial<Styles> {
  const axis = {
    show: true,
    axisLine: { show: true, color: t.grid, size: 1 },
    tickLine: { show: true, color: t.grid, size: 1, length: 3 },
    tickText: { show: true, color: t.muted, size: 11, weight: "normal", family: "inherit" },
  };
  return {
    grid: {
      show: true,
      horizontal: { show: true, size: 1, color: t.grid, style: "dashed", dashedValue: [2, 4] },
      vertical: { show: true, size: 1, color: t.grid, style: "dashed", dashedValue: [2, 4] },
    },
    candle: {
      type: candleType,
      bar: {
        upColor: t.up,
        downColor: t.down,
        noChangeColor: t.muted,
        upBorderColor: t.up,
        downBorderColor: t.down,
        noChangeBorderColor: t.muted,
        upWickColor: t.up,
        downWickColor: t.down,
        noChangeWickColor: t.muted,
      },
      priceMark: {
        high: { color: t.muted, textSize: 11 },
        low: { color: t.muted, textSize: 11 },
        last: {
          show: true,
          line: { show: true, style: "dashed", dashedValue: [4, 4], size: 1 },
          text: { size: 11, paddingLeft: 4, paddingRight: 4, borderRadius: 3 },
        },
      },
      tooltip: {
        offsetTop: 6,
        title: { show: true, color: t.muted, size: 12 },
        legend: { color: t.text, size: 12 },
        rect: { color: "transparent", borderColor: "transparent", paddingLeft: 0 },
      },
    },
    indicator: {
      tooltip: { title: { color: t.muted, size: 11 }, legend: { color: t.text, size: 11 } },
      lastValueMark: { show: false },
    },
    xAxis: axis,
    yAxis: axis,
    crosshair: {
      horizontal: {
        line: { color: t.muted, style: "dashed", dashedValue: [4, 3], size: 1 },
        text: { backgroundColor: t.text, color: t.card, size: 11, borderRadius: 3 },
      },
      vertical: {
        line: { color: t.muted, style: "dashed", dashedValue: [4, 3], size: 1 },
        text: { backgroundColor: t.text, color: t.card, size: 11, borderRadius: 3 },
      },
    },
    separator: { size: 1, color: t.grid },
  };
}

/* ------------------------------ component ------------------------------ */

export default function DexKLineChart({ symbol }: { symbol: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<Chart | null>(null);

  const [interval, setIntervalValue] = useState<Interval>("1d");
  const [candleType, setCandleType] = useState<CandleType>("candle_solid");
  const [source, setSource] = useSource();
  const { theme } = useTheme();

  const [menu, setMenu] = useState<null | "interval" | "type" | "indicators" | "tools">(null);
  const [mainOn, setMainOn] = useState<string[]>(["MA"]);
  const [subOn, setSubOn] = useState<string[]>(["VOL"]);
  const [tool, setTool] = useState<string | null>(null);
  const [magnet, setMagnet] = useState(false);
  const [locked, setLocked] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const active = useMemo(
    () => INTERVALS.find((i) => i.value === interval) ?? INTERVALS[10]!,
    [interval],
  );

  const shownIndicators = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? ALL_INDICATORS.filter((i) => i.name.toLowerCase().includes(q)) : ALL_INDICATORS;
  }, [query]);

  /* create once */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const chart = init(el, {
      styles: buildStyles(readTheme(el), "candle_solid"),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    });
    chartRef.current = chart;
    chart?.createIndicator({ name: "MA", paneId: "candle_pane" }, true);
    chart?.createIndicator({ name: "VOL", paneId: "vol_pane" }, false);
    chart?.setPaneOptions({ id: "vol_pane", height: 110 });

    const onResize = () => chart?.resize();
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      chartRef.current = null;
      dispose(el);
    };
  }, []);

  /* restyle */
  useEffect(() => {
    const el = containerRef.current;
    if (!el || !chartRef.current) return;
    chartRef.current.setStyles(buildStyles(readTheme(el), candleType));
  }, [candleType, theme]);

  /* data wiring */
  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;
    let unsubscribe: (() => void) | null = null;
    setLoading(true);
    setError(null);

    chart.setDataLoader({
      getBars: async ({ type, timestamp, callback }) => {
        try {
          const range =
            type === "forward" && timestamp
              ? { endTime: timestamp - 1 }
              : type === "backward" && timestamp
                ? { startTime: timestamp + 1 }
                : {};
          const { candles, pricePrecision } = await fetchCandles(symbol, interval, {
            limit: 500,
            source,
            ...range,
          });
          if (type === "init") {
            chart.setSymbol({ ticker: symbol, pricePrecision, volumePrecision: 2 });
            setLoading(false);
          }
          callback(candles, type === "init" ? true : candles.length >= 500);
        } catch (e) {
          setLoading(false);
          setError(e instanceof Error ? e.message : "Unable to load market data");
          callback([], false);
        }
      },
      subscribeBar: ({ callback }) => {
        unsubscribe?.();
        unsubscribe = subscribeCandles(symbol, interval, callback, source);
      },
      unsubscribeBar: () => {
        unsubscribe?.();
        unsubscribe = null;
      },
    });

    chart.setSymbol({ ticker: symbol, pricePrecision: 2, volumePrecision: 2 });
    chart.setPeriod(active.period);
    chart.setOffsetRightDistance(60);
    chart.setBarSpace(8);
    requestAnimationFrame(() => chart.scrollToRealTime(0));

    return () => {
      unsubscribe?.();
    };
  }, [symbol, interval, active.period, source]);

  /* fullscreen */
  useEffect(() => {
    const onChange = () => {
      setFullscreen(Boolean(document.fullscreenElement));
      requestAnimationFrame(() => chartRef.current?.resize());
    };
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void wrapperRef.current?.requestFullscreen?.();
  }, []);

  const screenshot = useCallback(() => {
    const chart = chartRef.current;
    const el = containerRef.current;
    if (!chart || !el) return;
    const bg = getComputedStyle(el).getPropertyValue("--card").trim() || "#ffffff";
    const a = document.createElement("a");
    a.href = chart.getConvertPictureUrl(true, "png", bg);
    a.download = `${symbol}-${interval}.png`;
    a.click();
  }, [symbol, interval]);

  const toggleIndicator = (name: string, kind: "main" | "sub") => {
    const chart = chartRef.current;
    if (!chart) return;
    if (kind === "main") {
      if (mainOn.includes(name)) {
        chart.removeIndicator({ paneId: "candle_pane", name });
        setMainOn((s) => s.filter((n) => n !== name));
      } else {
        chart.createIndicator({ name, paneId: "candle_pane" }, true);
        setMainOn((s) => [...s, name]);
      }
      return;
    }
    const paneId = `${name.toLowerCase()}_pane`;
    if (subOn.includes(name)) {
      chart.removeIndicator({ paneId, name });
      setSubOn((s) => s.filter((n) => n !== name));
    } else {
      chart.createIndicator({ name, paneId }, false);
      chart.setPaneOptions({ id: paneId, height: 100 });
      setSubOn((s) => [...s, name]);
    }
  };

  const startDrawing = (name: string) => {
    const chart = chartRef.current;
    if (!chart) return;
    setTool(name);
    setMenu(null);
    chart.createOverlay({
      name,
      lock: locked,
      mode: magnet ? "weak_magnet" : "normal",
      onRemoved: () => setTool(null),
      onDrawEnd: () => {
        setTool(null);
        return false;
      },
    });
  };

  const clearDrawings = () => {
    chartRef.current?.removeOverlay({});
    setTool(null);
  };

  const iconBtn =
    "grid h-8 w-8 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground";
  const activeBtn = "bg-accent text-foreground";

  return (
    <section
      ref={wrapperRef}
      className="flex min-w-0 flex-1 flex-col bg-background"
      onClick={() => setMenu(null)}
    >
      {/* top toolbar */}
      <div className="relative flex h-[42px] shrink-0 items-center gap-1 border-b border-border px-2 text-[13px]">
        {QUICK.map((v) => {
          const item = INTERVALS.find((i) => i.value === v)!;
          return (
            <button
              key={v}
              onClick={() => setIntervalValue(v)}
              className={`rounded-md px-2 py-1 font-medium transition-colors ${
                interval === v
                  ? "bg-[color-mix(in_oklab,var(--gold)_28%,transparent)] text-gold-strong"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {item.label}
            </button>
          );
        })}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setMenu(menu === "interval" ? null : "interval");
          }}
          className="flex items-center gap-0.5 rounded-md px-1.5 py-1 text-muted-foreground hover:text-foreground"
        >
          {QUICK.includes(interval) ? "" : active.label}
          <ChevronDown className="h-3.5 w-3.5" />
        </button>

        <span className="mx-1 h-4 w-px bg-border" />

        <button
          onClick={(e) => {
            e.stopPropagation();
            setMenu(menu === "type" ? null : "type");
          }}
          className={iconBtn}
          aria-label="Chart type"
        >
          {candleType === "area" ? (
            <LineChart className="h-[18px] w-[18px]" />
          ) : (
            <CandlestickChart className="h-[18px] w-[18px]" />
          )}
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setMenu(menu === "indicators" ? null : "indicators");
          }}
          className={`${iconBtn} ${menu === "indicators" ? activeBtn : ""}`}
          aria-label="Indicators"
        >
          <SlidersHorizontal className="h-[18px] w-[18px]" />
        </button>
        <button onClick={screenshot} className={iconBtn} aria-label="Save screenshot">
          <Camera className="h-[18px] w-[18px]" />
        </button>

        <div className="ml-auto flex items-center gap-2">
          <div className="flex rounded-full bg-secondary p-0.5">
            {(["aster", "kucoin"] as MarketSource[]).map((s) => (
              <button
                key={s}
                onClick={() => setSource(s)}
                className={`rounded-full px-3 py-1 text-[12px] font-medium transition-colors ${
                  source === s ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
                }`}
              >
                {SOURCE_LABELS[s]}
              </button>
            ))}
          </div>
          <button onClick={toggleFullscreen} className={iconBtn} aria-label="Toggle full screen">
            {fullscreen ? (
              <Minimize2 className="h-[18px] w-[18px]" />
            ) : (
              <Expand className="h-[18px] w-[18px]" />
            )}
          </button>
        </div>

        {/* dropdowns */}
        {menu === "interval" && (
          <Dropdown className="left-2 top-[42px] w-[260px]">
            <div className="grid grid-cols-4 gap-1 p-2">
              {INTERVALS.map((i) => (
                <button
                  key={i.value}
                  onClick={() => {
                    setIntervalValue(i.value);
                    setMenu(null);
                  }}
                  className={`rounded-md px-2 py-1.5 text-[12.5px] ${
                    interval === i.value
                      ? "bg-[color-mix(in_oklab,var(--gold)_28%,transparent)] font-semibold text-gold-strong"
                      : "text-muted-foreground hover:bg-panel-2 hover:text-foreground"
                  }`}
                >
                  {i.label}
                </button>
              ))}
            </div>
          </Dropdown>
        )}

        {menu === "type" && (
          <Dropdown className="left-2 top-[42px] w-[200px]">
            {CHART_TYPES.map((c) => (
              <button
                key={c.value}
                onClick={() => {
                  setCandleType(c.value);
                  setMenu(null);
                }}
                className="flex w-full items-center justify-between px-3 py-2 text-left text-[13px] transition-colors hover:bg-panel-2 hover:text-foreground"
              >
                {c.label}
                {candleType === c.value && <Check className="h-4 w-4 text-gold-strong" />}
              </button>
            ))}
          </Dropdown>
        )}

        {menu === "indicators" && (
          <Dropdown className="left-2 top-[42px] flex w-[280px] flex-col">
            <label className="mx-2 mb-1 flex items-center gap-2 rounded-lg bg-panel-2 px-2.5 py-1.5">
              <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search indicators"
                className="min-w-0 flex-1 bg-transparent text-[13px] outline-none"
              />
            </label>
            <div className="max-h-[320px] overflow-y-auto py-1">
              {shownIndicators.map((ind) => {
                const on =
                  ind.kind === "main" ? mainOn.includes(ind.name) : subOn.includes(ind.name);
                return (
                  <button
                    key={ind.name}
                    onClick={() => toggleIndicator(ind.name, ind.kind)}
                    className="flex w-full items-center justify-between px-3 py-1.5 text-left text-[13px] transition-colors hover:bg-panel-2 hover:text-foreground"
                  >
                    <span>
                      {ind.name}
                      <span className="ml-2 text-[11px] text-muted-foreground">
                        {ind.kind === "main" ? "overlay" : "pane"}
                      </span>
                    </span>
                    {on && <Check className="h-4 w-4 text-gold-strong" />}
                  </button>
                );
              })}
            </div>
          </Dropdown>
        )}
      </div>

      <div className="flex min-h-0 flex-1">
        {/* drawing tool rail */}
        <div className="relative flex w-[46px] shrink-0 flex-col items-center gap-1 border-r border-border py-2">
          <button
            onClick={() => setTool(null)}
            className={`${iconBtn} ${tool === null ? activeBtn : ""}`}
            aria-label="Cursor"
          >
            <MousePointer2 className="h-[18px] w-[18px]" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setMenu(menu === "tools" ? null : "tools");
            }}
            className={`${iconBtn} ${menu === "tools" || tool ? activeBtn : ""}`}
            aria-label="Drawing tools"
          >
            <PenLine className="h-[18px] w-[18px]" />
          </button>
          <button
            onClick={() => setMagnet((m) => !m)}
            className={`${iconBtn} ${magnet ? activeBtn : ""}`}
            aria-label="Magnet mode"
          >
            <Magnet className="h-[18px] w-[18px]" />
          </button>
          <button
            onClick={() => setLocked((l) => !l)}
            className={`${iconBtn} ${locked ? activeBtn : ""}`}
            aria-label="Lock drawings"
          >
            {locked ? <Lock className="h-[18px] w-[18px]" /> : <Unlock className="h-[18px] w-[18px]" />}
          </button>
          <button onClick={clearDrawings} className={iconBtn} aria-label="Remove all drawings">
            <Eraser className="h-[18px] w-[18px]" />
          </button>

          {menu === "tools" && (
            <Dropdown className="left-[46px] top-10 max-h-[420px] w-[230px] overflow-y-auto">
              {ALL_OVERLAYS.map((name) => (
                <button
                  key={name}
                  onClick={() => startDrawing(name)}
                  className={`flex w-full items-center justify-between px-3 py-1.5 text-left text-[13px] transition-colors hover:bg-panel-2 hover:text-foreground ${
                    tool === name ? "text-gold-strong" : ""
                  }`}
                >
                  {humanize(name)}
                </button>
              ))}
            </Dropdown>
          )}
        </div>

        {/* chart canvas */}
        <div className="relative min-w-0 flex-1">
          <div ref={containerRef} className="absolute inset-0" />
          <CandleCountdown interval={interval} className="bottom-[26px] right-[62px]" />
          {(loading || error) && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <span className="rounded-md bg-secondary px-3 py-1.5 text-xs text-muted-foreground">
                {error ?? "Loading market data…"}
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function Dropdown({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className={`absolute z-40 rounded-xl border border-border bg-card py-1 text-card-foreground shadow-[var(--shadow-panel)] ring-1 ring-[color-mix(in_oklab,var(--gold)_22%,transparent)] ${className ?? ""}`}
    >
      {children}
    </div>
  );
}
