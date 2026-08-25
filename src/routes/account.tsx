import { createFileRoute } from "@tanstack/react-router";
import { ChevronRight, Wallet, History, Users, Settings, Bell, ShieldCheck } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { ConnectButton } from "@/components/ConnectButton";
import { useWallet } from "@/hooks/use-wallet";
import { shortAddress } from "@/lib/privy";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "Account — Wallet, Balances & Trading Settings" },
      {
        name: "description",
        content:
          "Connect your wallet to view balances, order history, referrals and trading preferences for your perp account.",
      },
      { property: "og:title", content: "Account — Wallet & Balances" },
      {
        property: "og:description",
        content:
          "Connect your wallet to view balances, order history, referrals and trading preferences.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AccountPage,
});

const rows = [
  { label: "Order History", icon: History },
  { label: "Referrals", icon: Users },
  { label: "Security", icon: ShieldCheck },
  { label: "Notifications", icon: Bell },
  { label: "Settings", icon: Settings },
];

function AccountPage() {
  const { authenticated, address, email } = useWallet();

  return (
    <div className="min-h-screen bg-background p-2 pb-24 text-foreground">
      <header className="px-2 py-4">
        <h1 className="text-2xl font-semibold">Account</h1>
      </header>

      <section className="rounded-2xl bg-card p-5 text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-secondary">
          <Wallet className="size-6 text-muted-foreground" />
        </div>
        <p className="mt-3 truncate text-base text-muted-foreground">
          {authenticated
            ? (address ? shortAddress(address) : email) ?? "Connected"
            : "No wallet connected"}
        </p>
        {authenticated && address && email ? (
          <p className="mt-1 truncate text-xs text-muted-foreground">{email}</p>
        ) : null}
        <ConnectButton
          variant="block"
          className="mt-4"
          connectedAction="disconnect"
          connectedLabel={authenticated ? "Disconnect" : undefined}
        />
      </section>

      <section className="mt-2 grid grid-cols-2 gap-2">
        <Stat label="Equity" value="0.00 USDT" />
        <Stat label="Unrealized PnL" value="0.00 USDT" />
      </section>

      <section className="mt-2 rounded-2xl bg-card px-4">
        {rows.map(({ label, icon: Icon }) => (
          <button
            key={label}
            className="flex w-full items-center gap-3 border-b border-border py-4 text-left last:border-b-0"
          >
            <Icon className="size-5 shrink-0 text-muted-foreground" />
            <span className="min-w-0 flex-1 truncate text-base">{label}</span>
            <ChevronRight className="size-5 shrink-0 text-muted-foreground" />
          </button>
        ))}
      </section>

      <BottomNav />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-card p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 truncate text-lg font-medium">{value}</p>
    </div>
  );
}
