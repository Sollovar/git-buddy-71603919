import { ClientOnly } from "@tanstack/react-router";
import { Suspense, lazy, useEffect, useMemo, type ReactNode } from "react";

import { DYNAMIC_ENVIRONMENT_ID, isWalletConfigured } from "@/lib/wallet";
import { WalletContext, type WalletState } from "@/hooks/use-wallet";

/**
 * Dynamic's SDK is browser-only, so it is dynamically imported after hydration.
 * Outside the provider (SSR + first paint) the default WalletContext value is
 * used, which reports `ready: false` and renders the UI in its disconnected
 * state — no hook-order or hydration mismatch.
 *
 * We use Dynamic's own widget UI (auth flow modal, wallet menu, user profile)
 * and only remap its design tokens to our colors via `cssOverrides`.
 */
const DynamicBridge = lazy(async () => {
  const [
    { DynamicContextProvider, useDynamicContext, useEmbeddedReveal, useDynamicModals, useIsLoggedIn, useUserWallets },
    { EthereumWalletConnectors },
    { dynamicCssOverrides, syncDynamicThemeVars },
    { toast },
  ] = await Promise.all([
    import("@dynamic-labs/sdk-react-core"),
    import("@dynamic-labs/ethereum"),
    import("@/components/wallet/dynamic-theme"),
    import("sonner"),
  ]);

  function Bridge({ children }: { children: ReactNode }) {
    const {
      sdkHasLoaded,
      primaryWallet,
      user,
      handleLogOut,
      setShowAuthFlow,
      setShowDynamicUserProfile,
    } = useDynamicContext();
    const { setShowLinkNewWalletModal } = useDynamicModals();
    const { initExportProcess } = useEmbeddedReveal();
    const isLoggedIn = useIsLoggedIn();
    const wallets = useUserWallets();

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
        connect: () => setShowAuthFlow(true),
        disconnect: () => void handleLogOut(),
        available: true,
        openProfile: () => setShowDynamicUserProfile(true),
        linkEmail: () => setShowDynamicUserProfile(true),
        linkWallet: () => setShowLinkNewWalletModal(true),
        exportWallet: () => void initExportProcess(),
        fundWallet: () => {
          toast.info("On-ramp coming soon", {
            description: "Fund this address from an exchange or another wallet for now.",
          });
        },
        isEmbedded,
      };
    }, [
      sdkHasLoaded,
      isLoggedIn,
      primaryWallet,
      wallets,
      user,
      handleLogOut,
      initExportProcess,
      setShowAuthFlow,
      setShowDynamicUserProfile,
      setShowLinkNewWalletModal,
    ]);

    return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
  }

  function Provider({ children }: { children: ReactNode }) {
    useEffect(() => {
      syncDynamicThemeVars();
      const observer = new MutationObserver(() => syncDynamicThemeVars());
      observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
      return () => observer.disconnect();
    }, []);

    return (
      <DynamicContextProvider
        theme="light"
        settings={{
          environmentId: DYNAMIC_ENVIRONMENT_ID,
          walletConnectors: [EthereumWalletConnectors],
          initialAuthenticationMode: "connect-and-sign",
          cssOverrides: dynamicCssOverrides,
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
