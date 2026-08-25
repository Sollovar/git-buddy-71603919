import { Sun, Moon, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useTheme, type Theme } from "@/hooks/use-theme";
import { LanguageSheet, type Language } from "@/components/LanguageSheet";

type Mode = "auto" | "light" | "dark";

export function SettingsPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { theme, setTheme } = useTheme();
  const [mode, setMode] = useState<Mode>(theme === "light" ? "light" : "auto");
  const [language, setLanguage] = useState<Language>("English");
  const [languageOpen, setLanguageOpen] = useState(false);

  if (!open) return null;

  const pick = (next: Mode) => {
    setMode(next);
    const mapped: Theme = next === "light" ? "light" : "warm";
    setTheme(mapped);
  };

  return (
    <div className="fixed inset-0 z-[60] flex flex-col justify-end">
      <button
        aria-label="Close panel overlay"
        onClick={onClose}
        className="absolute inset-0 bg-foreground/30"
      />
      <div className="relative overflow-hidden rounded-t-[2rem] bg-card px-6 pb-8 pt-3 shadow-[0_-12px_40px_-12px_rgba(0,0,0,0.25)]">
        <div className="mx-auto h-1 w-9 rounded-full bg-border" />

        <h2 className="pb-5 pt-6 text-2xl font-semibold">Global preferences</h2>

        <div className="flex items-center justify-between py-3">
          <span className="text-lg">Theme</span>
          <div className="flex items-center gap-1 rounded-full bg-secondary p-1">
            <button
              onClick={() => pick("auto")}
              className={`rounded-full px-4 py-2 text-sm transition-colors ${
                mode === "auto" ? "bg-card font-medium text-foreground shadow-sm" : "text-muted-foreground"
              }`}
            >
              Auto
            </button>
            <button
              aria-label="Light theme"
              onClick={() => pick("light")}
              className={`flex size-9 items-center justify-center rounded-full transition-colors ${
                mode === "light" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
              }`}
            >
              <Sun className="size-5" />
            </button>
            <button
              aria-label="Dark theme"
              onClick={() => pick("dark")}
              className={`flex size-9 items-center justify-center rounded-full transition-colors ${
                mode === "dark" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
              }`}
            >
              <Moon className="size-5" />
            </button>
          </div>
        </div>

        <button
          onClick={() => setLanguageOpen(true)}
          className="flex w-full items-center justify-between border-t border-border py-4 text-left"
        >
          <span className="text-lg">Language</span>
          <span className="flex items-center gap-2 text-lg font-medium">
            {language}
            <ChevronRight className="size-5 text-muted-foreground" />
          </span>
        </button>
      </div>

      <LanguageSheet
        open={languageOpen}
        onClose={() => setLanguageOpen(false)}
        selected={language}
        onSelect={(lang) => {
          setLanguage(lang);
          setLanguageOpen(false);
        }}
      />
    </div>
  );
}
