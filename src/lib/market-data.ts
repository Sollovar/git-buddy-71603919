/**
 * Live market data.
 *
 * Two sources are supported and can be switched at runtime:
 *  - "aster"  → our exchange (Aster perps, Binance-style API)
 *  - "kucoin" → KuCoin public spot API
 *
 * All REST requests are routed through the app's own server proxy
 * (/api/public/market) to avoid CORS restrictions.
 * Live candle updates fall back to 5-second polling.
 */

import { getSource, type MarketSource } from "@/hooks/use-source";

export type { MarketSource };

export type Candle = {
  timestamp: number; // ms
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  turnover: number;
};

export type Interval =
  | "1m"
  | "3m"
  | "5m"
  | "15m"
  | "30m"
  | "1h"
  | "2h"
  | "4h"
  | "6h"
  | "12h"
  | "1d"
  | "3d"
  | "1w"
  | "1M";

/** Convert Binance-style symbol (BTCUSDT) to KuCoin format (BTC-USDT). */
function toKucoin(symbol: string): string {
  if (symbol.endsWith("USDT")) return symbol.slice(0, -4) + "-USDT";
  if (symbol.endsWith("BTC"))  return symbol.slice(0, -3) + "-BTC";
  if (symbol.endsWith("ETH"))  return symbol.slice(0, -3) + "-ETH";
  return symbol;
}

/** KuCoin interval strings. */
const KC_INTERVAL: Record<Interval, string> = {
  "1m":  "1min",
  "3m":  "3min",
  "5m":  "5min",
  "15m": "15min",
  "30m": "30min",
  "1h":  "1hour",
  "2h":  "2hour",
  "4h":  "4hour",
  "6h":  "6hour",
  "12h": "12hour",
  "1d":  "1day",
  "3d":  "1day",   // KuCoin has no 3-day interval
  "1w":  "1week",
  "1M":  "1week",  // KuCoin has no monthly interval
};

/** Duration of one bar in seconds. */
const INTERVAL_SECS: Record<Interval, number> = {
  "1m":  60,     "3m":  180,    "5m":  300,
  "15m": 900,    "30m": 1800,   "1h":  3600,
  "2h":  7200,   "4h":  14400,  "6h":  21600,
  "12h": 43200,  "1d":  86400,  "3d":  259200,
  "1w":  604800, "1M":  2592000,
};

/** All REST calls go through the server proxy to avoid CORS issues. */
async function proxyGet(path: string, params: Record<string, string>): Promise<Response> {
  const search = new URLSearchParams({ path, ...params });
  return fetch(`/api/public/market?${search.toString()}`, {
    headers: { accept: "application/json" },
  });
}

/** Parse a KuCoin candle row → Candle (timestamps converted to ms). */
function parseRow(r: string[]): Candle {
  return {
    timestamp: Number(r[0]) * 1000, // KuCoin gives seconds
    open:      Number(r[1]),
    close:     Number(r[2]),
    high:      Number(r[3]),
    low:       Number(r[4]),
    volume:    Number(r[5]),
    turnover:  Number(r[6]),
  };
}

/** Parse an Aster (Binance-style) kline row → Candle. */
function parseAsterRow(r: (string | number)[]): Candle {
  return {
    timestamp: Number(r[0]),
    open:      Number(r[1]),
    high:      Number(r[2]),
    low:       Number(r[3]),
    close:     Number(r[4]),
    volume:    Number(r[5]),
    turnover:  Number(r[7]),
  };
}

function decimalsOf(value: string | number): number {
  const s = String(value);
  const dot = s.indexOf(".");
  return dot === -1 ? 0 : s.length - dot - 1;
}

export async function fetchCandles(
  symbol: string,
  interval: Interval,
  opts: { limit?: number; endTime?: number; startTime?: number; source?: MarketSource } = {},
): Promise<{ candles: Candle[]; pricePrecision: number }> {
  const source = opts.source ?? getSource();
  const limit  = opts.limit ?? 500;
  const secs   = INTERVAL_SECS[interval];

  if (source === "aster") {
    const params: Record<string, string> = {
      symbol,
      interval,
      limit: String(limit),
    };
    if (opts.endTime) params["endTime"] = String(opts.endTime);
    if (opts.startTime) params["startTime"] = String(opts.startTime);

    const res = await proxyGet("/fapi/v1/klines", params);
    if (!res.ok) throw new Error(`Failed to load candles (${res.status})`);

    const json = (await res.json()) as (string | number)[][] | { code?: number; msg?: string };
    if (!Array.isArray(json)) throw new Error(json.msg ?? "Market unavailable on Aster");

    let pricePrecision = 2;
    const candles = json.map((r) => {
      pricePrecision = Math.max(pricePrecision, decimalsOf(r[4] ?? "0"));
      return parseAsterRow(r);
    });
    return { candles, pricePrecision };
  }

  const kSymbol   = toKucoin(symbol);
  const kInterval = KC_INTERVAL[interval];

  const params: Record<string, string> = {
    symbol: kSymbol,
    type:   kInterval,
  };

  if (opts.endTime) {
    const endAt     = Math.floor(opts.endTime / 1000);
    params["endAt"]   = String(endAt);
    params["startAt"] = String(endAt - limit * secs);
  } else if (opts.startTime) {
    const startAt     = Math.ceil(opts.startTime / 1000);
    params["startAt"] = String(startAt);
    params["endAt"]   = String(startAt + limit * secs);
  } else {
    const now         = Math.floor(Date.now() / 1000);
    params["endAt"]   = String(now);
    params["startAt"] = String(now - limit * secs);
  }

  const res = await proxyGet("/api/v1/market/candles", params);
  if (!res.ok) throw new Error(`Failed to load candles (${res.status})`);

  const json = (await res.json()) as { code: string; data: string[][] };
  if (json.code !== "200000") throw new Error(`KuCoin error: ${json.code}`);

  // KuCoin returns newest-first; reverse to chronological order
  const rows = [...(json.data ?? [])].reverse();

  let pricePrecision = 2;
  const candles = rows.map((r) => {
    pricePrecision = Math.max(pricePrecision, decimalsOf(r[2] ?? "0")); // close price
    return parseRow(r);
  });

  return { candles, pricePrecision };
}

/* ------------------------------------------------------------------ */
/* Live subscription via polling (5-second interval)                    */
/* ------------------------------------------------------------------ */

export function subscribeCandles(
  symbol: string,
  interval: Interval,
  onCandle: (candle: Candle) => void,
  source?: MarketSource,
): () => void {
  let closed = false;
  let poll: ReturnType<typeof setInterval> | null = null;

  const tick = async () => {
    if (closed) return;
    try {
      const { candles } = await fetchCandles(symbol, interval, { limit: 2, ...(source ? { source } : {}) });
      const last = candles[candles.length - 1];
      if (last) onCandle(last);
    } catch { /* keep polling */ }
  };

  void tick();
  poll = setInterval(tick, 5000);

  return () => {
    closed = true;
    if (poll) clearInterval(poll);
  };
}

/* ------------------------------------------------------------------ */
/* Ticker                                                                */
/* ------------------------------------------------------------------ */

export type Ticker = {
  last: number;
  changePercent: number;
  high: number;
  low: number;
  quoteVolume: number;
  markPrice: number | null;
  indexPrice: number | null;
  fundingRate: number | null;
  nextFundingTime: number | null;
  pricePrecision: number;
};

export async function fetchTicker(symbol: string, source?: MarketSource): Promise<Ticker> {
  const src = source ?? getSource();

  if (src === "aster") {
    const [statsRes, markRes] = await Promise.all([
      proxyGet("/fapi/v1/ticker/24hr", { symbol }),
      proxyGet("/fapi/v1/premiumIndex", { symbol }),
    ]);
    if (!statsRes.ok) throw new Error(`Failed to load ticker (${statsRes.status})`);

    const stats = (await statsRes.json()) as Record<string, string> & { msg?: string };
    if (!stats["lastPrice"]) throw new Error(stats.msg ?? "Market unavailable on Aster");

    let mark: Record<string, string> | null = null;
    if (markRes.ok) {
      const parsed = (await markRes.json()) as Record<string, string> | Record<string, string>[];
      mark = Array.isArray(parsed) ? (parsed[0] ?? null) : parsed;
    }

    return {
      last:            Number(stats["lastPrice"]),
      changePercent:   Number(stats["priceChangePercent"]),
      high:            Number(stats["highPrice"]),
      low:             Number(stats["lowPrice"]),
      quoteVolume:     Number(stats["quoteVolume"]),
      markPrice:       mark?.["markPrice"] ? Number(mark["markPrice"]) : null,
      indexPrice:      mark?.["indexPrice"] ? Number(mark["indexPrice"]) : null,
      fundingRate:     mark?.["lastFundingRate"] ? Number(mark["lastFundingRate"]) : null,
      nextFundingTime: mark?.["nextFundingTime"] ? Number(mark["nextFundingTime"]) : null,
      pricePrecision:  decimalsOf(stats["lastPrice"] ?? "0"),
    };
  }

  const kSymbol = toKucoin(symbol);
  const res = await proxyGet("/api/v1/market/stats", { symbol: kSymbol });
  if (!res.ok) throw new Error(`Failed to load ticker (${res.status})`);

  const json = (await res.json()) as {
    code: string;
    data: Record<string, string | number | null>;
  };
  if (json.code !== "200000") throw new Error(`KuCoin error: ${json.code}`);

  const d = json.data;

  return {
    last:            Number(d["last"]),
    changePercent:   Number(d["changeRate"]) * 100,
    high:            Number(d["high"]),
    low:             Number(d["low"]),
    quoteVolume:     Number(d["volValue"]),
    markPrice:       null, // KuCoin spot has no mark price
    indexPrice:      null,
    fundingRate:     null,
    nextFundingTime: null,
    pricePrecision:  decimalsOf(String(d["last"] ?? "0")),
  };
}

/* ------------------------------------------------------------------ */
/* Recent trades                                                       */
/* ------------------------------------------------------------------ */

export type Trade = {
  id: string;
  price: number;
  /** Size expressed in quote currency (USDT). */
  size: number;
  time: number;
  side: "buy" | "sell";
};

export async function fetchTrades(
  symbol: string,
  opts: { limit?: number; source?: MarketSource } = {},
): Promise<Trade[]> {
  const src = opts.source ?? getSource();
  const limit = opts.limit ?? 30;

  if (src === "aster") {
    const res = await proxyGet("/fapi/v1/trades", { symbol, limit: String(limit) });
    if (!res.ok) throw new Error(`Failed to load trades (${res.status})`);
    const json = (await res.json()) as
      | { id: number; price: string; qty: string; quoteQty?: string; time: number; isBuyerMaker: boolean }[]
      | { msg?: string };
    if (!Array.isArray(json)) throw new Error(json.msg ?? "Trades unavailable on Aster");
    return json
      .map((t) => ({
        id: String(t.id),
        price: Number(t.price),
        size: t.quoteQty ? Number(t.quoteQty) : Number(t.price) * Number(t.qty),
        time: Number(t.time),
        // isBuyerMaker true → the taker sold into the bid
        side: (t.isBuyerMaker ? "sell" : "buy") as "buy" | "sell",
      }))
      .reverse();
  }

  const res = await proxyGet("/api/v1/market/histories", { symbol: toKucoin(symbol) });
  if (!res.ok) throw new Error(`Failed to load trades (${res.status})`);
  const json = (await res.json()) as {
    code: string;
    data: { sequence: string; price: string; size: string; side: string; time: number }[];
  };
  if (json.code !== "200000") throw new Error(`KuCoin error: ${json.code}`);
  return (json.data ?? [])
    .slice(-limit)
    .map((t) => ({
      id: t.sequence,
      price: Number(t.price),
      size: Number(t.price) * Number(t.size),
      time: Math.floor(Number(t.time) / 1e6), // KuCoin gives nanoseconds
      side: (t.side === "sell" ? "sell" : "buy") as "buy" | "sell",
    }))
    .reverse();
}
