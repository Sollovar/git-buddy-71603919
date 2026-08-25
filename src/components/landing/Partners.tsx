import { motion } from "motion/react";
import {
  AerodromeLogo,
  MeteoraLogo,
  OrcaLogo,
  PancakeSwapLogo,
  PumpSwapLogo,
  RaydiumLogo,
  UniswapLogo,
} from "./PartnerLogos";
import { LogoMarquee } from "./LogoMarquee";

const partners = [
  { name: "PancakeSwap", Logo: PancakeSwapLogo },
  { name: "Uniswap", Logo: UniswapLogo },
  { name: "Aerodrome", Logo: AerodromeLogo },
  { name: "PumpSwap", Logo: PumpSwapLogo },
  { name: "Raydium", Logo: RaydiumLogo },
  { name: "Meteora", Logo: MeteoraLogo },
  { name: "Orca", Logo: OrcaLogo },
];

const ease = [0.22, 1, 0.36, 1] as const;

export function Partners() {
  return (
    <section className="relative z-10 mx-auto w-full max-w-6xl px-5 pb-16">
      <div className="glass-cream relative overflow-hidden rounded-3xl px-6 py-10 sm:px-10 sm:py-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease }}
          className="text-center"
        >
          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-foreground/60">
            Integrated liquidity
          </span>
          <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Trusted by leading DEXs
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
            Vellum aggregates books across the most active on-chain venues, so your desk sees
            the full picture in one ladder.
          </p>
        </motion.div>

        <div className="mt-8">
          <LogoMarquee duration={28} pauseOnHover>
            {partners.map(({ name, Logo }) => (
              <Logo key={name} />
            ))}
          </LogoMarquee>
        </div>
      </div>
    </section>
  );
}
