import { Info, Gauge } from "lucide-react";

const equity = [
  ["Spot Total Value", "--", false],
  ["Perp Total Value", "--", false],
  ["Perpetuals Unrealized Pnl", "--", true],
] as const;

export function AccountPanel() {
  return (
    <section className="flex h-full w-[280px] shrink-0 flex-col overflow-hidden bg-background px-4 py-4">
      <div className="grid grid-cols-3 gap-2">
        {["Deposit", "Withdraw", "Transfer"].map((b) => (
          <button
            key={b}
            className={`rounded-xl py-2 text-[13.5px] font-medium ${
              b === "Deposit"
                ? "bg-gold [background-image:var(--gradient-gold)] text-primary-foreground"
                : "border border-border bg-panel"
            }`}
          >
            {b}
          </button>
        ))}
      </div>

      <div className="mt-4 text-[15px] font-semibold">Account Equity</div>
      <div className="mt-2 space-y-2.5 text-[14px]">
        {equity.map(([l, v, dotted]) => (
          <div key={l} className="flex items-center justify-between">
            <span
              className={`text-muted-foreground ${
                dotted ? "underline decoration-dotted underline-offset-4" : ""
              }`}
            >
              {l}
            </span>
            <span className="tabular-nums tracking-tight text-muted-foreground">{v}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 text-[15px] font-semibold">Margin</div>
      <div className="mt-2 space-y-2.5 text-[14px]">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground underline decoration-dotted underline-offset-4">
            Account Margin Ratio
          </span>
          <span className="flex items-center gap-1.5 tabular-nums tracking-tight text-up">
            <Gauge className="h-4 w-4" />
            0.00%
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground underline decoration-dotted underline-offset-4">
            Account Maintenance Margin
          </span>
          <span className="text-muted-foreground">--</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-muted-foreground underline decoration-dotted underline-offset-4">
            Account Equity <Info className="h-3.5 w-3.5" />
          </span>
          <span className="text-muted-foreground">--</span>
        </div>
      </div>

      <button className="mt-4 w-full rounded-xl border border-border bg-panel py-2.5 text-[14px] font-medium">
        Multi-Asset Mode
      </button>
    </section>
  );
}
