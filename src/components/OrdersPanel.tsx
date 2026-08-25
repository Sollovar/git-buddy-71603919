import { useMemo, useState } from "react";
import { ChevronRight, History, Search, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";

const TABS = ["Open Orders", "Ladder History", "Order History", "Trade History"] as const;
type Tab = (typeof TABS)[number];

type MockOrder = {
  pair: string;
  side: "Buy" | "Sell";
  type: string;
  price: string;
  amount: string;
  filled: string;
  time: string;
  status: string;
};

const OPEN_ORDERS: MockOrder[] = [
  { pair: "BTC/USDT", side: "Buy", type: "Limit", price: "66,850.00", amount: "0.0250", filled: "0.00", time: "2026-08-02 12:41", status: "Open" },
  { pair: "ETH/USDT", side: "Sell", type: "Limit", price: "3,248.60", amount: "1.2500", filled: "0.00", time: "2026-08-02 12:52", status: "Open" },
  { pair: "SOL/USDT", side: "Buy", type: "Limit", price: "178.90", amount: "24.000", filled: "6.000", time: "2026-08-02 13:04", status: "Partial" },
  { pair: "BNB/USDT", side: "Sell", type: "Limit", price: "612.40", amount: "3.500", filled: "0.00", time: "2026-08-02 13:18", status: "Open" },
  { pair: "XRP/USDT", side: "Buy", type: "Limit", price: "0.6120", amount: "5,000", filled: "1,250", time: "2026-08-02 13:29", status: "Partial" },
  { pair: "DOGE/USDT", side: "Sell", type: "Limit", price: "0.1180", amount: "12,000", filled: "0.00", time: "2026-08-02 13:41", status: "Open" },
  { pair: "ADA/USDT", side: "Buy", type: "Limit", price: "0.4520", amount: "8,000", filled: "0.00", time: "2026-08-02 13:55", status: "Open" },
];

const ORDER_HISTORY: MockOrder[] = [
  { pair: "SOL/USDT", side: "Sell", type: "Limit", price: "182.40", amount: "12.500", filled: "12.500", time: "2026-08-01 19:04", status: "Filled" },
  { pair: "ETH/USDT", side: "Buy", type: "Limit", price: "3,120.00", amount: "0.800", filled: "0.000", time: "2026-08-01 09:22", status: "Cancelled" },
];

const TRADE_HISTORY: MockOrder[] = [
  { pair: "SOL/USDT", side: "Sell", type: "Taker", price: "182.40", amount: "12.500", filled: "2,280.00", time: "2026-08-01 19:04", status: "Fee 0.68 USDT" },
];

type LadderChild = MockOrder & { level: number };

const LADDER_CHILDREN: LadderChild[] = [
  { level: 1, pair: "BTC/USDT", side: "Buy", type: "Limit", price: "66,400.00", amount: "0.0250", filled: "0.0250", time: "2026-08-02 11:10", status: "Filled" },
  { level: 2, pair: "BTC/USDT", side: "Buy", type: "Limit", price: "66,600.00", amount: "0.0250", filled: "0.0250", time: "2026-08-02 11:10", status: "Filled" },
  { level: 3, pair: "BTC/USDT", side: "Buy", type: "Limit", price: "66,800.00", amount: "0.0250", filled: "0.0000", time: "2026-08-02 11:10", status: "Open" },
  { level: 4, pair: "BTC/USDT", side: "Buy", type: "Limit", price: "67,000.00", amount: "0.0250", filled: "0.0000", time: "2026-08-02 11:10", status: "Open" },
  { level: 5, pair: "BTC/USDT", side: "Buy", type: "Limit", price: "67,200.00", amount: "0.0250", filled: "0.0000", time: "2026-08-02 11:10", status: "Open" },
];

const LADDER_PARENT: MockOrder = {
  pair: "BTC/USDT",
  side: "Buy",
  type: "Ladder 5",
  price: "66,400.00 / 67,200.00",
  amount: "0.1250",
  filled: "0.0500",
  time: "2026-08-02 11:10",
  status: "Running",
};

function parseNumeric(value: string) {
  return parseFloat(value.replace(/,/g, ""));
}

function filledPercent(amount: string, filled: string) {
  const a = parseNumeric(amount);
  const f = parseNumeric(filled);
  if (!a) return 0;
  return Math.min(100, Math.max(0, (f / a) * 100));
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-4 py-16">
      <div className="flex size-11 items-center justify-center rounded-full bg-secondary">
        <History className="size-5 text-muted-foreground" />
      </div>
      <p className="text-sm text-muted-foreground">No {label.toLowerCase()} yet</p>
    </div>
  );
}

/** Minimal, smooth order row — side accent, price/amount, thin fill bar. */
function OrderRow({
  o,
  onCancel,
  onClick,
  showFilled = false,
  trailing,
}: {
  o: MockOrder;
  onCancel?: () => void;
  onClick?: () => void;
  showFilled?: boolean;
  trailing?: string;
}) {
  const pct = filledPercent(o.amount, o.filled);
  const isBuy = o.side === "Buy";

  return (
    <div
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onClick();
        }
      }}
      className={`group relative overflow-hidden rounded-2xl bg-secondary/40 px-4 py-3.5 transition-all duration-200 ${
        onClick ? "cursor-pointer active:scale-[0.995] hover:bg-secondary/70" : ""
      }`}
    >
      <span
        className={`absolute inset-y-3 left-0 w-[3px] rounded-full ${isBuy ? "bg-bid" : "bg-ask"}`}
        aria-hidden
      />

      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="truncate text-[15px] font-medium text-foreground">{o.pair}</span>
            <span className={`text-[11px] font-medium ${isBuy ? "text-bid" : "text-ask"}`}>
              {o.side}
            </span>
          </div>
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            {o.type} · {o.time.slice(5)}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-[15px] font-medium tabular-nums text-foreground">{o.price}</p>
            <p className="mt-0.5 text-[11px] tabular-nums text-muted-foreground">
              {trailing ?? o.amount}
            </p>
          </div>
          {onCancel ? (
            <button
              type="button"
              aria-label={`Cancel ${o.pair} order`}
              onClick={(e) => {
                e.stopPropagation();
                onCancel();
              }}
              className="flex size-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-destructive hover:text-destructive-foreground"
            >
              <X className="size-4" />
            </button>
          ) : onClick ? (
            <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
          ) : null}
        </div>
      </div>

      {showFilled && (
        <div className="mt-3 flex items-center gap-2">
          <div className="h-[3px] flex-1 overflow-hidden rounded-full bg-border">
            <div
              className={`h-full rounded-full transition-all duration-500 ${isBuy ? "bg-bid" : "bg-ask"}`}
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className="text-[10px] tabular-nums text-muted-foreground">{pct.toFixed(0)}%</span>
        </div>
      )}
    </div>
  );
}

const STATUS_FILTERS = ["All", "Open", "Partial"] as const;
type StatusFilter = (typeof STATUS_FILTERS)[number];

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5">
      <span className="text-[12px] text-muted-foreground">{label}</span>
      <span className="text-[13px] font-medium tabular-nums text-foreground">{value}</span>
    </div>
  );
}

export function OrdersPanel() {
  const [tab, setTab] = useState<Tab>("Open Orders");
  const [ladderOpen, setLadderOpen] = useState(false);
  const [cancelledOpen, setCancelledOpen] = useState<Set<string>>(new Set());
  const [cancelledChildren, setCancelledChildren] = useState<Set<number>>(new Set());
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("All");
  const [detail, setDetail] = useState<MockOrder | null>(null);

  const openOrders = useMemo(
    () =>
      OPEN_ORDERS.filter((o) => !cancelledOpen.has(o.pair + o.price))
        .filter((o) => o.pair.toLowerCase().includes(search.trim().toLowerCase()))
        .filter((o) => status === "All" || o.status === status),
    [cancelledOpen, search, status]
  );

  const rows =
    tab === "Order History" ? ORDER_HISTORY : tab === "Trade History" ? TRADE_HISTORY : [];

  const children = LADDER_CHILDREN.filter((c) => !cancelledChildren.has(c.level));
  const filledChildren = children.filter((c) => c.status === "Filled").length;

  const cancelOrder = (o: MockOrder) => {
    setCancelledOpen((prev) => new Set(prev).add(o.pair + o.price));
    toast(`Cancelled ${o.pair} order`);
  };

  const cancelAll = () => {
    setCancelledOpen((prev) => {
      const next = new Set(prev);
      openOrders.forEach((o) => next.add(o.pair + o.price));
      return next;
    });
    toast("Cancelled all open orders");
  };

  return (
    <section className="mt-2 flex flex-col rounded-2xl bg-card">
      <div className="flex items-baseline justify-between px-4 pt-4">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">Orders</h2>
        {tab === "Open Orders" && openOrders.length > 0 && (
          <span className="text-[12px] tabular-nums text-muted-foreground">
            {openOrders.length} active
          </span>
        )}
      </div>

      {/* Segmented tabs */}
      <div className="sticky top-0 z-10 bg-card/95 px-3 py-3 backdrop-blur-sm">
        <div className="flex gap-1 overflow-x-auto rounded-2xl bg-secondary/50 p-1 scrollbar-hide">
          {TABS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`whitespace-nowrap rounded-xl px-3 py-2 text-[12.5px] transition-all duration-200 ${
                tab === t
                  ? "bg-card font-medium text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.replace(" Orders", "").replace(" History", "")}
            </button>
          ))}
        </div>
      </div>

      <div className="min-h-0 flex-1 space-y-2.5 px-3 pb-4">
        {tab === "Ladder History" ? (
          <>
            <OrderRow
              o={LADDER_PARENT}
              showFilled
              trailing={`${filledChildren}/${children.length} filled`}
              onClick={() => setLadderOpen(true)}
            />
            <Drawer open={ladderOpen} onOpenChange={setLadderOpen}>
              <DrawerContent>
                <DrawerHeader className="pb-2 text-left">
                  <DrawerTitle className="text-base">Child orders ({children.length})</DrawerTitle>
                </DrawerHeader>
                <div className="max-h-[60vh] overflow-y-auto px-4 pb-6">
                  {children.length === 0 ? (
                    <p className="py-6 text-center text-sm text-muted-foreground">
                      All child orders cancelled
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {children.map((c) => (
                        <div
                          key={c.level}
                          className="flex items-center gap-3 rounded-xl bg-secondary/50 px-3 py-3"
                        >
                          <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-card text-[10px] font-medium text-muted-foreground">
                            {c.level}
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium tabular-nums text-foreground">
                              {c.price}
                            </p>
                            <p className="mt-0.5 text-[11px] tabular-nums text-muted-foreground">
                              {c.filled} / {c.amount} · {c.status}
                            </p>
                          </div>
                          <button
                            type="button"
                            aria-label={`Cancel level ${c.level}`}
                            onClick={() => {
                              setCancelledChildren((prev) => new Set(prev).add(c.level));
                              toast(`Cancelled child order L${c.level}`);
                            }}
                            className="flex size-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-destructive hover:text-destructive-foreground"
                          >
                            <X className="size-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  {children.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        setCancelledChildren(new Set(LADDER_CHILDREN.map((c) => c.level)));
                        toast("Cancelled all child orders");
                      }}
                      className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-secondary py-3 text-sm font-medium text-ask transition-colors hover:bg-destructive hover:text-destructive-foreground"
                    >
                      <Trash2 className="size-4" />
                      Cancel All
                    </button>
                  )}
                </div>
              </DrawerContent>
            </Drawer>
          </>
        ) : tab === "Open Orders" ? (
          <>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search symbol"
                  aria-label="Search open orders by symbol"
                  className="w-full rounded-xl bg-secondary/50 py-2.5 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div className="flex rounded-xl bg-secondary/50 p-1">
                {STATUS_FILTERS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStatus(s)}
                    className={`rounded-lg px-2.5 py-1.5 text-[12px] transition-all duration-200 ${
                      status === s
                        ? "bg-card font-medium text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {openOrders.length === 0 ? (
              <EmptyState label="Open Orders" />
            ) : (
              <div className="space-y-2.5">
                {openOrders.map((o) => (
                  <OrderRow
                    key={o.pair + o.price}
                    o={o}
                    showFilled
                    onClick={() => setDetail(o)}
                    onCancel={() => cancelOrder(o)}
                  />
                ))}
              </div>
            )}

            {openOrders.length > 0 && (
              <div className="sticky bottom-0 -mx-3 bg-gradient-to-t from-card via-card to-transparent px-3 pb-2 pt-4">
                <button
                  type="button"
                  onClick={cancelAll}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-secondary/60 py-3 text-sm font-medium text-ask transition-colors hover:bg-destructive hover:text-destructive-foreground"
                >
                  <Trash2 className="size-4" />
                  Cancel All
                </button>
              </div>
            )}
          </>
        ) : rows.length === 0 ? (
          <EmptyState label={tab} />
        ) : (
          <div className="space-y-2.5">
            {rows.map((o, i) => (
              <OrderRow
                key={i}
                o={o}
                showFilled={tab === "Order History"}
                trailing={o.status}
                onClick={() => setDetail(o)}
              />
            ))}
          </div>
        )}
      </div>

      <Drawer open={!!detail} onOpenChange={(v) => !v && setDetail(null)}>
        <DrawerContent>
          <DrawerHeader className="pb-1 text-left">
            <DrawerTitle className="flex items-center gap-2 text-base">
              {detail?.pair}
              {detail && (
                <span
                  className={`text-[12px] font-medium ${
                    detail.side === "Buy" ? "text-bid" : "text-ask"
                  }`}
                >
                  {detail.side}
                </span>
              )}
            </DrawerTitle>
          </DrawerHeader>
          {detail && (
            <div className="max-h-[65vh] overflow-y-auto px-4 pb-6">
              <div className="divide-y divide-border">
                <DetailRow label="Symbol" value={detail.pair} />
                <DetailRow label="Side" value={detail.side} />
                <DetailRow label="Order type" value={detail.type} />
                <DetailRow label="Status" value={detail.status} />
                <DetailRow label="Price" value={detail.price} />
                <DetailRow label="Amount" value={detail.amount} />
                <DetailRow label="Filled" value={detail.filled} />
                <DetailRow
                  label="Filled %"
                  value={`${filledPercent(detail.amount, detail.filled).toFixed(2)}%`}
                />
                <DetailRow label="Created" value={detail.time} />
                <DetailRow label="Last updated" value={detail.time} />
                <DetailRow
                  label="Order ID"
                  value={`#${detail.pair.replace("/", "")}-${detail.time.slice(-5).replace(":", "")}`}
                />
              </div>

              {tab === "Open Orders" && (
                <button
                  type="button"
                  onClick={() => {
                    cancelOrder(detail);
                    setDetail(null);
                  }}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-secondary py-3 text-sm font-medium text-ask transition-colors hover:bg-destructive hover:text-destructive-foreground"
                >
                  <X className="size-4" />
                  Cancel Order
                </button>
              )}
            </div>
          )}
        </DrawerContent>
      </Drawer>
    </section>
  );
}
