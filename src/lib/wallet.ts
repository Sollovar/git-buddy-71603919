/**
 * Dynamic (dynamic.xyz) configuration.
 *
 * The environment ID is a *publishable* identifier — safe in client code.
 * Find it in the Dynamic Dashboard -> Developers -> SDK & API Keys.
 *
 * Override it with VITE_DYNAMIC_ENVIRONMENT_ID in your env if needed, and make
 * sure the app's domain is allow-listed in the Dynamic dashboard under
 * Security -> Allowed origins (CORS).
 */
export const DYNAMIC_ENVIRONMENT_ID: string =
  (typeof import.meta !== "undefined" &&
    (import.meta as { env?: Record<string, string> }).env?.["VITE_DYNAMIC_ENVIRONMENT_ID"]) ||
  "b64ba473-3830-4799-9a51-dce3c18b33be";

export const isWalletConfigured = DYNAMIC_ENVIRONMENT_ID.trim().length > 0;

export function shortAddress(address: string): string {
  if (address.length <= 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
