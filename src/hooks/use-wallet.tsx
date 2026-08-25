import { createContext, useContext } from "react";

export type WalletState = {
  /** Privy has finished initialising and the UI can trust the values below. */
  ready: boolean;
  authenticated: boolean;
  /** Primary wallet address, if any. */
  address: string | null;
  /** Email address when the user logged in with email/social. */
  email: string | null;
  /** Opens the Privy login / wallet-connect modal. */
  connect: () => void;
  disconnect: () => void;
  /** False when no Privy app id is configured yet. */
  available: boolean;
  /** Account actions surfaced in the wallet sheet (no-ops before Privy loads). */
  linkEmail: () => void;
  linkWallet: () => void;
  exportWallet: () => void;
  fundWallet: () => void;
  /** True when the primary wallet is a Privy embedded wallet. */
  isEmbedded: boolean;
};

export const WalletContext = createContext<WalletState>({
  ready: false,
  authenticated: false,
  address: null,
  email: null,
  connect: () => {},
  disconnect: () => {},
  available: false,
  linkEmail: () => {},
  linkWallet: () => {},
  exportWallet: () => {},
  fundWallet: () => {},
  isEmbedded: false,
});

export function useWallet(): WalletState {
  return useContext(WalletContext);
}
