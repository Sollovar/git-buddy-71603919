import { ClientOnly } from "@tanstack/react-router";
import { Suspense, lazy, useMemo, useState, type ReactNode } from "react";

import { DYNAMIC_ENVIRONMENT_ID, isWalletConfigured } from "@/lib/wallet";
import { WalletContext, type WalletState } from "@/hooks/use-wallet";

/**
 * Dynamic's SDK is browser-only, so it is dynamically imported after hydration.
 * Outside the provider (SSR + first paint) the default WalletContext value is
 * used, which reports `ready: false` and renders the UI in its disconnected
 * state — no hook-order or hydration mismatch.
 *
 * The integration is fully headless: no DynamicWidget / Dynamic modal is
 * rendered anywhere. All UI lives in our own components (ConnectSheet,
 * AccountSheet, ConnectButton) and only Dynamic's hooks are used.
 */
const DynamicBridge = lazy(async () => {
  const [
    { DynamicContextProvider, useDynamicContext, useEmbeddedReveal, useIsLoggedIn, useUserWallets },
    { EthereumWalletConnectors },
    { ConnectSheet },
    { toast },
  ] = await Promise.all([
    import("@dynamic-labs/sdk-react-core"),
    import("@dynamic-labs/ethereum"),
    import("@/components/wallet/ConnectSheet"),
    import("sonner"),
  ]);

  function Bridge({ children }: { children: ReactNode }) {
    const { sdkHasLoaded, primaryWallet, user, handleLogOut } = useDynamicContext();
    const { initExportProcess } = useEmbeddedReveal();
    const isLoggedIn = useIsLoggedIn();
    const wallets = useUserWallets();
    const [connectOpen, setConnectOpen] = useState(false);

    const value = useMemo<WalletState>(() => {
      const address = primaryWallet?.address ?? wallets[0]?.address ?? null;
      const isEmbedded = Boolean(
        primaryWallet?.connector?.isEmbeddedWallet ??
          (primaryWallet?.connector?.key ?? "").includes("dynamic"),
      );

      return {
        ready: sdkHasLoaded,
        authenticated: Boolean(isLoggedIn && (address || user?.email)),
        address,
        email: user?.email ?? null,
        connect: () => setConnectOpen(true),
        disconnect: () => void handleLogOut(),
        available: true,
        // Linking more accounts reuses the same headless connect sheet.
        linkEmail: () => setConnectOpen(true),
        linkWallet: () => setConnectOpen(true),
        exportWallet: () => void initExportProcess(),
        fundWallet: () => {
          toast.info("On-ramp coming soon", {
            description: "Fund this address from an exchange or another wallet for now.",
          });
        },
        isEmbedded,
      };
    }, [sdkHasLoaded, isLoggedIn, primaryWallet, wallets, user, handleLogOut, initExportProcess]);

    return (
      <WalletContext.Provider value={value}>
        {children}
        <ConnectSheet open={connectOpen} onClose={() => setConnectOpen(false)} />
      </WalletContext.Provider>
    );
  }

  function Provider({ children }: { children: ReactNode }) {
    return (
      <DynamicContextProvider
        settings={{
          environmentId: DYNAMIC_ENVIRONMENT_ID,
          walletConnectors: [EthereumWalletConnectors],
          initialAuthenticationMode: "connect-and-sign",
          events: {
            onLogout: () => {
              toast.success("Wallet disconnected");
            },
          },
        }}
      >
        <Bridge>{children}</Bridge>
      </DynamicContextProvider>
    );
  }

  return { default: Provider };
});

export function DynamicClientProvider({ children }: { children: ReactNode }) {
  if (!isWalletConfigured) return <>{children}</>;

  return (
    <ClientOnly fallback={children}>
      <Suspense fallback={children}>
        <DynamicBridge>{children}</DynamicBridge>
      </Suspense>
    </ClientOnly>
  );
}
