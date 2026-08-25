import {
  X,
  TrendingUp,
  BarChart3,
  Wallet,
  Trophy,
  Activity,
  ArrowLeftRight,
  Users,
  PieChart,
  ChevronRight,
  Settings,
  Bell,
  HelpCircle,
  Github,
  Twitter,
  MessageCircle,
} from "lucide-react";
import { useState } from "react";
import { SettingsPanel } from "@/components/SettingsPanel";
import { NotificationsPanel } from "@/components/NotificationsPanel";


const appItems = [
  { label: "Trade", icon: TrendingUp },
  { label: "Markets", icon: BarChart3 },
  { label: "Portfolio", icon: Wallet },
  { label: "Leaderboard", icon: Trophy },
];

const productItems = [
  { label: "Perpetuals", icon: Activity },
  { label: "Spot", icon: ArrowLeftRight },
  { label: "Referrals", icon: Users },
  { label: "Analytics", icon: PieChart },
];

const groups = ["Protocol", "Company", "Legal & Privacy"];

export function MainMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col">
      <button
        aria-label="Close menu overlay"
        onClick={onClose}
        className="absolute inset-0 bg-foreground/30"
      />
      <div className="h-12 shrink-0" />
      <div className="relative flex flex-1 flex-col overflow-hidden rounded-t-[2rem] bg-card shadow-[0_-12px_40px_-12px_rgba(0,0,0,0.25)]">

        <div className="relative pt-3">
          <div className="mx-auto h-1 w-9 rounded-full bg-border" />
          <button
            aria-label="Close menu"
            onClick={onClose}
            className="absolute right-4 top-2 flex size-8 items-center justify-center rounded-full bg-secondary"
          >
            <X className="size-4 text-muted-foreground" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-8">
          <p className="pb-1 pt-4 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            App
          </p>
          <nav>
            {appItems.map((i) => (
              <MenuRow key={i.label} {...i} />
            ))}
          </nav>

          <p className="pb-1 pt-4 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Products
          </p>
          <nav>
            {productItems.map((i) => (
              <MenuRow key={i.label} {...i} />
            ))}
          </nav>

          <div className="mt-4 border-t border-border pt-1">
            {groups.map((g) => (
              <button
                key={g}
                className="flex w-full items-center justify-between py-3 text-left text-sm text-muted-foreground"
              >
                {g}
                <ChevronRight className="size-4" />
              </button>
            ))}
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2 border-t border-border pt-4">
            <button
              onClick={() => setSettingsOpen(true)}
              className="flex items-center justify-center gap-2 rounded-2xl bg-secondary py-3 text-sm font-medium"
            >
              <Settings className="size-4" /> Settings
            </button>
            <button
              onClick={() => setNotificationsOpen(true)}
              className="flex items-center justify-center gap-2 rounded-2xl bg-secondary py-3 text-sm font-medium"
            >
              <Bell className="size-4" /> Notifications
            </button>
          </div>




          <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
            <IconButton label="Help">
              <HelpCircle className="size-4 text-muted-foreground" />
            </IconButton>
            <div className="flex items-center gap-2">
              <IconButton label="GitHub">
                <Github className="size-4 text-muted-foreground" />
              </IconButton>
              <IconButton label="Twitter">
                <Twitter className="size-4 text-muted-foreground" />
              </IconButton>
              <IconButton label="Chat">
                <MessageCircle className="size-4 text-muted-foreground" />
              </IconButton>
            </div>
          </div>
        </div>
      </div>



      <SettingsPanel open={settingsOpen} onClose={() => setSettingsOpen(false)} />
      <NotificationsPanel
        open={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
      />
    </div>
  );
}

function MenuRow({ label, icon: Icon }: { label: string; icon: typeof Activity }) {
  return (
    <button className="flex w-full items-center gap-3 py-2 text-left">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/35">
        <Icon className="size-4 text-primary-foreground" />
      </span>
      <span className="text-base font-medium">{label}</span>
    </button>
  );
}

function IconButton({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <button
      aria-label={label}
      className="flex size-9 items-center justify-center rounded-full bg-secondary"
    >
      {children}
    </button>
  );
}

