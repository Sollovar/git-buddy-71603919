import { Activity, Bell, CalendarClock, MessageSquare, TrendingDown, Wallet } from "lucide-react";

const notifications = [
  {
    icon: Activity,
    tint: "bg-[oklch(0.62_0.19_15)]",
    title: "Order filled",
    body: "Your limit buy of 0.35 BTCUSDT filled at 63,480.20.",
    time: "2m",
    unread: true,
  },
  {
    icon: TrendingDown,
    tint: "bg-[oklch(0.6_0.16_28)]",
    title: "Liquidation warning",
    body: "ETHUSDT long is 4.2% away from liquidation price.",
    time: "14m",
    unread: true,
  },
  {
    icon: Wallet,
    tint: "bg-[oklch(0.66_0.13_75)]",
    title: "Deposit confirmed",
    body: "2,500.00 USDT credited to your perp account.",
    time: "1h",
    unread: false,
  },
  {
    icon: CalendarClock,
    tint: "bg-[oklch(0.6_0.11_250)]",
    title: "Funding settled",
    body: "You received 1.84 USDT from the 08:00 funding round.",
    time: "3h",
    unread: false,
  },
  {
    icon: MessageSquare,
    tint: "bg-[oklch(0.62_0.13_300)]",
    title: "Referral reward",
    body: "A friend joined with your code — 25 Aster points added.",
    time: "1d",
    unread: false,
  },
];

export function NotificationsPanel() {
  return (
    <div className="px-7 pb-7 pt-6">
      <div className="flex items-center gap-3">
        <div className="grid h-9 w-9 place-items-center rounded-xl bg-gold [background-image:var(--gradient-gold)] text-primary-foreground">
          <Bell className="h-[18px] w-[18px]" />
        </div>
        <div>
          <h2 className="text-[26px] font-semibold leading-tight">Notifications</h2>
          <p className="text-[13px] text-muted-foreground">
            Stay updated with important alerts, fills, and account activity.
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-1">
        {notifications.map((n) => (
          <button
            key={n.title}
            className="flex w-full items-start gap-4 rounded-2xl px-3 py-4 text-left transition-colors hover:bg-panel-2"
          >
            <span className={`mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl ${n.tint} text-white`}>
              <n.icon className="h-[18px] w-[18px]" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex items-center gap-2">
                <span className="text-[15px] font-semibold">{n.title}</span>
                {n.unread && <span className="h-1.5 w-1.5 rounded-full bg-gold-strong" />}
              </span>
              <span className="mt-0.5 block truncate text-[13px] text-muted-foreground">{n.body}</span>
            </span>
            <span className="mt-1 shrink-0 text-[12px] text-muted-foreground">{n.time}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
