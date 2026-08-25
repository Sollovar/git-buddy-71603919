import { Link2 } from "lucide-react";

const tabs = [
  "Open Orders", "Positions", "Predictions", "Assets",
  "Order History", "Trade History", "Transaction History",
];

export function PositionsPanel() {
  return (
    <section className="flex h-full min-w-0 flex-1 flex-col overflow-hidden bg-background">
      <div className="flex items-center gap-1 border-b border-border px-2 text-[14.5px]">
        {tabs.map((t) => (
          <button
            key={t}
            className={`px-4 py-3 ${
              t === "Positions"
                ? "rounded-t-lg bg-panel font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="flex flex-1 flex-col items-center justify-center gap-4 py-10">
        <div className="grid h-[86px] w-[86px] place-items-center rounded-full bg-panel">
          <Link2 className="h-8 w-8 text-muted-foreground" />
        </div>
        <p className="text-[15px] text-muted-foreground">Enable trading to open positions.</p>
      </div>
    </section>
  );
}
