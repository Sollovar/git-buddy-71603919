import { LogOut, Wallet } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AccountSheet } from "@/components/AccountSheet";
import { useWallet } from "@/hooks/use-wallet";
import { isPrivyConfigured, shortAddress } from "@/lib/privy";
import { cn } from "@/lib/utils";

type Variant = "pill" | "block";

const styles: Record<Variant, string> = {
  pill: "rounded-full border border-primary bg-primary/25 px-4 py-2 text-sm font-medium",
  block: "w-full rounded-full bg-primary py-3.5 text-base font-medium text-primary-foreground",
};

export function ConnectButton({
  variant = "pill",
  className,
  connectedClassName,
  connectedLabel,
  showIcon,
  connectedAction = "menu",
  onConnectedClick,
}: {
  variant?: Variant;
  className?: string;
  /** Extra classes applied only once connected. */
  connectedClassName?: string;
  /** Optional override for what to show once connected. */
  connectedLabel?: string | undefined;
  /** Show the wallet / bag icon. Defaults to true for the block variant. */
  showIcon?: boolean;
  /** What a tap does while connected. */
  connectedAction?: "menu" | "disconnect" | "custom";
  onConnectedClick?: () => void;
}) {
  const { ready, authenticated, address, email, connect, disconnect, available } = useWallet();
  const [sheetOpen, setSheetOpen] = useState(false);


  const label = (() => {
    if (!authenticated) return "Connect";
    if (connectedLabel) return connectedLabel;
    if (address) return shortAddress(address);
    if (email) return email;
    return "Connected";
  })();

  const withIcon = showIcon ?? variant === "block";

  function handleClick() {
    if (!isPrivyConfigured) {
      toast.error("Privy is not set up yet", {
        description: "Add your Privy App ID in src/lib/privy.ts to enable wallet connect.",
      });
      return;
    }
    if (!available || !ready) return;
    if (!authenticated) {
      connect();
      return;
    }
    if (connectedAction === "disconnect") disconnect();
    else if (connectedAction === "custom") onConnectedClick?.();
    else setSheetOpen(true);
  }

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        disabled={isPrivyConfigured && available && !ready}
        aria-label={authenticated ? "Open wallet menu" : "Connect wallet"}
        className={cn(
          styles[variant],
          "inline-flex items-center justify-center gap-2 transition-opacity disabled:opacity-60",
          className,
          authenticated && connectedClassName,
        )}
      >
        {withIcon ? (
          authenticated && connectedAction === "disconnect" ? (
            <LogOut className="size-4 shrink-0" />
          ) : (
            <Wallet className="size-4 shrink-0" />
          )
        ) : null}

        <span className="truncate">{label}</span>
      </button>
      <AccountSheet open={sheetOpen} onClose={() => setSheetOpen(false)} />
    </>
  );
}
