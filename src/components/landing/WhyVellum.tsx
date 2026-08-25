import { motion } from "motion/react";
import { Globe, ShieldCheck, TrendingUp, Code2 } from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as const;

const features = [
  {
    icon: Globe,
    title: "Universal Access",
    body: "One account. Unlock every market — spot, perps, and on-chain venues from a single terminal.",
  },
  {
    icon: ShieldCheck,
    title: "Native Privacy",
    body: "Read-only API keys, per-desk scopes, and signed audit trails keep your flow visible only to you.",
  },
  {
    icon: TrendingUp,
    title: "Capital Efficiency",
    body: "Cross-margin aware routing that sizes fills against live depth, not stale averages.",
  },
  {
    icon: Code2,
    title: "Open Composability",
    body: "Built to be built on. Stream normalized books via WebSocket or REST into your own systems.",
  },
];

function OrderBookMockup() {
  const tabs = ["Chart", "Order Book", "Trades", "Depth", "Details"];
  const rows = [
    { bidSize: "167.34K", bidPrice: "64,838.1", askPrice: "64,838.2", askSize: "35.33K" },
    { bidSize: "262.85K", bidPrice: "64,837.9", askPrice: "64,839.8", askSize: "36.30K" },
    { bidSize: "282.95K", bidPrice: "64,837.2", askPrice: "64,840.8", askSize: "57.31K" },
    { bidSize: "473.44K", bidPrice: "64,836.8", askPrice: "64,840.9", askSize: "77.02K" },
    { bidSize: "498.40K", bidPrice: "64,836.6", askPrice: "64,841.0", askSize: "101.99K" },
    { bidSize: "523.36K", bidPrice: "64,836.5", askPrice: "64,841.1", askSize: "126.95K" },
    { bidSize: "543.46K", bidPrice: "64,835.9", askPrice: "64,841.6", askSize: "147.31K" },
    { bidSize: "600.32K", bidPrice: "64,835.2", askPrice: "64,841.7", askSize: "196.72K" },
    { bidSize: "620.42K", bidPrice: "64,835.0", askPrice: "64,841.8", askSize: "228.30K" },
    { bidSize: "790.80K", bidPrice: "64,832.9", askPrice: "64,842.2", askSize: "435.73K" },
  ];

  return (
    <div className="w-full max-w-5xl overflow-hidden rounded-2xl border border-border/50 bg-cream/80 p-5 shadow-2xl">
      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-border/40 pb-3">
        {tabs.map((tab) => (
          <span
            key={tab}
            className={`rounded-md px-2.5 py-1 text-[10px] font-medium tracking-wide ${
              tab === "Order Book" ? "text-foreground" : "text-muted-foreground"
            }`}
          >
            {tab}
          </span>
        ))}
        <span className="ml-auto flex items-center gap-2 text-[10px] text-muted-foreground">
          <span>0.1</span>
          <span>USDT</span>
        </span>
      </div>

      {/* Header */}
      <div className="mt-3 grid grid-cols-[1fr_1fr_1fr_1fr] gap-2 text-[10px] uppercase tracking-wider text-muted-foreground">
        <span>Total (USDT)</span>
        <span className="text-right">Price (USDT)</span>
        <span className="text-left">Price (USDT)</span>
        <span className="text-right">Total (USDT)</span>
      </div>

      {/* Rows */}
      <div className="mt-2 space-y-1">
        {rows.map((row, i) => (
          <div
            key={i}
            className="grid grid-cols-[1fr_1fr_1fr_1fr] gap-2 text-[11px] tabular"
          >
            <span className="text-muted-foreground">{row.bidSize}</span>
            <span className="text-right text-bid">{row.bidPrice}</span>
            <span className="text-left text-ask">{row.askPrice}</span>
            <span className="text-right text-muted-foreground">{row.askSize}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function FeatureIcon({ icon: Icon }: { icon: typeof Globe }) {
  return (
    <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cream/80 backdrop-blur-sm shadow-soft">
      <div className="absolute inset-0 rounded-xl border border-bronze/40 bg-gradient-to-br from-bronze/20 via-bronze/10 to-transparent" />
      <Icon className="relative z-10 h-5 w-5 text-bronze" strokeWidth={1.8} />
    </div>
  );
}

export function WhyVellum() {
  return (
    <section className="relative overflow-hidden bg-background py-24 sm:py-32">
      {/* Ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[28rem] w-[36rem] -translate-x-1/2 rounded-full bg-bronze/15 blur-[100px]"
      />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-5">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease }}
          className="text-center"
        >
          <h2 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Why Vellum
          </h2>
        </motion.div>

        {/* Content stack */}
        <div className="relative mt-16">
          {/* Background order book mockup */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 -top-24 flex justify-center sm:-top-32"
          >
            <div className="w-full max-w-5xl scale-105 opacity-40">
              <OrderBookMockup />
            </div>
          </div>

          {/* Foreground features */}
          <div className="relative z-10 mx-auto grid max-w-md gap-6 pt-16">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.7, ease, delay: i * 0.1 }}
                className="flex items-start gap-4 rounded-2xl border border-border/50 bg-card/70 p-4 shadow-soft backdrop-blur-md"
              >
                <FeatureIcon icon={feature.icon} />
                <div>
                  <h3 className="text-base font-semibold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {feature.body}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
