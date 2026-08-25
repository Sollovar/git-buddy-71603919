import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  useTicker,
  formatPrice,
  formatCompact,
  formatCountdown,
} from "@/hooks/use-ticker";

import { MarketSelector } from "@/components/MarketSelector";
import { MainMenu } from "@/components/MainMenu";
import logoMark from "@/assets/logo-mark.png";
import { ConnectButton } from "@/components/ConnectButton";
import { BottomNav } from "@/components/BottomNav";
import { OrdersPanel } from "@/components/OrdersPanel";
import { usePair } from "@/hooks/use-pair";
import {
  OrderBookPanel,
  TradesPanel,
  DepthPanel,
  DetailsPanel,
} from "@/components/MarketPanels";
import { LiveChart } from "@/components/LiveChart";
import {
  ChevronDown,
  Star,
  Menu,
  AlignLeft,
  History,
  Link2,
  Search,
} from "lucide-react";


export const Route = createFileRoute("/chart")({
  head: () => ({
    meta: [
      { title: "BTCUSDT Chart — Aster Perp Trading" },
      {
        name: "description",
        content:
          "BTCUSDT perpetual chart with 1D candles, mark price, 24h volume, open interest and funding countdown.",
      },
      { property: "og:title", content: "BTCUSDT Chart — Aster Perp Trading" },
      {
        property: "og:description",
        content:
          "BTCUSDT perpetual chart with 1D candles, mark price, 24h volume, open interest and funding countdown.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ChartPage,
});

function ChartPage() {
  const [pair, setPair] = usePair();
  const [selectorOpen, setSelectorOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [tab, setTab] = useState<"Chart" | "Order Book" | "Trades" | "Depth" | "Details">("Chart");
  const ticker = useTicker(pair);
  const [, forceTick] = useState(0);

  // Refresh the funding countdown once per second.
  useEffect(() => {
    const id = setInterval(() => forceTick((n) => n + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const precision = ticker?.pricePrecision ?? 2;
  const up = (ticker?.changePercent ?? 0) >= 0;

  return (
    <div className="min-h-screen bg-background p-2 pb-24 text-foreground">
      <MainMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      <MarketSelector
        open={selectorOpen}
        onClose={() => setSelectorOpen(false)}
        onSelect={setPair}
        current={pair}
      />
      {/* Top bar */}
      <header className="flex items-center gap-2 px-2 py-4">
        <Link to="/" className="flex size-11 items-center justify-center">
          <img src={logoMark} alt="Vellum logo" width={44} height={44} className="size-11" />
        </Link>
        <div className="ml-auto flex items-center gap-3">
          <ConnectButton showIcon />
          <button aria-label="Open menu" onClick={() => setMenuOpen(true)}>
            <Menu className="size-6" />
          </button>
        </div>
      </header>

      {/* Chart card */}
      <section className="rounded-2xl bg-card p-3">
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
          <span className={`text-base font-medium ${up ? "text-bid" : "text-ask"}`}>
            {ticker ? `${up ? "+" : ""}${ticker.changePercent.toFixed(2)}%` : "--"}
          </span>

          <div className="ml-auto flex items-center gap-3">
            <Star className="size-5 fill-primary text-primary" />
            <Link to="/" aria-label="Go to trade page" className="flex items-center">
              <AlignLeft className="size-5 text-muted-foreground" />
            </Link>
          </div>
        </div>

        <div className="mt-2 flex items-start justify-between gap-3">
          <div>
            <p className="flex items-center gap-1 text-sm text-muted-foreground">
              {ticker?.markPrice ? "Mark price" : "Last price"}
            </p>
            <p className={`mt-1 text-3xl font-semibold ${up ? "" : "text-ask"}`}>
              {formatPrice(ticker?.markPrice ?? ticker?.last, precision)}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Last price{" "}
              <span className="text-foreground">{formatPrice(ticker?.last, precision)}</span>
            </p>
          </div>
          <div className="text-sm">
            <div className="flex gap-4">
              <div>
                <p className="text-xs text-muted-foreground">24h Vol (USDT)</p>
                <p className="mt-0.5">{formatCompact(ticker?.quoteVolume)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">24h High / Low</p>
                <p className="mt-0.5">
                  {formatPrice(ticker?.high, precision)} / {formatPrice(ticker?.low, precision)}
                </p>
              </div>
            </div>
            <p className="mt-2 border-b border-dashed border-border pb-0.5 text-xs text-muted-foreground">
              Funding (8h) / Countdown
            </p>
            <p className="mt-1">
              {ticker?.fundingRate !== null && ticker?.fundingRate !== undefined
                ? `${(ticker.fundingRate * 100).toFixed(4)}%`
                : "--"}{" "}
              / {formatCountdown(ticker?.nextFundingTime)}
            </p>
          </div>
        </div>


        {/* Tabs */}
        <div className="mt-3 flex items-center gap-2 overflow-x-auto">
          {(["Chart", "Order Book", "Trades", "Depth", "Details"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={
                tab === t
                  ? "whitespace-nowrap rounded-lg bg-secondary px-3 py-2 text-sm font-medium"
                  : "whitespace-nowrap px-2 py-2 text-sm text-muted-foreground"
              }
            >
              {t}
            </button>
          ))}
        </div>

        {/* Live chart */}
        {tab === "Chart" ? (
          <LiveChart symbol={pair} />
        ) : tab === "Order Book" ? (
          <OrderBookPanel />
        ) : tab === "Trades" ? (
          <TradesPanel />
        ) : tab === "Depth" ? (
          <DepthPanel />
        ) : (
          <DetailsPanel />
        )}


      </section>

      {/* Bottom panel */}
      <OrdersPanel />

      <BottomNav />
    </div>
  );
}
