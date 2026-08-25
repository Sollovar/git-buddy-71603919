import { Link } from "@tanstack/react-router";

function MarketsIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <rect x="2" y="14" width="4.4" height="7" rx="2.2" />
      <rect x="9.3" y="9" width="4.4" height="12" rx="2.2" />
      <rect x="16.6" y="3" width="4.4" height="18" rx="2.2" />
    </svg>
  );
}

function TradeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 26 24" fill="none" className={className} aria-hidden="true">
      <circle cx="17" cy="9.5" r="5.5" fill="currentColor" opacity="0.55" />
      <circle cx="10.5" cy="13.5" r="8" fill="currentColor" />
      <rect
        x="10.5"
        y="9.6"
        width="5.5"
        height="5.5"
        rx="1.1"
        transform="rotate(45 10.5 9.6)"
        className="fill-card"
      />
    </svg>
  );
}

function AccountIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="9.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="9.6" r="2.9" fill="currentColor" />
      <path
        d="M6.6 18.4c1.1-2.6 3.1-3.9 5.4-3.9s4.3 1.3 5.4 3.9"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const items = [
  { to: "/chart", label: "Markets", Icon: MarketsIcon },
  { to: "/", label: "Trade", Icon: TradeIcon },
  { to: "/account", label: "Account", Icon: AccountIcon },
] as const;

export function BottomNav() {
  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 backdrop-blur-md"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="mx-auto grid max-w-md grid-cols-3">
        {items.map(({ to, label, Icon }) => (
          <li key={to}>
            <Link
              to={to}
              activeOptions={{ exact: true }}
              activeProps={{ className: "text-primary" }}
              inactiveProps={{ className: "text-muted-foreground" }}
              className="flex w-full items-center justify-center gap-2 py-3 text-base font-medium transition-colors"
            >
              <Icon className="size-6 shrink-0" />
              <span className="truncate">{label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
