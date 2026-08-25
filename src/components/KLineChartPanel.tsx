import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  init,
  dispose,
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
  Crosshair,
  Expand,
  LineChart,
  Minimize2,
  Search,
  SlidersHorizontal,
  Star,
  X,
} from "lucide-react";

import { fetchCandles, subscribeCandles, type Interval } from "@/lib/market-data";
import { useSource, SOURCE_LABELS, type MarketSource } from "@/hooks/use-source";
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

const QUICK = ["5m", "15m", "1h", "4h", "1d"] as Interval[];

const MAIN_INDICATORS = ["MA", "EMA", "SMA", "BOLL", "SAR", "BBI"];
const SUB_INDICATORS = [
  "VOL",
  "MACD",
  "KDJ",
  "RSI",
  "StochRSI",
  "CCI",
  "WR",
  "OBV",
  "DMI",
  "TRIX",
  "MTM",
  "ROC",
  "PSY",
  "AO",
  "BIAS",
  "VR",
];

/* full names for the searchable indicator list */
const INDICATOR_LABELS: Record<string, string> = {
  MA: "Moving Average",
  EMA: "Exponential Moving Average",
  SMA: "Smoothed Moving Average",
  BOLL: "Bollinger Bands",
  SAR: "Parabolic SAR",
  BBI: "Bull & Bear Index",
  VOL: "Volume",
  MACD: "MACD",
  KDJ: "Stochastic KDJ",
  RSI: "Relative Strength Index",
  StochRSI: "Stochastic RSI",
  CCI: "Commodity Channel Index",
  WR: "Williams %R",
  OBV: "On Balance Volume",
  DMI: "Directional Movement Index",
  TRIX: "Triple Exponential Average",
  MTM: "Momentum",
  ROC: "Rate of Change",
  PSY: "Psychological Line",
  AO: "Awesome Oscillator",
  BIAS: "Bias Ratio",
  VR: "Volume Ratio",
};

const ALL_INDICATORS: { name: string; label: string; kind: "main" | "sub" }[] = [
  ...MAIN_INDICATORS.map((name) => ({
    name,
    label: INDICATOR_LABELS[name] ?? name,
    kind: "main" as const,
  })),
  ...SUB_INDICATORS.map((name) => ({
    name,
    label: INDICATOR_LABELS[name] ?? name,
    kind: "sub" as const,
  })),
].sort((a, b) => a.label.localeCompare(b.label));


const CHART_TYPES: { label: string; value: CandleType }[] = [
  { label: "Candles", value: "candle_solid" },
  { label: "Hollow candles", value: "candle_stroke" },
  { label: "Bars (OHLC)", value: "ohlc" },
  { label: "Area", value: "area" },
];

/* ------------------------------ theming ------------------------------ */

function readTheme(el: HTMLElement) {
  const cs = getComputedStyle(el);
  const v = (name: string, fallback: string) => cs.getPropertyValue(name).trim() || fallback;
  return {
    up: v("--bid", "#16a34a"),
    down: v("--ask", "#dc2626"),
    text: v("--foreground", "#111"),
    muted: v("--muted-foreground", "#888"),
    grid: v("--border", "#e5e5e5"),
    card: v("--card", "#fff"),
    secondary: v("--secondary", "#f1f1f1"),
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
      area: {
        lineColor: t.up,
        lineSize: 2,
        backgroundColor: [
          { offset: 0, color: "color-mix(in oklab, var(--bid) 26%, transparent)" },
          { offset: 1, color: "color-mix(in oklab, var(--bid) 0%, transparent)" },
        ],
      },
      priceMark: {
        high: { color: t.muted, textSize: 10 },
        low: { color: t.muted, textSize: 10 },
        last: {
          show: true,
          line: { show: true, style: "dashed", dashedValue: [4, 4], size: 1 },
          text: { size: 11, paddingLeft: 4, paddingRight: 4, borderRadius: 3 },
        },
      },
      tooltip: {
        offsetTop: 4,
        title: { show: true, color: t.muted, size: 12 },
        legend: { color: t.text, size: 12 },
        rect: { color: "transparent", borderColor: "transparent", paddingLeft: 0 },
      },
    },
    indicator: {
      tooltip: {
        title: { color: t.muted, size: 11 },
        legend: { color: t.text, size: 11 },
      },
      lastValueMark: { show: false },
    },
    xAxis: {
      ...axis,
      size: "auto",
      axisLine: { ...axis.axisLine, show: false },
      tickLine: { ...axis.tickLine, show: false, length: 0 },
      tickText: { ...axis.tickText, marginStart: 0, marginEnd: 0 },
    },
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

export default function KLineChartPanel({ symbol }: { symbol: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<Chart | null>(null);

  const [interval, setIntervalValue] = useState<Interval>("1d");
  const [candleType, setCandleType] = useState<CandleType>("candle_solid");
  const [source, setSource] = useSource();
  const [sourceOpen, setSourceOpen] = useState(false);


  const [sheet, setSheet] = useState<null | "interval" | "type" | "indicators">(null);
  const [mainOn, setMainOn] = useState<string[]>(["MA"]);
  const [subOn, setSubOn] = useState<string[]>(["VOL"]);
  const [fullscreen, setFullscreen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);

  const shownIndicators = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = q
      ? ALL_INDICATORS.filter(
          (i) => i.label.toLowerCase().includes(q) || i.name.toLowerCase().includes(q),
        )
      : ALL_INDICATORS;
    return [...list].sort((a, b) => {
      const fa = favorites.includes(a.name) ? 0 : 1;
      const fb = favorites.includes(b.name) ? 0 : 1;
      return fa - fb || a.label.localeCompare(b.label);
    });
  }, [query, favorites]);


  const active = useMemo(
    () => INTERVALS.find((i) => i.value === interval) ?? INTERVALS[10]!,
    [interval],
  );

  /* create the chart once */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const theme = readTheme(el);
    const chart = init(el, {
      styles: buildStyles(theme, "candle_solid"),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    });
    chartRef.current = chart;
    chart?.createIndicator({ name: "MA", paneId: "candle_pane" }, true);
    chart?.createIndicator({ name: "VOL", paneId: "vol_pane" }, false);
    chart?.setPaneOptions({ id: "vol_pane", height: 70 });

    const onResize = () => chart?.resize();
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      chartRef.current = null;
      dispose(el);
    };
  }, []);

  /* restyle when candle type or theme changes */
  useEffect(() => {
    const el = containerRef.current;
    if (!el || !chartRef.current) return;
    chartRef.current.setStyles(buildStyles(readTheme(el), candleType));
  }, [candleType]);

  /* symbol / interval data wiring */
  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;
    let unsubscribe: (() => void) | null = null;
    setLoading(true);
    setError(null);

    chart.setDataLoader({
      getBars: async ({ type, timestamp, callback }) => {
        try {
          // "forward" walks back in history, "backward" fills newer bars.
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
    chart.setOffsetRightDistance(24);
    chart.setBarSpace(7);
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
    const url = chart.getConvertPictureUrl(true, "png", bg);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${symbol}-${interval}.png`;
    a.click();
  }, [symbol, interval]);

  const toggleMain = (name: string) => {
    const chart = chartRef.current;
    if (!chart) return;
    if (mainOn.includes(name)) {
      chart.removeIndicator({ paneId: "candle_pane", name });
      setMainOn((s) => s.filter((n) => n !== name));
    } else {
      chart.createIndicator({ name, paneId: "candle_pane" }, true);
      setMainOn((s) => [...s, name]);
    }
  };

  const toggleSub = (name: string) => {
    const chart = chartRef.current;
    if (!chart) return;
    const paneId = `${name.toLowerCase()}_pane`;
    if (subOn.includes(name)) {
      chart.removeIndicator({ paneId, name });
      setSubOn((s) => s.filter((n) => n !== name));
    } else {
      chart.createIndicator({ name, paneId }, false);
      chart.setPaneOptions({ id: paneId, height: 80 });
      setSubOn((s) => [...s, name]);
    }
  };

  return (
    <div ref={wrapperRef} className="relative mt-2 bg-card">




      {/* toolbar */}
      <div className="flex items-center gap-1 overflow-x-auto pb-2 text-sm">

        {QUICK.map((v) => {
          const item = INTERVALS.find((i) => i.value === v)!;
          return (
            <button
              key={v}
              onClick={() => setIntervalValue(v)}
              className={
                interval === v
                  ? "rounded-md bg-secondary px-2 py-1 font-medium"
                  : "px-2 py-1 text-muted-foreground"
              }
            >
              {item.label}
            </button>
          );
        })}
        <button
          onClick={() => setSheet("interval")}
          className="flex items-center gap-0.5 px-1 py-1 text-muted-foreground"
          aria-label="More timeframes"
        >
          {QUICK.includes(interval) ? "" : active.label}
          <ChevronDown className="size-4" />
        </button>

        <span className="mx-1 h-4 w-px shrink-0 bg-border" />

        <button onClick={() => setSheet("type")} aria-label="Chart type" className="px-1.5 py-1">
          {candleType === "area" ? (
            <LineChart className="size-[18px] text-muted-foreground" />
          ) : (
            <CandlestickChart className="size-[18px] text-muted-foreground" />
          )}
        </button>
        <button
          onClick={() => setSheet("indicators")}
          aria-label="Indicators"
          className="px-1.5 py-1"
        >
          <SlidersHorizontal className="size-[18px] text-muted-foreground" />
        </button>
        <button onClick={screenshot} aria-label="Save screenshot" className="px-1.5 py-1">
          <Camera className="size-[18px] text-muted-foreground" />
        </button>
        <button
          onClick={() => setSourceOpen((o) => !o)}
          aria-label="Chart data source"
          aria-expanded={sourceOpen}
          className="ml-auto flex shrink-0 items-center gap-1 rounded-md bg-secondary px-2 py-1 text-xs font-medium"
        >
          {SOURCE_LABELS[source]}
          <ChevronDown className="size-3.5 text-muted-foreground" />
        </button>
        <button onClick={toggleFullscreen} aria-label="Toggle full view" className="px-1.5 py-1">
          {fullscreen ? (
            <Minimize2 className="size-[18px] text-muted-foreground" />
          ) : (
            <Expand className="size-[18px] text-muted-foreground" />
          )}
        </button>
      </div>

      {sourceOpen && (
        <>
          <button
            aria-label="Close data source menu"
            className="fixed inset-0 z-30 cursor-default"
            onClick={() => setSourceOpen(false)}
          />
          <div className="absolute right-8 top-9 z-40 w-40 overflow-hidden rounded-xl bg-card shadow-[0_12px_40px_-8px_rgba(0,0,0,0.45)] ring-1 ring-border">
            {(["aster", "kucoin"] as MarketSource[]).map((s) => (
              <button
                key={s}
                onClick={() => {
                  setSource(s);
                  setSourceOpen(false);
                }}
                className="flex w-full items-center justify-between px-3 py-3 text-left text-sm"
              >
                <span className={source === s ? "text-foreground" : "text-muted-foreground"}>
                  {SOURCE_LABELS[s]}
                </span>
                {source === s && <Check className="size-4 text-foreground" />}
              </button>
            ))}
          </div>
        </>
      )}


      {/* chart */}
      <div className="relative">
        <div
          ref={containerRef}
          className={fullscreen ? "h-[calc(100vh-96px)] w-full" : "h-[340px] w-full"}
        />
        <CandleCountdown interval={interval} className="bottom-[24px] right-[56px]" />
        {(loading || error) && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <span className="rounded-md bg-secondary px-3 py-1.5 text-xs text-muted-foreground">
              {error ?? "Loading market data…"}
            </span>
          </div>
        )}
      </div>

      {/* sheets */}
      {sheet && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <button
            aria-label="Close"
            className="absolute inset-0 bg-foreground/30"
            onClick={() => setSheet(null)}
          />
          <div
            className={`relative flex max-h-[85vh] flex-col overflow-hidden rounded-t-[2rem] bg-card pt-3 shadow-[0_-12px_40px_-12px_rgba(0,0,0,0.25)] ${
              sheet === "indicators" ? "h-[85vh]" : "pb-8"
            }`}
          >
            <div className="mx-auto mb-3 h-1 w-12 shrink-0 rounded-full bg-secondary" />

            {sheet === "interval" && (
              <div className="grid grid-cols-4 gap-2 px-4">
                {INTERVALS.map((i) => (
                  <button
                    key={i.value}
                    onClick={() => {
                      setIntervalValue(i.value);
                      setSheet(null);
                    }}
                    className={
                      interval === i.value
                        ? "rounded-lg bg-primary px-3 py-2.5 text-sm font-medium text-primary-foreground"
                        : "rounded-lg bg-secondary px-3 py-2.5 text-sm text-muted-foreground"
                    }
                  >
                    {i.label}
                  </button>
                ))}
              </div>
            )}

            {sheet === "type" && (
              <div className="px-2">
                {CHART_TYPES.map((c) => (
                  <button
                    key={c.value}
                    onClick={() => {
                      setCandleType(c.value);
                      setSheet(null);
                    }}
                    className="flex w-full items-center justify-between px-4 py-4 text-left text-base"
                  >
                    <span className={candleType === c.value ? "text-primary" : ""}>{c.label}</span>
                    {candleType === c.value && <Crosshair className="size-4 text-primary" />}
                  </button>
                ))}
              </div>
            )}

            {sheet === "indicators" && (
              <>
                <div className="flex shrink-0 items-center justify-between px-4 pb-3">
                  <h2 className="text-2xl font-semibold">Indicators</h2>
                  <button aria-label="Close indicators" onClick={() => setSheet(null)}>
                    <X className="size-6" />
                  </button>
                </div>

                <label className="flex shrink-0 items-center gap-3 border-y border-border px-4 py-3">
                  <Search className="size-5 shrink-0 text-muted-foreground" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search"
                    className="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground"
                  />
                  {query && (
                    <button aria-label="Clear search" onClick={() => setQuery("")}>
                      <X className="size-4 text-muted-foreground" />
                    </button>
                  )}
                </label>

                <div className="flex-1 overflow-y-auto pb-8">
                  <p className="px-4 pb-1 pt-4 text-xs uppercase tracking-wide text-muted-foreground">
                    Script name
                  </p>
                  {shownIndicators.length === 0 ? (
                    <p className="px-4 py-10 text-center text-sm text-muted-foreground">
                      No indicators match “{query}”.
                    </p>
                  ) : (
                    <ul>
                      {shownIndicators.map((ind) => {
                        const on =
                          ind.kind === "main"
                            ? mainOn.includes(ind.name)
                            : subOn.includes(ind.name);
                        const fav = favorites.includes(ind.name);
                        return (
                          <li key={ind.name} className="flex items-center">
                            <button
                              aria-label={`Favorite ${ind.label}`}
                              aria-pressed={fav}
                              onClick={() =>
                                setFavorites((s) =>
                                  s.includes(ind.name)
                                    ? s.filter((n) => n !== ind.name)
                                    : [...s, ind.name],
                                )
                              }
                              className="py-3.5 pl-4 pr-3"
                            >
                              <Star
                                className={`size-5 ${
                                  fav ? "fill-primary text-primary" : "text-muted-foreground"
                                }`}
                              />
                            </button>
                            <button
                              onClick={() =>
                                ind.kind === "main" ? toggleMain(ind.name) : toggleSub(ind.name)
                              }
                              className="flex min-w-0 flex-1 items-center gap-2 py-3.5 pr-4 text-left"
                            >
                              <span className={`truncate text-base ${on ? "text-primary" : ""}`}>
                                {ind.label}
                              </span>
                              <span className="shrink-0 text-xs text-muted-foreground">
                                {ind.name}
                              </span>
                              {on && <Check className="ml-auto size-4 shrink-0 text-primary" />}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
