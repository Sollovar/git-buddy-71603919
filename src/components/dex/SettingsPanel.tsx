import { Check, ChevronLeft, ChevronRight, Moon, Sun } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";
import { useTheme } from "@/hooks/use-theme";

type Mode = "auto" | "light" | "dark";

const languages = [
  "English",
  "Chinese, Simplified",
  "Chinese, Traditional",
  "Dutch",
  "French",
  "Indonesian",
  "Japanese",
  "Korean",
  "Portuguese",
  "Russian",
  "Spanish",
  "Thai",
  "Turkish",
  "Vietnamese",
];

export function SettingsPanel() {
  const { theme, setTheme } = useTheme();
  const mode = (theme === "light" ? "light" : "auto") as Mode;

  const pickMode = (next: Mode) => {
    setTheme(next === "light" ? "light" : "warm");
  };
  const [view, setView] = useState<"root" | "language">("root");
  const [language, setLanguage] = useState("English");

  if (view === "language") {
    return (
      <div className="w-[320px] p-1">
        <div className="flex items-center gap-2 px-1 pb-3 pt-1">
          <button
            onClick={() => setView("root")}
            aria-label="Back"
            className="grid h-7 w-7 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-panel-2 hover:text-foreground"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <h2 className="text-[17px] font-semibold">Language</h2>
        </div>

        <div className="no-scrollbar max-h-[320px] overflow-y-auto pr-1">
          {languages.map((lang) => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              className="flex w-full items-center justify-between rounded-xl px-2 py-2.5 transition-colors hover:bg-panel-2"
            >
              <span className="text-[14px] font-medium">{lang}</span>
              {language === lang && <Check className="h-4 w-4 text-gold-strong" />}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-[320px] p-1">
      <h2 className="px-2 pb-3 pt-1 text-[17px] font-semibold">Global preferences</h2>

      <div className="flex items-center justify-between rounded-xl px-2 py-2.5">
        <span className="text-[14px] font-medium">Theme</span>
        <div className="flex items-center gap-1 rounded-full bg-panel-2 p-1">
          <button
            onClick={() => pickMode("auto")}
            className={cn(
              "rounded-full px-3 py-1 text-[13px] font-semibold transition-colors",
              mode === "auto" ? "bg-card shadow-[var(--shadow-panel)]" : "text-muted-foreground",
            )}
          >
            Auto
          </button>
          <button
            onClick={() => pickMode("light")}
            aria-label="Light theme"
            className={cn(
              "grid h-7 w-7 place-items-center rounded-full transition-colors",
              mode === "light" ? "bg-card shadow-[var(--shadow-panel)]" : "text-muted-foreground",
            )}
          >
            <Sun className="h-4 w-4" />
          </button>
          <button
            onClick={() => pickMode("dark")}
            aria-label="Dark theme"
            className={cn(
              "grid h-7 w-7 place-items-center rounded-full transition-colors",
              mode === "dark" ? "bg-card shadow-[var(--shadow-panel)]" : "text-muted-foreground",
            )}
          >
            <Moon className="h-4 w-4" />
          </button>
        </div>
      </div>

      <button
        onClick={() => setView("language")}
        className="flex w-full items-center justify-between rounded-xl px-2 py-3 transition-colors hover:bg-panel-2"
      >
        <span className="text-[14px] font-medium">Language</span>
        <span className="flex items-center gap-1 text-[14px] font-semibold text-muted-foreground">
          {language}
          <ChevronRight className="h-4 w-4" />
        </span>
      </button>

      <button className="flex w-full items-center justify-between rounded-xl px-2 py-3 transition-colors hover:bg-panel-2">
        <span className="text-[14px] font-medium">Currency</span>
        <span className="flex items-center gap-1 text-[14px] font-semibold text-muted-foreground">
          USD
          <ChevronRight className="h-4 w-4" />
        </span>
      </button>
    </div>
  );
}
