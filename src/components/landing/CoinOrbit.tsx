import { motion } from "motion/react";
import { OrbitPath, OrbitingCircles } from "./OrbitingCircles";

type Coin = { symbol: string; label: string; tint: string };

const inner: Coin[] = [
  { symbol: "DOGE", label: "Dogecoin", tint: "coin-doge" },
  { symbol: "PEPE", label: "Pepe", tint: "coin-pepe" },
  { symbol: "SHIB", label: "Shiba Inu", tint: "coin-shib" },
];

const outer: Coin[] = [
  { symbol: "BONK", label: "Bonk", tint: "coin-bonk" },
  { symbol: "WIF", label: "dogwifhat", tint: "coin-wif" },
  { symbol: "FLOKI", label: "Floki", tint: "coin-floki" },
  { symbol: "BRETT", label: "Brett", tint: "coin-brett" },
];

function CoinBadge({ coin, size }: { coin: Coin; size: number }) {
  return (
    <span
      title={coin.label}
      className={`${coin.tint} flex items-center justify-center rounded-full border border-white/70 shadow-soft`}
      style={{ width: size, height: size }}
    >
      <span
        className="tabular font-semibold leading-none"
        style={{ fontSize: coin.symbol.length > 4 ? size * 0.21 : size * 0.26 }}
      >
        {coin.symbol}
      </span>
    </span>
  );
}

export function CoinOrbit() {
  const innerR = 88;
  const outerR = 152;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      className="relative mx-auto h-[22rem] w-full max-w-lg sm:h-[26rem]"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cream/70 blur-3xl"
      />
      <OrbitPath radius={innerR} />
      <OrbitPath radius={outerR} />

      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
        <div className="font-display text-3xl leading-none sm:text-4xl">Meme</div>
        <div className="mt-1 text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
          Liquidity
        </div>
      </div>

      {inner.map((coin, i) => (
        <OrbitingCircles
          key={coin.symbol}
          radius={innerR}
          duration={26}
          delay={-(26 / inner.length) * i}
          iconSize={46}
        >
          <CoinBadge coin={coin} size={46} />
        </OrbitingCircles>
      ))}

      {outer.map((coin, i) => (
        <OrbitingCircles
          key={coin.symbol}
          radius={outerR}
          duration={34}
          delay={-(34 / outer.length) * i}
          iconSize={52}
          reverse
        >
          <CoinBadge coin={coin} size={52} />
        </OrbitingCircles>
      ))}
    </motion.div>
  );
}
