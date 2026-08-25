import { markets } from "@/components/MarketSelector";

/**
 * Order-book grouping (tick size) depends on the pair's quoted price precision.
 * A pair quoted as 62,922.0 groups by 0.1 / 1 / 10 / 50 / 100, while a pair
 * quoted as 0.06966 must group by 0.00001 / 0.0001 / 0.001 / 0.005 / 0.01.
 */
const MULTIPLIERS = [1, 10, 100, 500, 1000];

function findPrice(pair: string): string | undefined {
  return markets.find((m) => m.symbol === pair)?.price;
}

export function getMarketPrice(pair: string): number {
  const raw = findPrice(pair);
  const n = raw ? Number(raw.replace(/,/g, "")) : NaN;
  return Number.isFinite(n) && n > 0 ? n : 1;
}

/** Smallest quotable increment, taken from the quoted price's decimals. */
export function getBaseTick(pair: string): number {
  const raw = findPrice(pair);
  if (raw) {
    const decimals = raw.includes(".") ? raw.split(".")[1]!.length : 0;
    return Math.pow(10, -decimals);
  }
  // Fallback: keep ~5 significant digits for the pair's magnitude.
  return Math.pow(10, Math.min(Math.floor(Math.log10(getMarketPrice(pair))) - 4, 0));
}

export function formatTick(tick: number): string {
  const decimals = Math.max(0, Math.ceil(-Math.log10(tick) - 1e-9));
  return tick.toFixed(decimals);
}

export function getTickOptions(pair: string): string[] {
  const base = getBaseTick(pair);
  return MULTIPLIERS.map((m) => formatTick(Number((base * m).toPrecision(12))));
}
