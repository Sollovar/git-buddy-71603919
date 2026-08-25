import { ChevronLeft, X, TrendingUp, Wallet, Megaphone, ShieldCheck } from "lucide-react";
import { useState } from "react";

type Notice = {
  id: number;
  title: string;
  body: string;
  time: string;
  kind: "trade" | "wallet" | "news" | "security";
  unread: boolean;
};

const ICONS = {
  trade: TrendingUp,
  wallet: Wallet,
  news: Megaphone,
  security: ShieldCheck,
} as const;

const SEED: Notice[] = [
  {
    id: 1,
    title: "Order filled",
    body: "Your BTCUSDT limit buy of 0.05 filled at 64,120.50.",
    time: "2m ago",
    kind: "trade",
    unread: true,
  },
  {
    id: 2,
    title: "Funding payment",
    body: "You paid 0.42 USDT funding on your ETHUSDT long position.",
    time: "38m ago",
    kind: "wallet",
    unread: true,
  },
  {
    id: 3,
    title: "Price alert",
    body: "SOLUSDT moved +6.2% in the last hour.",
    time: "1h ago",
    kind: "trade",
    unread: true,
  },
  {
    id: 4,
    title: "Deposit confirmed",
    body: "500.00 USDT credited to your trading account.",
    time: "5h ago",
    kind: "wallet",
    unread: false,
  },
  {
    id: 5,
    title: "New markets listed",
    body: "TIAUSDT and JUPUSDT perpetuals are now live with up to 25x leverage.",
    time: "Yesterday",
    kind: "news",
    unread: false,
  },
  {
    id: 6,
    title: "New device sign-in",
    body: "A wallet session was started from a new browser. Not you? Revoke it in Security.",
    time: "2d ago",
    kind: "security",
    unread: false,
  },
];

export function NotificationsPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [items, setItems] = useState<Notice[]>(SEED);
  const [filter, setFilter] = useState<"All" | "Unread">("All");

  if (!open) return null;

  const shown = filter === "All" ? items : items.filter((i) => i.unread);
  const unreadCount = items.filter((i) => i.unread).length;

  return (
    <div className="fixed inset-0 z-[60] flex flex-col">
      <button
        aria-label="Close panel overlay"
        onClick={onClose}
        className="absolute inset-0 bg-foreground/30"
      />
      <div className="h-12 shrink-0" />
      <div className="relative flex flex-1 flex-col overflow-hidden rounded-t-[2rem] bg-background px-4 shadow-[0_-12px_40px_-12px_rgba(0,0,0,0.25)]">
        <div className="mx-auto mt-3 h-1 w-9 shrink-0 rounded-full bg-border" />
        <header className="flex items-center gap-3 px-1 py-4">
          <button aria-label="Back" onClick={onClose}>
            <ChevronLeft className="size-6" />
          </button>
          <h2 className="text-xl font-semibold">Notifications</h2>
          {unreadCount > 0 && (
            <span className="rounded-full bg-primary/15 px-2 py-0.5 text-xs font-medium text-primary">
              {unreadCount}
            </span>
          )}
          <button aria-label="Close notifications" onClick={onClose} className="ml-auto">
            <X className="size-5 text-muted-foreground" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-1 pb-8">
          <div className="rounded-2xl bg-card p-3 shadow-sm">
            <div className="flex items-center gap-3 border-b border-border px-2 pb-3">
              {(["All", "Unread"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`rounded-full px-3 py-1.5 text-sm transition-colors ${
                    filter === f
                      ? "bg-secondary font-medium text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {f}
                </button>
              ))}
              <button
                onClick={() => setItems((s) => s.map((i) => ({ ...i, unread: false })))}
                className="ml-auto text-sm text-primary hover:underline"
              >
                Mark all read
              </button>
            </div>

            <ul className="max-h-[55vh] overflow-y-auto">
              {shown.length === 0 ? (
                <li className="px-2 py-12 text-center text-sm text-muted-foreground">
                  You&apos;re all caught up.
                </li>
              ) : (
                shown.map((n) => {
                  const Icon = ICONS[n.kind];
                  return (
                    <li key={n.id} className="border-b border-border/60 last:border-0">
                      <button
                        onClick={() =>
                          setItems((s) => s.map((i) => (i.id === n.id ? { ...i, unread: false } : i)))
                        }
                        className="flex w-full gap-3 px-2 py-3.5 text-left transition-colors hover:bg-secondary/50"
                      >
                        <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary">
                          <Icon className="size-4 text-muted-foreground" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="flex items-center gap-2">
                            <span className="truncate text-sm font-medium">{n.title}</span>
                            {n.unread && <span className="size-1.5 shrink-0 rounded-full bg-primary" />}
                            <span className="ml-auto shrink-0 text-xs text-muted-foreground">
                              {n.time}
                            </span>
                          </span>
                          <span className="mt-0.5 block text-xs leading-snug text-muted-foreground">
                            {n.body}
                          </span>
                        </span>
                      </button>
                    </li>
                  );
                })
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
