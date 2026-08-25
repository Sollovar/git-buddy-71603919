import { TopNav } from "@/components/dex/TopNav";
import { MarketBar } from "@/components/dex/MarketBar";
import { DexLiveChart } from "@/components/dex/DexLiveChart";
import { OrderBook } from "@/components/dex/OrderBook";
import { OrderForm } from "@/components/dex/OrderForm";
import { FooterTicker } from "@/components/dex/FooterTicker";
import { PositionsPanel } from "@/components/dex/PositionsPanel";

/** Desktop trading terminal (imported dex UI). */
export function DexTerminal() {
  return (
    <div className="dex-root no-scrollbar h-screen overflow-y-auto bg-panel-2 p-[5px] text-foreground">
      <h1 className="sr-only">Aster DEX BTCUSDT perpetual trading interface</h1>
      <div className="flex h-full min-h-0 flex-col gap-[5px]">
        <div className="shrink-0 overflow-hidden rounded-2xl shadow-[var(--shadow-panel)]">
          <TopNav />
        </div>
        <div className="flex h-[calc(100vh_+_40px)] shrink-0 gap-[5px]">
          <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-[5px]">
            <div className="shrink-0 overflow-hidden rounded-2xl shadow-[var(--shadow-panel)]">
              <MarketBar />
            </div>
            <div className="flex min-h-0 flex-1 overflow-hidden rounded-2xl shadow-[var(--shadow-panel)]">
              <DexLiveChart />
            </div>
          </div>
          <div className="min-h-0 overflow-hidden rounded-2xl shadow-[var(--shadow-panel)]">
            <OrderBook />
          </div>
          <div className="h-[calc(100%_-_95px)] min-h-0 self-start overflow-hidden rounded-2xl shadow-[var(--shadow-panel)]">
            <OrderForm />
          </div>
        </div>
        <div className="flex h-[340px] w-[calc(100%_-_285px)] shrink-0 gap-[5px]">
          <div className="flex min-w-0 flex-1 overflow-hidden rounded-2xl shadow-[var(--shadow-panel)]">
            <PositionsPanel />
          </div>
        </div>
        <div className="fixed bottom-0 left-0 right-0 z-30 overflow-hidden border-t border-border bg-background shadow-[var(--shadow-panel)]">
          <FooterTicker />
        </div>
      </div>
    </div>
  );
}
