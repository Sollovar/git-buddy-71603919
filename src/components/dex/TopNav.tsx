import { Bell, ChevronDown, Settings, Wallet } from "lucide-react";
import { useState } from "react";

import logoMark from "@/assets/logo-mark.png";
import { NotificationsPanel } from "@/components/dex/NotificationsPanel";
import { SettingsPanel } from "@/components/dex/SettingsPanel";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const navItems = [
  { label: "Trade", caret: true },
  { label: "More", caret: true },
];


export function TopNav() {
  const [notifOpen, setNotifOpen] = useState(false);

  return (
    <header className="flex h-[52px] items-center gap-6 bg-background px-4">
      <div className="flex shrink-0 items-center gap-2">
        <img src={logoMark} alt="Vellum logo" width={40} height={40} className="h-10 w-10" />
        <span className="text-[17px] font-semibold tracking-[0.14em]">ASTER</span>
      </div>

      <nav className="flex min-w-0 items-center gap-5">
        {navItems.map((item) => (
          <button
            key={item.label}
            className="flex items-center gap-1 text-[14px] font-medium text-foreground/85 transition-colors hover:text-gold-strong"
          >
            {item.label}
            {item.caret && <ChevronDown className="h-3.5 w-3.5 opacity-60" />}
          </button>
        ))}
      </nav>

      <div className="ml-auto flex items-center gap-3">
        <button className="inline-flex items-center justify-center gap-2 rounded-full border border-primary bg-primary/25 px-5 py-1.5 text-[14px] font-medium text-foreground transition-colors hover:bg-primary/35">
          <Wallet className="h-4 w-4 shrink-0" />
          Connect Wallet
        </button>


        <Popover>
          <PopoverTrigger
            aria-label="Global preferences"
            className="grid h-8 w-8 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-panel hover:text-foreground"
          >
            <Settings className="h-[18px] w-[18px]" />
          </PopoverTrigger>
          <PopoverContent
            align="end"
            sideOffset={10}
            className="w-auto rounded-2xl border-border bg-panel p-3 text-foreground shadow-[0_16px_40px_oklch(0.4_0.04_60_/_0.16)]"
          >
            <SettingsPanel />
          </PopoverContent>

        </Popover>

        <button
          onClick={() => setNotifOpen(true)}
          aria-label="Notifications"
          className="relative grid h-8 w-8 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-panel hover:text-foreground"
        >
          <Bell className="h-[18px] w-[18px]" />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-down" />
        </button>

        <Dialog open={notifOpen} onOpenChange={setNotifOpen}>
          <DialogContent className="max-w-[560px] gap-0 overflow-hidden rounded-3xl border-border bg-panel p-0 text-foreground shadow-[0_24px_60px_oklch(0.4_0.04_60_/_0.2)]">
            <NotificationsPanel />
          </DialogContent>
        </Dialog>
      </div>
    </header>
  );
}
