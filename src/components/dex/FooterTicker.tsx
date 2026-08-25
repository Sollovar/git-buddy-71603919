import { SignalHigh, Filter, Twitter, MessageCircle, Send } from "lucide-react";

const news = [
  "Small Amount Exchange Now Available on Spot",
  "0% Fee on USDC ⇄ USDT for 30 Days",
  "Migrate to Aster Pro API | V1 API Sunset Notice",
  "Staking is live on Aster Chain",
];

export function FooterTicker() {
  return (
    <footer className="flex h-[42px] items-center gap-6 bg-background px-4 text-[14.5px]">
      <span className="flex shrink-0 items-center gap-2 text-up">
        <SignalHigh className="h-4 w-4" />
        Connected 451ms
      </span>
      <Filter className="h-4 w-4 shrink-0 text-muted-foreground" />
      <span className="shrink-0 tabular-nums tracking-tight text-muted-foreground">6, 00:00 UTC</span>
      <div className="group relative flex min-w-0 flex-1 overflow-hidden">
        <div className="flex shrink-0 animate-[ticker_38s_linear_infinite] items-center gap-10 pr-10 group-hover:[animation-play-state:paused]">
          {news.map((n) => (
            <span key={n} className="shrink-0 whitespace-nowrap">
              {n}
            </span>
          ))}
        </div>
        <div
          aria-hidden
          className="flex shrink-0 animate-[ticker_38s_linear_infinite] items-center gap-10 pr-10 group-hover:[animation-play-state:paused]"
        >
          {news.map((n) => (
            <span key={n} className="shrink-0 whitespace-nowrap">
              {n}
            </span>
          ))}
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-4 text-muted-foreground">
        <Twitter className="h-4 w-4" />
        <MessageCircle className="h-4 w-4" />
        <Send className="h-4 w-4" />
      </div>
    </footer>
  );
}