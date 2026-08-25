import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

/** `useLayoutEffect` on the client, no-op during SSR (avoids the React warning). */
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;
import { getTickOptions, getMarketPrice } from "@/lib/tick-size";
import { useTicker } from "@/hooks/use-ticker";
import { MarketSelector } from "@/components/MarketSelector";
import { usePair } from "@/hooks/use-pair";
import logoMark from "@/assets/logo-mark.png";
import { MainMenu } from "@/components/MainMenu";
import { toast } from "sonner";
import { ConnectButton } from "@/components/ConnectButton";
import { BottomNav } from "@/components/BottomNav";
import { OrdersPanel } from "@/components/OrdersPanel";
import { DexTerminal } from "@/components/dex/DexTerminal";
import { OrderTypeSheet } from "@/components/OrderTypeSheet";
import { TickSizeSheet } from "@/components/TickSizeSheet";
import { ExpirySheet } from "@/components/ExpirySheet";
import { LiveChart } from "@/components/LiveChart";
import {
  ChevronDown,
  Star,
  LineChart,
  CandlestickChart,
  Menu,
  Plus,
  History,
  Link2,
  Search,
} from "lucide-react";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Aster Perp Trading — BTCUSDT Order Book & Limit Orders" },
      {
        name: "description",
        content:
          "Mobile perpetual futures trading interface for BTCUSDT: live order book, cross margin, 20x leverage and limit orders.",
      },
      { property: "og:title", content: "Aster Perp Trading — BTCUSDT Order Book & Limit Orders" },
      {
        property: "og:description",
        content:
          "Mobile perpetual futures trading interface for BTCUSDT: live order book, cross margin, 20x leverage and limit orders.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const asks = [
  { price: "66,009.5", size: "112.44K", depth: 51 },
  { price: "66,008.9", size: "78.61K", depth: 35 },
  { price: "66,008.3", size: "249.97K", depth: 62 },
  { price: "66,008.2", size: "96.30K", depth: 30 },
  { price: "66,007.7", size: "24.95K", depth: 44 },
  { price: "66,007.6", size: "24.95K", depth: 45 },
  { price: "66,007.5", size: "231.29K", depth: 38 },
  { price: "66,007.4", size: "150.12K", depth: 50 },
  { price: "66,007.3", size: "89.75K", depth: 41 },
  { price: "66,007.2", size: "120.58K", depth: 55 },
];

const bids = [
  { price: "66,007.0", size: "25.34K", depth: 96 },
  { price: "66,004.3", size: "12.07K", depth: 94 },
  { price: "66,003.0", size: "392.38K", depth: 66 },
  { price: "66,002.9", size: "14.45K", depth: 68 },
  { price: "66,002.3", size: "170.87K", depth: 90 },
  { price: "66,001.8", size: "88.12K", depth: 72 },
  { price: "66,001.1", size: "204.63K", depth: 84 },
  { price: "66,000.8", size: "45.21K", depth: 58 },
  { price: "66,000.5", size: "133.90K", depth: 76 },
  { price: "66,000.2", size: "67.44K", depth: 64 },
];



const EXPIRY_OPTIONS = [
  { key: "GTC", hint: "Good till cancelled" },
  { key: "5m", hint: "Cancels in 5 minutes" },
  { key: "15m", hint: "Cancels in 15 minutes" },
  { key: "1h", hint: "Cancels in 1 hour" },
  { key: "4h", hint: "Cancels in 4 hours" },
  { key: "12h", hint: "Cancels in 12 hours" },
  { key: "1d", hint: "Cancels in 1 day" },
  { key: "3d", hint: "Cancels in 3 days" },
  { key: "7d", hint: "Cancels in 7 days" },
];

/** Parses book display values like "112.44K" / "1.16M" / "66,007.4" into a number. */
function parseCompact(v: string): number {
  const raw = v.replace(/,/g, "").trim();
  const mult = raw.endsWith("K") ? 1e3 : raw.endsWith("M") ? 1e6 : 1;
  const n = parseFloat(raw);
  return Number.isFinite(n) ? n * mult : 0;
}

const BEST_ASK = Math.min(...asks.map((a) => parseCompact(a.price)));
const BEST_BID = Math.max(...bids.map((b) => parseCompact(b.price)));
const SPREAD = Math.max(0, BEST_ASK - BEST_BID);
const SPREAD_PCT = BEST_BID > 0 ? (SPREAD / BEST_BID) * 100 : 0;

const MID_PRICE = (BEST_ASK + BEST_BID) / 2;

/** Mock available balance used by the size slider. */
const AVAILABLE_USDT = 2500;

/** Draggable percentage slider that fills the size box from the available balance. */
function SizeSlider({ value, onChange }: { value: number; onChange: (p: number) => void }) {
  const trackRef = useRef<HTMLDivElement>(null);

  const setFromClientX = (clientX: number) => {
    const el = trackRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    onChange(Math.round(Math.min(100, Math.max(0, pct))));
  };

  return (
    <div className="pt-1 pb-2">
      <div
        ref={trackRef}
        role="slider"
        aria-label="Size percentage"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={value}
        tabIndex={0}
        className="relative flex h-6 touch-none items-center"
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          setFromClientX(e.clientX);
        }}
        onPointerMove={(e) => {
          if (e.currentTarget.hasPointerCapture(e.pointerId)) setFromClientX(e.clientX);
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") onChange(Math.min(100, value + 5));
          if (e.key === "ArrowLeft") onChange(Math.max(0, value - 5));
        }}
      >
        <span className="absolute inset-x-0 h-[3px] rounded-full bg-secondary" />
        <span
          className="absolute h-[3px] rounded-full bg-primary"
          style={{ width: `${value}%` }}
        />
        {[0, 25, 50, 75, 100].map((p) => (
          <span
            key={p}
            className={`absolute size-1.5 -translate-x-1/2 rounded-full ${
              value >= p ? "bg-primary" : "bg-border"
            }`}
            style={{ left: `${p}%` }}
          />
        ))}
        <span
          className="absolute size-4 -translate-x-1/2 rounded-full bg-primary shadow"
          style={{ left: `${value}%` }}
        />
      </div>
      <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
        {[0, 25, 50, 75, 100].map((p) => (
          <button key={p} type="button" onClick={() => onChange(p)}>
            {p}%
          </button>
        ))}
      </div>
    </div>
  );
}


const BID_VOLUME = bids.reduce((s, b) => s + parseCompact(b.size), 0);
const ASK_VOLUME = asks.reduce((s, a) => s + parseCompact(a.size), 0);
const BID_SHARE = (BID_VOLUME / (BID_VOLUME + ASK_VOLUME)) * 100;


function sanitize(v: string): string {

  const cleaned = v.replace(/[^\d.]/g, "");
  const parts = cleaned.split(".");
  return parts.length > 2 ? `${parts[0]}.${parts.slice(1).join("")}` : cleaned;
}


function formatNum(value: number, decimals: number): string {
  if (!Number.isFinite(value)) return "--";
  return value.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/** Renders the dense desktop terminal on wide viewports, the mobile card stack otherwise. */
function Index() {
  // `null` until the viewport is measured: rendering the mobile stack first would
  // flash the wrong layout on desktop refreshes. useLayoutEffect resolves the
  // breakpoint before the browser paints, so only the correct layout is ever seen.
  const [desktop, setDesktop] = useState<boolean | null>(null);

  useIsomorphicLayoutEffect(() => {
    const mql = window.matchMedia("(min-width: 1024px)");
    const sync = () => setDesktop(mql.matches);
    sync();
    mql.addEventListener("change", sync);
    return () => mql.removeEventListener("change", sync);
  }, []);

  if (desktop === null) return <div className="min-h-screen bg-background" />;
  return desktop ? <DexTerminal /> : <MobileTrade />;
}

function MobileTrade() {
  const [pair, setPair] = usePair();
  const [selectorOpen, setSelectorOpen] = useState(false);
  const [inlineChart, setInlineChart] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const [tpsl, setTpsl] = useState(false);
  const [expiry, setExpiry] = useState("5m");
  const [expiryOpen, setExpiryOpen] = useState(false);

  const [orderType, setOrderType] = useState("Limit");
  const [orderTypeOpen, setOrderTypeOpen] = useState(false);
  const [tickIndex, setTickIndex] = useState(0);
  const [tickOpen, setTickOpen] = useState(false);
  const [side, setSide] = useState<"buy" | "sell">("buy");
  const [bookMode, setBookMode] = useState<"both" | "bids" | "asks">("both");
  const tickOptions = useMemo(() => getTickOptions(pair), [pair]);
  const tick = tickOptions[tickIndex] ?? tickOptions[0]!;
  const isMarket = orderType === "Market";
  const isLadder = orderType === "Ladder";
  const expandedBook = tpsl || isLadder;

  const ticker = useTicker(pair);
  const base = pair.replace(/USDT$/, "");
  const lastPrice = ticker?.last && ticker.last > 0 ? ticker.last : getMarketPrice(pair);
  const precision = ticker?.pricePrecision ?? (lastPrice >= 100 ? 1 : lastPrice >= 1 ? 3 : 5);
  const qtyPrecision = lastPrice >= 1000 ? 5 : lastPrice >= 1 ? 3 : 0;

  const [priceInput, setPriceInput] = useState("");
  const [priceTouched, setPriceTouched] = useState(false);
  const [sizeInput, setSizeInput] = useState("");
  const [sizeUnit, setSizeUnit] = useState<string>("USDT");
  const [ladderStart, setLadderStart] = useState("");
  const [ladderEnd, setLadderEnd] = useState("");
  const [ladderLevels, setLadderLevels] = useState("");
  const [ladderPreviewOpen, setLadderPreviewOpen] = useState(false);
  const [sizePct, setSizePct] = useState(0);
  const [postOnly, setPostOnly] = useState(false);


  // Reset auto-fill when the market changes.
  useEffect(() => {
    setPriceTouched(false);
    setSizeUnit((u) => (u === "USDT" ? "USDT" : pair.replace(/USDT$/, "")));
  }, [pair]);

  // Keep the price box tracking the live market price until the user edits it.
  useEffect(() => {
    if (!priceTouched) setPriceInput(lastPrice.toFixed(precision));
  }, [lastPrice, precision, priceTouched]);

  const effPrice = useMemo(() => {
    if (isMarket) return lastPrice;
    if (isLadder) {
      const s = Number(ladderStart);
      const e = Number(ladderEnd);
      if (s > 0 && e > 0) return (s + e) / 2;
      if (s > 0) return s;
      if (e > 0) return e;
      return lastPrice;
    }
    const p = Number(priceInput);
    return p > 0 ? p : lastPrice;
  }, [isMarket, isLadder, ladderStart, ladderEnd, priceInput, lastPrice]);


  const sizeNum = Number(sizeInput) || 0;
  const totalQty = sizeUnit === "USDT" ? (effPrice > 0 ? sizeNum / effPrice : 0) : sizeNum;

  // Fill the size box with a percentage of the available balance.
  const applyPct = (p: number) => {
    setSizePct(p);
    const usdt = (AVAILABLE_USDT * p) / 100;
    if (p === 0) {
      setSizeInput("");
      return;
    }
    setSizeInput(
      sizeUnit === "USDT"
        ? usdt.toFixed(2)
        : (effPrice > 0 ? usdt / effPrice : 0).toFixed(qtyPrecision),
    );
  };


  const ladderLevelRows = useMemo(() => {
    if (!isLadder) return [];
    const start = Number(ladderStart);
    const end = Number(ladderEnd);
    const n = Math.floor(Number(ladderLevels));
    if (!(start > 0) || !(end > 0) || !(n >= 1) || n > 100 || totalQty <= 0) return [];
    const step = n === 1 ? 0 : (end - start) / (n - 1);
    const qty = totalQty / n;
    return Array.from({ length: n }, (_, i) => {
      const price = start + step * i;
      return { price, qty, value: price * qty };
    });
  }, [isLadder, ladderStart, ladderEnd, ladderLevels, totalQty]);

  const orderValue = isLadder
    ? ladderLevelRows.reduce((sum, l) => sum + l.value, 0)
    : totalQty * effPrice;

  const cycleBookMode = () => {
    setBookMode((m) => (m === "both" ? "bids" : m === "bids" ? "asks" : "both"));
  };

  /** Tapping a book level fills the order form with that price and cumulative size. */
  const pickLevel = (row: { price: string; size: string }, rowSide: "ask" | "bid") => {
    const price = parseCompact(row.price);
    const size = parseCompact(row.size);
    if (!(price > 0)) return;
    setSide(rowSide === "ask" ? "buy" : "sell");
    if (isLadder) {
      if (!ladderStart) setLadderStart(price.toFixed(precision));
      else setLadderEnd(price.toFixed(precision));
    } else {
      setPriceTouched(true);
      setPriceInput(price.toFixed(precision));
    }
    if (size > 0) {
      setSizeInput(sizeUnit === "USDT" ? size.toFixed(2) : (size / price).toFixed(qtyPrecision));
    }
    toast.success(`Price ${row.price} filled`, { description: `Size ${row.size} ${sizeUnit}` });
  };







  return (
    <div className="min-h-screen bg-background p-2 pb-24 text-foreground">
      <MarketSelector
        open={selectorOpen}
        onClose={() => setSelectorOpen(false)}
        onSelect={setPair}
        current={pair}
      />
      <MainMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      <OrderTypeSheet
        open={orderTypeOpen}
        current={orderType}
        onSelect={setOrderType}
        onClose={() => setOrderTypeOpen(false)}
      />
      <TickSizeSheet
        open={tickOpen}
        options={tickOptions}
        current={tick}
        onSelect={(t) => setTickIndex(Math.max(0, tickOptions.indexOf(t)))}
        onClose={() => setTickOpen(false)}
      />
      <ExpirySheet
        open={expiryOpen}
        current={expiry}
        options={EXPIRY_OPTIONS}
        onSelect={setExpiry}
        onClose={() => setExpiryOpen(false)}
      />
      {/* Top bar */}
      <header className="flex items-center gap-2 px-2 py-4">
        <img src={logoMark} alt="Vellum logo" width={44} height={44} className="size-11" />
        <div className="ml-auto flex items-center gap-3">
          <ConnectButton showIcon />
          <button aria-label="Open menu" onClick={() => setMenuOpen(true)}>
            <Menu className="size-6" />
          </button>
        </div>
      </header>

      {/* Trading card */}
      <section className="rounded-2xl bg-card p-3">
        {/* Pair row */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectorOpen(true)}
            className="flex items-center gap-2"
            aria-label="Select market"
          >
            <h1 className="text-xl font-semibold">{pair}</h1>
            <span className="rounded-md bg-secondary px-2 py-0.5 text-xs text-muted-foreground">Perp</span>
            <ChevronDown className="size-4 text-muted-foreground" />
          </button>
          <span className="text-base font-medium text-ask">-0.30%</span>

          <div className="ml-auto flex items-center gap-4">
            <Star className="size-5 text-muted-foreground" />
            <button
              onClick={() => setInlineChart((v) => !v)}
              aria-label={inlineChart ? "Hide chart" : "Show chart"}
              aria-pressed={inlineChart}
            >
              <CandlestickChart
                className={`size-5 ${inlineChart ? "text-primary" : "text-muted-foreground"}`}
              />
            </button>
            <Link to="/chart" aria-label="Open chart">
              <LineChart className="size-5 text-muted-foreground" />
            </Link>
          </div>
        </div>

        {inlineChart && (
          <div className="mt-1 border-b border-border pb-2">
            <LiveChart symbol={pair} />
          </div>
        )}


        <div className="mt-3 grid grid-cols-[1fr_1.05fr] gap-3">
          {/* Left: order book */}
          <div>
            <p className="whitespace-nowrap border-b border-dashed border-border pb-1 text-[11px] text-muted-foreground">
              Funding (8h) / Countdown
            </p>
            <p className="mt-2 text-sm">0.0043% / 07:45:54</p>


            <div className="mt-3 flex items-start justify-between text-xs text-muted-foreground">
              <div>
                <p>Price</p>
                <p>(USDT)</p>
              </div>
              <div className="text-right">
                <p>Size</p>
                <p className="flex items-center justify-end gap-1">
                  (USDT) <ChevronDown className="size-3" />
                </p>
              </div>
            </div>

            <div className="mt-1 space-y-[3px]">
              {(bookMode !== "bids"
                ? expandedBook
                  ? asks
                  : bookMode === "asks"
                    ? asks.slice(0, 10)
                    : asks.slice(2, 7)
                : []
              ).map((r) => (
                <Row key={r.price} {...r} side="ask" onSelect={() => pickLevel(r, "ask")} />
              ))}
            </div>

            <div className="py-3 text-center">
              <p className="font-num text-xl font-semibold tabular-nums text-foreground">
                {formatNum(MID_PRICE, 1)}
              </p>
              <p className="text-sm text-muted-foreground">${formatNum(MID_PRICE, 1)}</p>
              <p className="mt-1 inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-[10px] text-muted-foreground">
                Spread {formatNum(SPREAD, 1)} · {SPREAD_PCT.toFixed(4)}%
              </p>

            </div>



            <div className="space-y-[3px]">
              {(bookMode !== "asks"
                ? expandedBook
                  ? bids
                  : bookMode === "bids"
                    ? bids.slice(0, 10)
                    : bids.slice(0, 5)
                : []
              ).map((r) => (
                <Row key={r.price} {...r} side="bid" onSelect={() => pickLevel(r, "bid")} />
              ))}
            </div>

            {/* Buy / sell pressure */}
            <div className="mt-4">
              <div className="flex items-center justify-between text-[10px] font-medium">
                <span className="text-bid">B {BID_SHARE.toFixed(0)}%</span>
                <span className="text-ask">{(100 - BID_SHARE).toFixed(0)}% S</span>
              </div>
              <div className="mt-1 flex h-1.5 overflow-hidden rounded-full bg-secondary">
                <span className="bg-bid transition-all duration-500" style={{ width: `${BID_SHARE}%` }} />
                <span className="flex-1 bg-ask" />
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <button
                onClick={cycleBookMode}
                aria-label={`Order book view: ${bookMode}`}
                className="flex flex-col gap-1"
              >
                <span className="flex gap-1">
                  <i className="size-2 rounded-[2px] bg-bid" />
                  <i className="block h-2 w-4 rounded-[2px] bg-secondary" />
                </span>
                <span className="flex gap-1">
                  <i className="size-2 rounded-[2px] bg-ask" />
                  <i className="block h-2 w-4 rounded-[2px] bg-secondary" />
                </span>
              </button>
              <button onClick={() => setTickOpen(true)} className="flex items-center gap-1 text-sm">
                {tick} <ChevronDown className="size-4 text-muted-foreground" />
              </button>
            </div>



          </div>

          {/* Right: order form */}
          <div className="min-w-0 space-y-2">

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setSide("buy")}
                className={`rounded-xl py-2.5 text-sm ${
                  side === "buy"
                    ? "bg-bid font-medium text-white"
                    : "bg-secondary text-foreground"
                }`}
              >
                Buy
              </button>
              <button
                type="button"
                onClick={() => setSide("sell")}
                className={`rounded-xl py-2.5 text-sm ${
                  side === "sell"
                    ? "bg-ask font-medium text-white"
                    : "bg-secondary text-foreground"
                }`}
              >
                Sell
              </button>
            </div>
            <button
              onClick={() => setOrderTypeOpen(true)}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-secondary py-2.5 text-sm"
            >
              <span className="mx-auto">{orderType}</span>
              <ChevronDown className="size-4 text-muted-foreground" />
            </button>

            {!isMarket && !isLadder && (
              <div className="flex items-stretch overflow-hidden rounded-xl bg-secondary">
                <div className="flex-1 px-3 py-2">
                  <p className="whitespace-nowrap text-[11px] text-muted-foreground">Order price</p>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={priceInput}
                    onChange={(e) => {
                      setPriceTouched(true);
                      setPriceInput(sanitize(e.target.value));
                    }}
                    className="w-full bg-transparent text-base outline-none"
                    aria-label="Order price"
                  />
                </div>
                <button className="border-l border-border/70 px-3 text-sm">USDT</button>
              </div>
            )}


            {isLadder && (
              <div className="space-y-2">
                <LadderField
                  label="Price start"
                  value={ladderStart}
                  onChange={setLadderStart}
                  placeholder="0.00"
                />
                <LadderField
                  label="Price end"
                  value={ladderEnd}
                  onChange={setLadderEnd}
                  placeholder="0.00"
                />
                <LadderField
                  label="Levels"
                  value={ladderLevels}
                  onChange={setLadderLevels}
                  placeholder="0"
                  integer
                />
              </div>
            )}


            <div className="flex items-center rounded-xl bg-secondary px-3 py-3">
              <span className="text-sm text-muted-foreground">Size</span>
              <input
                type="text"
                inputMode="decimal"
                value={sizeInput}
                onChange={(e) => setSizeInput(sanitize(e.target.value))}
                placeholder="0.00"
                aria-label="Order size"
                className="mx-2 min-w-0 flex-1 bg-transparent text-right text-base outline-none placeholder:text-muted-foreground"
              />
              <button
                onClick={() => setSizeUnit((u) => (u === "USDT" ? base : "USDT"))}
                className="flex shrink-0 items-center gap-1 text-sm"
              >
                {sizeUnit} <ChevronDown className="size-4 text-muted-foreground" />
              </button>
            </div>

            {/* size slider */}
            <SizeSlider value={sizePct} onChange={applyPct} />

            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Avbl</span>
              <span className="flex items-center gap-1">
                {formatNum(AVAILABLE_USDT, 2)} USDT{" "}
                <Plus className="size-4 rounded-full border border-foreground p-[1px]" />
              </span>
            </div>


            <div className="space-y-3 pt-1">
              <Check label="TP/SL" checked={tpsl} onToggle={() => setTpsl((v) => !v)} />
              {tpsl && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    Take Profit
                    <button className="flex items-center gap-1 text-foreground">
                      Mark <ChevronDown className="size-4 text-muted-foreground" />
                    </button>
                  </div>
                  <TpSlField label="TP" />
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    Stop Loss
                    <button className="flex items-center gap-1 text-foreground">
                      Mark <ChevronDown className="size-4 text-muted-foreground" />
                    </button>
                  </div>
                  <TpSlField label="SL" />
                </div>
              )}
              <Check
                label="Post-Only"
                checked={postOnly}
                onToggle={() => setPostOnly((v) => !v)}
              />

            </div>

            <button
              onClick={() => setExpiryOpen(true)}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-secondary py-2.5 text-sm"
            >
              <span className="mx-auto">Expires in {expiry}</span>
              <ChevronDown className="size-4 text-muted-foreground" />
            </button>

            <div className="space-y-2 pt-1 text-sm">
              <Info
                label="Order value"
                value={`${orderValue > 0 ? formatNum(orderValue, 2) : "0.00"} USDT`}
              />
            </div>


            {isLadder && (
              <button
                onClick={() => setLadderPreviewOpen(true)}
                disabled={ladderLevelRows.length === 0}
                className="w-full rounded-xl bg-secondary py-3 text-sm font-medium disabled:opacity-50"
              >
                Preview ladder order
              </button>
            )}




            <ConnectButton
              variant="block"
              showIcon
              connectedAction="custom"
              connectedLabel={side === "buy" ? `Buy ${pair.replace("USDT", "")}` : `Sell ${pair.replace("USDT", "")}`}
              onConnectedClick={() =>
                toast(`${side === "buy" ? "Buy" : "Sell"} order placement isn't wired up yet`)
              }
              connectedClassName={side === "buy" ? "bg-bid text-white" : "bg-ask text-white"}
              className="mt-2"
            />

          </div>
        </div>
      </section>

      {ladderPreviewOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <button
            aria-label="Close ladder preview"
            onClick={() => setLadderPreviewOpen(false)}
            className="absolute inset-0 bg-black/50"
          />
          <div className="relative w-full max-w-md rounded-t-2xl bg-card p-4 pb-6 shadow-lg">
            <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-border" />
            <h2 className="text-base font-semibold">
              Ladder preview · {side === "buy" ? "Buy" : "Sell"} {base}
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              {ladderLevelRows.length} levels · {formatNum(totalQty, qtyPrecision)} {base} ·{" "}
              {formatNum(orderValue, 2)} USDT
            </p>
            <div className="mt-3 flex justify-between px-1 pb-1 text-[11px] text-muted-foreground">
              <span>Price</span>
              <span>Qty ({base})</span>
              <span>Value (USDT)</span>
            </div>
            <div className="max-h-72 space-y-1 overflow-y-auto">
              {ladderLevelRows.map((l, i) => (
                <div
                  key={i}
                  className="flex justify-between rounded-lg bg-secondary px-2 py-1.5 text-xs"
                >
                  <span className={side === "buy" ? "text-bid" : "text-ask"}>
                    {formatNum(l.price, precision)}
                  </span>
                  <span>{formatNum(l.qty, qtyPrecision)}</span>
                  <span>{formatNum(l.value, 2)}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setLadderPreviewOpen(false)}
                className="flex-1 rounded-xl bg-secondary py-3 text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setLadderPreviewOpen(false);
                  toast(
                    `Ladder ${side} confirmed · ${ladderLevelRows.length} levels · ${formatNum(orderValue, 2)} USDT`,
                  );
                }}
                className={`flex-1 rounded-xl py-3 text-sm font-medium text-white ${
                  side === "buy" ? "bg-bid" : "bg-ask"
                }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}


      {/* Bottom panel */}
      <OrdersPanel />

      <BottomNav />
    </div>
  );
}

function Row({
  price,
  size,
  depth,
  side,
  onSelect,
}: {
  price: string;
  size: string;
  depth: number;
  side: "ask" | "bid";
  onSelect?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-label={`Use ${side} price ${price}`}
      className="relative flex w-full items-center justify-between overflow-hidden rounded-[3px] px-1 py-[3px] text-sm transition-colors active:bg-secondary"
    >
      <span
        className={`absolute inset-y-0 right-0 ${side === "ask" ? "bg-ask-fill" : "bg-bid-fill"}`}
        style={{ width: `${depth}%` }}
      />
      <span className={`relative ${side === "ask" ? "text-ask" : "text-bid"}`}>{price}</span>
      <span className="relative">{size}</span>
    </button>
  );
}


function Check({
  label,
  checked,
  onToggle,
}: {
  label: string;
  checked?: boolean;
  onToggle?: () => void;
}) {
  return (
    <button type="button" onClick={onToggle} className="flex items-center gap-2 text-left">
      <i
        className={`flex size-4 items-center justify-center rounded-full border ${
          checked ? "border-primary" : "border-border"
        }`}
      >
        {checked && <i className="size-2 rounded-[2px] bg-primary" />}
      </i>
      <span className="border-b border-dashed border-border text-sm text-muted-foreground">
        {label}
      </span>
    </button>
  );
}

function TpSlField({ label }: { label: string }) {
  return (
    <div className="flex items-center rounded-xl bg-secondary px-3 py-3">
      <span className="text-sm text-muted-foreground">{label}</span>
      <button className="ml-auto flex items-center gap-1 text-sm">
        PnL (USDT) <ChevronDown className="size-4 text-muted-foreground" />
      </button>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span>{value}</span>
    </div>
  );
}

function LadderField({
  label,
  placeholder,
  value,
  onChange,
  integer,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  integer?: boolean;
}) {
  return (
    <div className="flex items-center rounded-xl bg-secondary px-3 py-3">
      <span className="whitespace-nowrap text-sm text-muted-foreground">{label}</span>
      <input
        type="text"
        inputMode={integer ? "numeric" : "decimal"}
        value={value}
        aria-label={label}
        onChange={(e) =>
          onChange(integer ? e.target.value.replace(/\D/g, "") : sanitize(e.target.value))
        }
        placeholder={placeholder}
        className="ml-auto w-20 bg-transparent text-right text-base outline-none placeholder:text-muted-foreground"
      />
    </div>
  );
}

