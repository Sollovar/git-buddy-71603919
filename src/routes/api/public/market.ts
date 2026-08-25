import { createFileRoute } from "@tanstack/react-router";

/**
 * Server-side proxy for public market data (our exchange + KuCoin).
 * Avoids browser CORS restrictions.
 */

const ROUTES: { prefix: string; base: string }[] = [
  { prefix: "/fapi/v1/klines", base: "https://fapi.asterdex.com" },
  { prefix: "/fapi/v1/ticker/24hr", base: "https://fapi.asterdex.com" },
  { prefix: "/fapi/v1/premiumIndex", base: "https://fapi.asterdex.com" },
  { prefix: "/fapi/v1/trades", base: "https://fapi.asterdex.com" },
  { prefix: "/api/v1/market/candles", base: "https://api.kucoin.com" },
  { prefix: "/api/v1/market/stats", base: "https://api.kucoin.com" },
  { prefix: "/api/v1/market/histories", base: "https://api.kucoin.com" },
];

export const Route = createFileRoute("/api/public/market")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const path = url.searchParams.get("path") ?? "";
        const route = ROUTES.find((r) => path.startsWith(r.prefix));

        if (!route) {
          return new Response(JSON.stringify({ error: "Invalid request" }), {
            status: 400,
            headers: { "content-type": "application/json" },
          });
        }

        const params = new URLSearchParams();
        for (const [key, value] of url.searchParams) {
          if (key === "path") continue;
          params.set(key, value);
        }

        try {
          const upstream = await fetch(`${route.base}${path}?${params.toString()}`, {
            headers: { accept: "application/json" },
          });
          const body = await upstream.text();
          return new Response(body, {
            status: upstream.status,
            headers: {
              "content-type": "application/json",
              "cache-control": "no-store",
            },
          });
        } catch (error) {
          console.error(error);
          return new Response(JSON.stringify({ error: "Upstream unavailable" }), {
            status: 502,
            headers: { "content-type": "application/json" },
          });
        }
      },
    },
  },
});
