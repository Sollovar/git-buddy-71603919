import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { ArrowUpRight, Gauge, Layers, Radio, ShieldCheck, Waves } from "lucide-react";
import logoMark from "@/assets/logo-mark.png";
import { CoinOrbit } from "@/components/landing/CoinOrbit";
import { Footer } from "@/components/landing/Footer";
import { Globe } from "@/components/landing/Globe";
import { GlyphMatrix } from "@/components/landing/GlyphMatrix";
import { Partners } from "@/components/landing/Partners";
import { RetroGrid } from "@/components/landing/RetroGrid";
import { WhyVellum } from "@/components/landing/WhyVellum";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/landing")({
  head: () => ({
    meta: [
      { title: "Vellum — Premium Crypto Order Book & Liquidity Terminal" },
      {
        name: "description",
        content:
          "Vellum is a premium crypto order book terminal: microsecond depth streaming, aggregated liquidity across venues, and institutional-grade execution.",
      },
      { property: "og:title", content: "Vellum — Premium Crypto Order Book" },
      {
        property: "og:description",
        content:
          "Microsecond depth streaming, aggregated liquidity, and institutional-grade execution in one refined terminal.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/landing" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const ease = [0.22, 1, 0.36, 1] as const;

const rise = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease, delay: i * 0.08 },
  }),
};

const features = [
  {
    icon: Radio,
    title: "Microsecond depth",
    body: "Every level streamed as it prints. No throttling, no sampled snapshots, no guesswork.",
  },
  {
    icon: Layers,
    title: "Aggregated books",
    body: "Twenty-two venues collapsed into one ladder, normalised by price and true size.",
  },
  {
    icon: Gauge,
    title: "Latency you can feel",
    body: "Co-located ingest with a p99 of 4.1ms from venue tape to your rendered row.",
  },
  {
    icon: Waves,
    title: "Liquidity heatmap",
    body: "Resting size decays visually, so absorption and spoofing surface on their own.",
  },
  {
    icon: ShieldCheck,
    title: "Custody-neutral",
    body: "Read-only keys, per-desk scopes, and signed audit trails on every routed order.",
  },
  {
    icon: ArrowUpRight,
    title: "Smart routing",
    body: "Slice across books with participation caps tuned to live depth, not stale averages.",
  },
];

const stats = [
  { value: "$41B", label: "Monthly notional routed" },
  { value: "4.1ms", label: "p99 tape-to-screen" },
  { value: "22", label: "Venues aggregated" },
  { value: "99.99%", label: "Streaming uptime" },
];

function Index() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const glowY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const heroFade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <main className="landing-shell relative overflow-hidden">
      {/* ambient cream glows */}
      <motion.div
        aria-hidden
        style={{ y: glowY }}
        className="pointer-events-none absolute -left-40 -top-40 h-[34rem] w-[34rem] rounded-full bg-cream/70 blur-3xl"
      />
      <div
        aria-hidden
        className="float-slow pointer-events-none absolute right-[-12rem] top-40 h-[28rem] w-[28rem] rounded-full bg-cream/50 blur-3xl"
      />

      <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-6">
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease }}
          className="flex items-center gap-2.5"
        >
          <img src={logoMark} alt="Vellum logo" width={44} height={44} className="h-11 w-11" />
          <span className="font-display text-base font-semibold tracking-tight">Vellum</span>
        </motion.div>
        <motion.nav
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.15 }}
          className="hidden items-center gap-8 text-sm text-foreground/60 md:flex"
        >
          {["Depth", "Routing", "Coverage", "Desk"].map((item) => (
            <a key={item} href="#platform" className="story-link transition-colors hover:text-foreground">
              {item}
            </a>
          ))}
        </motion.nav>
        <Button asChild size="sm" className="rounded-full px-5">
          <Link to="/">Request access</Link>
        </Button>
      </header>

      {/* Hero */}
      <section ref={heroRef} className="relative z-10 mx-auto w-full max-w-6xl px-5 pb-20 pt-10 sm:pt-16">
        <RetroGrid
          className="-z-10 [mask-image:radial-gradient(90%_70%_at_50%_20%,#000,transparent)] text-foreground/60"
          opacity={0.5}
        />
        <motion.div style={{ opacity: heroFade }} className="grid gap-12 lg:grid-cols-[1.05fr_1fr] lg:items-center">
          <div>
            <motion.span
              variants={rise}
              custom={0}
              initial="hidden"
              animate="show"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-cream/70 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-foreground/60"
            >
              Institutional order flow
            </motion.span>

            <h1 className="mt-6 font-display text-[2.6rem] leading-[1.03] sm:text-6xl">
              {["The order book,", "rendered like", "a fine instrument."].map((line, i) => (
                <motion.span
                  key={line}
                  variants={rise}
                  custom={i + 1}
                  initial="hidden"
                  animate="show"
                  className="block"
                >
                  {i === 2 ? <em className="not-italic text-accent-foreground/70">{line}</em> : line}
                </motion.span>
              ))}
            </h1>

            <motion.p
              variants={rise}
              custom={4}
              initial="hidden"
              animate="show"
              className="mt-6 max-w-md text-base leading-relaxed text-foreground/60"
            >
              Vellum streams raw depth from twenty-two venues into a single calm ladder — every
              resting bid, every thinning ask, at the speed the tape actually moves.
            </motion.p>

            <motion.div
              variants={rise}
              custom={5}
              initial="hidden"
              animate="show"
              className="mt-9 flex flex-wrap items-center gap-3"
            >
              <Button asChild size="lg" className="rounded-full px-7 shadow-soft">
                <Link to="/">Open the terminal</Link>
              </Button>
              <a
                href="#platform"
                className="inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
              >
                See the depth engine <ArrowUpRight className="h-4 w-4" />
              </a>
            </motion.div>
          </div>

          <Globe />
        </motion.div>
      </section>

      {/* Stats */}
      <section className="relative z-10 mx-auto w-full max-w-6xl px-5 pb-24">
        <div className="glass-cream relative grid grid-cols-2 gap-y-8 overflow-hidden rounded-3xl px-6 py-8 sm:grid-cols-4">
          <GlyphMatrix
            className="opacity-[0.22]"
            cellSize={13}
            interval={110}
            color="oklch(0.505 0.024 65)"
            fadeBottom={0.75}
          />
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease, delay: i * 0.08 }}
              className="relative text-center"
            >
              <div className="tabular text-2xl font-semibold sm:text-3xl">{s.value}</div>
              <div className="mt-1.5 text-[11px] uppercase tracking-[0.14em] text-foreground/60">
                {s.label}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <Partners />

      <WhyVellum />

      {/* Meme coin orbit */}
      <section className="relative z-10 mx-auto w-full max-w-6xl px-5 pb-24">
        <div className="glass-cream relative grid items-center gap-10 overflow-hidden rounded-3xl px-6 py-12 sm:px-10 lg:grid-cols-[1fr_1.1fr]">
          <GlyphMatrix
            className="opacity-[0.18]"
            cellSize={16}
            interval={120}
            mutationRate={0.03}
            color="oklch(0.505 0.024 65)"
          />
          <div className="relative">
            <motion.span
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease }}
              className="inline-flex items-center rounded-full border border-border bg-cream/70 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-foreground/60"
            >
              Long tail coverage
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease, delay: 0.06 }}
              className="mt-5 font-display text-3xl leading-tight sm:text-4xl"
            >
              Every memecoin book, orbiting one engine.
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease, delay: 0.12 }}
              className="mt-4 max-w-md text-sm leading-relaxed text-foreground/60"
            >
              DOGE to the newest launch — Vellum pulls thin, fast-moving meme liquidity into the same
              normalised ladder as majors, so you can size a fill before the crowd sees the wick.
            </motion.p>
          </div>
          <CoinOrbit />
        </div>
      </section>

      {/* Features */}
      <section id="platform" className="relative z-10 mx-auto w-full max-w-6xl px-5 pb-24">
        <GlyphMatrix
          className="opacity-[0.14] [mask-image:radial-gradient(75%_65%_at_50%_35%,black,transparent)]"
          cellSize={18}
          interval={140}
          mutationRate={0.025}
          color="oklch(0.505 0.024 65)"
        />
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease }}
          className="max-w-xl font-display text-3xl leading-tight sm:text-4xl"
        >
          Built for desks that read liquidity, not charts.
        </motion.h2>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <motion.article
              key={f.title}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, ease, delay: (i % 3) * 0.1 }}
              whileHover={{ y: -6 }}
              className="glass-cream group rounded-2xl p-6"
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-foreground/80 transition-transform duration-300 group-hover:scale-110">
                <f.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-5 text-base font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-foreground/60">{f.body}</p>
            </motion.article>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 mx-auto w-full max-w-6xl px-5 pb-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease }}
          className="glass-cream relative overflow-hidden rounded-3xl px-6 py-14 text-center sm:px-14"
        >
          <GlyphMatrix
            className="opacity-[0.2]"
            cellSize={15}
            interval={100}
            color="oklch(0.505 0.024 65)"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-24 left-1/2 h-64 w-[36rem] -translate-x-1/2 rounded-full bg-sand-deep/50 blur-3xl"
          />
          <h2 className="relative font-display text-3xl leading-tight sm:text-4xl">
            Trade the book, not the candle.
          </h2>
          <p className="relative mx-auto mt-4 max-w-md text-sm leading-relaxed text-foreground/60">
            Access is opened desk by desk. Tell us your venues and we'll provision a keyed terminal
            within a day.
          </p>
          <div className="relative mt-8 flex flex-wrap justify-center gap-3">
            <Button size="lg" className="rounded-full px-7">
              Request access
            </Button>
            <Button size="lg" variant="outline" className="rounded-full border-border px-7">
              Talk to the desk
            </Button>
          </div>
        </motion.div>
      </section>

      <Footer />
    </main>
  );
}
