/**
 * Privy configuration.
 *
 * PRIVY_APP_ID is a *publishable* identifier — it is safe in client code.
 * Find it in the Privy Dashboard -> your app -> Settings -> Basics -> "App ID".
 *
 * Set VITE_PRIVY_APP_ID in your Replit Secrets (or .env) to override the
 * default. You must also add your Replit domain as an allowed origin in the
 * Privy dashboard under Settings -> Allowed domains.
 *
 * NEVER put your Privy "app secret" (privy_app_secret_...) here or anywhere
 * in the frontend — it is a server-only credential.
 */
export const PRIVY_APP_ID: string =
  (typeof import.meta !== "undefined" &&
    (import.meta as { env?: Record<string, string> }).env?.["VITE_PRIVY_APP_ID"]) ||
  "cms0pzb0200dw0bldfjr80r0g";

export const isPrivyConfigured = PRIVY_APP_ID.trim().length > 0;

export function shortAddress(address: string): string {
  if (address.length <= 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
