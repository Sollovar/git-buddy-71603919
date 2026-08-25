import { ClientOnly } from "@tanstack/react-router";
import { Suspense, lazy, useMemo, type ReactNode } from "react";

import { PRIVY_APP_ID, isPrivyConfigured } from "@/lib/privy";
import { WalletContext, type WalletState } from "@/hooks/use-wallet";
import { useTheme } from "@/hooks/use-theme";

/**
 * Privy's modal only accepts literal color values, so the app's semantic
 * tokens are mirrored here as hex equivalents (see src/styles.css).
 */
const PRIVY_THEMES = {
  warm: { theme: "#FCF5EA", accentColor: "#E2C4A1", textColor: "#31261D" },
  light: { theme: "#FFFFFF", accentColor: "#E2C4A1", textColor: "#16181D" },
} as const;

type PrivyAppearance = (typeof PRIVY_THEMES)[keyof typeof PRIVY_THEMES];

/**
 * Privy's SDK is browser-only, so it is dynamically imported after hydration.
 * Outside the provider (SSR + first paint) the default WalletContext value is
 * used, which reports `ready: false` and renders the UI in its disconnected
 * state — no hook-order or hydration mismatch.
 */
const PrivyBridge = lazy(async () => {
  const { PrivyProvider, usePrivy, useWallets, useFundWallet } = await import(
    "@privy-io/react-auth"
  );

  function Bridge({ children }: { children: ReactNode }) {
    const {
      ready,
      authenticated,
      user,
      login,
      logout,
      linkEmail,
      linkWallet,
      exportWallet,
    } = usePrivy();
    const { wallets } = useWallets();
    const { fundWallet } = useFundWallet();

    const value = useMemo<WalletState>(() => {
      const wallet = wallets[0];
      const address = wallet?.address ?? user?.wallet?.address ?? null;
      return {
        ready,
        authenticated,
        address,
        email: user?.email?.address ?? null,
        connect: login,
        disconnect: logout,
        available: true,
        linkEmail,
        linkWallet,
        exportWallet: () => void exportWallet(),
        fundWallet: () => {
          if (address) void fundWallet({ address });
        },
        isEmbedded: (wallet?.walletClientType ?? user?.wallet?.walletClientType) === "privy",
      };
    }, [
      ready,
      authenticated,
      user,
      wallets,
      login,
      logout,
      linkEmail,
      linkWallet,
      exportWallet,
      fundWallet,
    ]);

    return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
  }

  function Provider({ children, appearance }: { children: ReactNode; appearance: PrivyAppearance }) {
    return (
      <PrivyProvider
        appId={PRIVY_APP_ID}
        config={{
          loginMethods: ["wallet", "email", "google", "apple"],
          appearance: {
            theme: appearance.theme,
            accentColor: appearance.accentColor,
            // Solana connectors aren't wired up, so keep the modal EVM-only.
            walletChainType: "ethereum-only",
            showWalletLoginFirst: true,
          },
          externalWallets: {
            // Mobile browsers have no injected provider, so hand off via
            // WalletConnect deep links instead of waiting on an extension.
            walletConnect: { enabled: true },
          },
          embeddedWallets: {
            ethereum: { createOnLogin: "users-without-wallets" },
            solana: { createOnLogin: "off" },
          },
        }}
      >
        <Bridge>{children}</Bridge>
      </PrivyProvider>
    );
  }

  return { default: Provider };
});

export function PrivyClientProvider({ children }: { children: ReactNode }) {
  const { theme } = useTheme();
  const appearance = PRIVY_THEMES[theme] ?? PRIVY_THEMES.warm;

  if (!isPrivyConfigured) return <>{children}</>;

  return (
    <ClientOnly fallback={children}>
      <Suspense fallback={children}>
        {/* Remount so Privy picks up the new palette when the theme changes */}
        <PrivyBridge key={theme} appearance={appearance}>
          {children}
        </PrivyBridge>
      </Suspense>
    </ClientOnly>
  );
}
