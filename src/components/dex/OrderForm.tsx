import { useMemo, useState } from "react";
import { ChevronDown, PlusCircle, Wallet } from "lucide-react";
import { toast } from "sonner";

type Mode = "market" | "limit" | "ladder";

function fmt(v: number, d: number) {
  if (!Number.isFinite(v)) return "--";
  return v.toLocaleString(undefined, { minimumFractionDigits: d, maximumFractionDigits: d });
}

function decimalsOf(v: string) {
  const parts = v.split(".");
  return parts.length > 1 ? Math.min(parts[1]!.length, 6) : 1;
}

export function OrderForm() {
  const [mode, setMode] = useState<Mode>("limit");
  const [side, setSide] = useState<"buy" | "sell">("buy");
  const [tpsl, setTpsl] = useState(false);
  const [levels, setLevels] = useState("10");
  const [priceStart, setPriceStart] = useState("");
  const [priceEnd, setPriceEnd] = useState("");
  const [size, setSize] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);

  const pricePrecision = Math.max(decimalsOf(priceStart), decimalsOf(priceEnd));

  const ladderRows = useMemo(() => {
    if (mode !== "ladder") return [];
    const start = Number(priceStart);
    const end = Number(priceEnd);
    const n = Math.floor(Number(levels));
    const notional = Number(size);
    if (!(start > 0) || !(end > 0) || !(n >= 1) || n > 50 || !(notional > 0)) return [];
    const step = n === 1 ? 0 : (end - start) / (n - 1);
    const valuePer = notional / n;
    return Array.from({ length: n }, (_, i) => {
      const price = start + step * i;
      return { price, qty: valuePer / price, value: valuePer };
    });
  }, [mode, priceStart, priceEnd, levels, size]);

  const ladderValue = ladderRows.reduce((s, r) => s + r.value, 0);
  const ladderQty = ladderRows.reduce((s, r) => s + r.qty, 0);


  const tab = (m: Mode, label: string) =>
    m === mode ? (
      <button
        key={m}
        onClick={() => setMode(m)}
        className="border-b-2 border-gold-strong py-[11px] font-semibold"
      >
        {label}
      </button>
    ) : (
      <button key={m} onClick={() => setMode(m)} className="py-[11px] text-muted-foreground">
        {label}
      </button>
    );

  return (
    <section className="no-scrollbar flex h-full w-[280px] shrink-0 flex-col overflow-y-auto bg-background">
      <div className="grid grid-cols-3 border-b border-border text-[15.5px]">
        {tab("market", "Market")}
        {tab("limit", "Limit")}
        {tab("ladder", "Ladder")}
      </div>

      <div className="flex items-center gap-2 px-4 py-3 text-[14px]">
        <span className="text-muted-foreground">Avbl</span>
        <span className="tabular-nums tracking-tight">0.00 USDT</span>
        <PlusCircle className="h-4 w-4 text-muted-foreground" />
      </div>

      <div className="grid grid-cols-2 gap-2 px-4">
        <button
          onClick={() => setSide("buy")}
          className={`rounded-xl border py-2 text-[14.5px] font-semibold transition-colors ${
            side === "buy"
              ? "border-up bg-up/15 text-up"
              : "border-border bg-panel text-muted-foreground"
          }`}
        >
          Buy
        </button>
        <button
          onClick={() => setSide("sell")}
          className={`rounded-xl border py-2 text-[14.5px] font-semibold transition-colors ${
            side === "sell"
              ? "border-down bg-down/15 text-down"
              : "border-border bg-panel text-muted-foreground"
          }`}
        >
          Sell
        </button>
      </div>

      <div className="mt-2.5 px-4">
        {mode === "limit" && (
          <div className="flex items-center rounded-xl border border-border bg-panel px-3 py-2.5">
            <input
              defaultValue="61789.0"
              className="min-w-0 flex-1 bg-transparent tabular-nums tracking-tight text-[15px] outline-none"
            />
            <span className="px-2.5 text-[13px] text-muted-foreground">USDT</span>
            <span className="h-5 w-px bg-border" />
            <span className="pl-2.5 text-[13px] font-medium">BBO</span>
          </div>
        )}

        {mode === "ladder" && (
          <div className="space-y-2">
            <div className="flex items-center rounded-xl border border-border bg-panel px-3 py-2.5">
              <input
                value={priceStart}
                onChange={(e) => setPriceStart(e.target.value)}
                placeholder="Price Start"
                className="min-w-0 flex-1 bg-transparent tabular-nums tracking-tight text-[14px] outline-none placeholder:text-muted-foreground"
              />
              <span className="pl-2.5 text-[13px] text-muted-foreground">USDT</span>
            </div>
            <div className="flex items-center rounded-xl border border-border bg-panel px-3 py-2.5">
              <input
                value={priceEnd}
                onChange={(e) => setPriceEnd(e.target.value)}
                placeholder="Price End"
                className="min-w-0 flex-1 bg-transparent tabular-nums tracking-tight text-[14px] outline-none placeholder:text-muted-foreground"
              />

              <span className="pl-2.5 text-[13px] text-muted-foreground">USDT</span>
            </div>
            <div className="flex items-center rounded-xl border border-border bg-panel px-3 py-2.5">
              <input
                type="number"
                min={1}
                max={50}
                value={levels}
                onChange={(e) => setLevels(e.target.value)}
                placeholder="Levels"
                className="min-w-0 flex-1 bg-transparent tabular-nums tracking-tight text-[14px] outline-none placeholder:text-muted-foreground"
              />
              <span className="pl-2.5 text-[13px] text-muted-foreground">Levels 1-50</span>
            </div>
          </div>
        )}

        <div className="mt-2 flex items-center rounded-xl border border-border bg-panel px-3 py-2.5">
          <input
            value={size}
            onChange={(e) => setSize(e.target.value)}
            placeholder="Size"
            className="min-w-0 flex-1 bg-transparent tabular-nums tracking-tight text-[14px] outline-none placeholder:text-muted-foreground"
          />

          <button className="flex items-center gap-1 text-[13px] text-muted-foreground">
            USDT <ChevronDown className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="relative mt-5 mb-3 h-1 rounded-full bg-panel-2">
          <div className="absolute -top-[5px] left-0 h-[14px] w-[14px] rounded-full border-2 border-gold-strong bg-background" />
          {[25, 50, 75, 100].map((p) => (
            <span
              key={p}
              className="absolute -top-[2px] h-[6px] w-[6px] -translate-x-1/2 rotate-45 bg-panel-2"
              style={{ left: `${p}%` }}
            />
          ))}
        </div>

        <div className="space-y-3 py-1 text-[14px]">
          <button onClick={() => setTpsl((v) => !v)} className="flex items-center gap-2">
            <span
              className={`h-4 w-4 rounded-sm border ${
                tpsl ? "border-gold-strong bg-gold" : "border-border bg-panel"
              }`}
            />
            <span className="underline decoration-dotted underline-offset-4">TP/SL</span>
          </button>

          {tpsl && (
            <div className="space-y-2">
              <div className="flex items-center rounded-xl border border-border bg-panel px-3 py-2.5">
                <input
                  placeholder="TP Price Trigger"
                  className="min-w-0 flex-1 bg-transparent tabular-nums tracking-tight text-[14px] outline-none placeholder:text-muted-foreground"
                />
                <span className="pl-2.5 text-[13px] text-muted-foreground">USDT</span>
              </div>
              <div className="flex items-center rounded-xl border border-border bg-panel px-3 py-2.5">
                <input
                  placeholder="SL Price Trigger"
                  className="min-w-0 flex-1 bg-transparent tabular-nums tracking-tight text-[14px] outline-none placeholder:text-muted-foreground"
                />
                <span className="pl-2.5 text-[13px] text-muted-foreground">USDT</span>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2">
              <span className="h-4 w-4 rounded-sm border border-border bg-panel" />
              <span className="underline decoration-dotted underline-offset-4">Post Only</span>
            </label>
            <button className="flex items-center gap-1 text-muted-foreground">
              GTC <ChevronDown className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {mode === "ladder" && (
          <>
            <button
              onClick={() => setPreviewOpen(true)}
              disabled={ladderRows.length === 0}
              className="mt-3 w-full rounded-2xl border border-border bg-panel py-2.5 text-[14px] font-medium disabled:opacity-50"
            >
              Preview ladder order
            </button>

            {ladderRows.length > 0 && (
              <div className="mt-3 rounded-2xl border border-border bg-panel px-3 py-2.5">
                <div className="flex items-center justify-between text-[13px] text-muted-foreground">
                  <span>{ladderRows.length} levels</span>
                  <span className="tabular-nums">
                    {fmt(ladderRows[0]!.price, pricePrecision)} →{" "}
                    {fmt(ladderRows[ladderRows.length - 1]!.price, pricePrecision)}
                  </span>
                </div>
                <div className="mt-2 flex items-center justify-between text-[13px]">
                  <span className="text-muted-foreground">Qty / level</span>
                  <span className="tabular-nums">{fmt(ladderRows[0]!.qty, 5)}</span>
                </div>
              </div>
            )}
          </>
        )}

        <button className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-3 text-[15px] font-semibold text-primary-foreground shadow-[var(--shadow-panel)]">
          <Wallet className="h-4 w-4 shrink-0" />
          Connect Wallet
        </button>

        <div className="mt-5 rounded-2xl border border-border bg-panel px-3 py-2.5">
          <div className="flex items-center justify-between text-[14px]">
            <span className="text-muted-foreground">Order Value</span>
            <span className="tabular-nums tracking-tight font-medium">
              {mode === "ladder" ? fmt(ladderValue, 2) : "0.00"} USDT
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between text-[13px]">
            <span className="text-muted-foreground">Est. Fee</span>
            <span className="tabular-nums tracking-tight text-muted-foreground">
              {mode === "ladder" ? fmt(ladderValue * 0.0005, 2) : "0.00"} USDT
            </span>
          </div>
        </div>
      </div>

      {previewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <button
            aria-label="Close ladder preview"
            onClick={() => setPreviewOpen(false)}
            className="absolute inset-0 bg-black/50"
          />
          <div className="relative w-[420px] max-w-[92vw] rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-panel)]">
            <h2 className="text-[15px] font-semibold">
              Ladder preview · {side === "buy" ? "Buy" : "Sell"}
            </h2>
            <p className="mt-1 text-[12px] text-muted-foreground">
              {ladderRows.length} levels · {fmt(ladderQty, 5)} qty · {fmt(ladderValue, 2)} USDT
            </p>
            <div className="mt-3 flex justify-between px-1 pb-1 text-[11px] text-muted-foreground">
              <span>Price</span>
              <span>Qty</span>
              <span>Value (USDT)</span>
            </div>
            <div className="max-h-72 space-y-1 overflow-y-auto">
              {ladderRows.map((l, i) => (
                <div
                  key={i}
                  className="flex justify-between rounded-lg bg-panel px-2 py-1.5 text-[12px] tabular-nums"
                >
                  <span className={side === "buy" ? "text-up" : "text-down"}>
                    {fmt(l.price, pricePrecision)}
                  </span>
                  <span>{fmt(l.qty, 5)}</span>
                  <span>{fmt(l.value, 2)}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setPreviewOpen(false)}
                className="flex-1 rounded-xl border border-border bg-panel py-2.5 text-[14px] font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setPreviewOpen(false);
                  toast(
                    `Ladder ${side} confirmed · ${ladderRows.length} levels · ${fmt(ladderValue, 2)} USDT`,
                  );
                }}
                className={`flex-1 rounded-xl py-2.5 text-[14px] font-semibold text-white ${
                  side === "buy" ? "bg-up" : "bg-down"
                }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

