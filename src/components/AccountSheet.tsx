import { Copy, ExternalLink, KeyRound, LogOut, Mail, Plus, Wallet } from "lucide-react";
import { toast } from "sonner";

import { useWallet } from "@/hooks/use-wallet";
import { shortAddress } from "@/lib/privy";

/**
 * Bottom sheet shown when the connected address in the header is tapped.
 * Surfaces the Privy account actions (link, fund, export, disconnect).
 */
export function AccountSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const {
    address,
    email,
    disconnect,
    linkEmail,
    linkWallet,
    exportWallet,
    fundWallet,
    isEmbedded,
  } = useWallet();

  if (!open) return null;

  function run(action: () => void) {
    onClose();
    action();
  }

  const rows = [
    {
      label: "Add funds",
      icon: Plus,
      onClick: () => run(fundWallet),
      show: Boolean(address),
    },
    {
      label: email ? `Email · ${email}` : "Link email",
      icon: Mail,
      onClick: () => (email ? toast(email) : run(linkEmail)),
      show: true,
    },
    {
      label: "Link another wallet",
      icon: Wallet,
      onClick: () => run(linkWallet),
      show: true,
    },
    {
      label: "Export private key",
      icon: KeyRound,
      onClick: () => run(exportWallet),
      show: isEmbedded,
    },
    {
      label: "View on explorer",
      icon: ExternalLink,
      onClick: () => {
        if (address) window.open(`https://etherscan.io/address/${address}`, "_blank", "noopener");
      },
      show: Boolean(address),
    },
  ].filter((r) => r.show);

  return (
    <div className="fixed inset-0 z-50 flex items-end" role="dialog" aria-label="Wallet menu">
      <button aria-label="Close wallet menu" className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full rounded-t-3xl bg-card p-4 pb-8">
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-secondary" />

        <div className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-2xl bg-secondary">
            <Wallet className="size-5 text-muted-foreground" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-base font-medium">
              {address ? shortAddress(address) : (email ?? "Connected")}
            </p>
            <p className="text-xs text-muted-foreground">
              {isEmbedded ? "Privy embedded wallet" : "External wallet"}
            </p>
          </div>
          <button
            aria-label="Copy address"
            className="rounded-full bg-secondary p-2.5"
            onClick={() => {
              if (!address) return;
              void navigator.clipboard.writeText(address);
              toast.success("Address copied");
            }}
          >
            <Copy className="size-4 text-muted-foreground" />
          </button>
        </div>

        <div className="mt-4 rounded-2xl bg-secondary/50 px-4">
          {rows.map(({ label, icon: Icon, onClick }) => (
            <button
              key={label}
              onClick={onClick}
              className="flex w-full items-center gap-3 border-b border-border py-4 text-left last:border-b-0"
            >
              <Icon className="size-5 shrink-0 text-muted-foreground" />
              <span className="min-w-0 flex-1 truncate text-base">{label}</span>
            </button>
          ))}
        </div>

        <button
          onClick={() => run(disconnect)}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3.5 text-base font-medium text-primary-foreground"
        >
          <LogOut className="size-4" />
          Disconnect
        </button>
      </div>
    </div>
  );
}
