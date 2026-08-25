import { ChevronLeft, Check } from "lucide-react";
import { useState } from "react";

const LANGUAGES = [
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
  "Spanish (Spain)",
  "Spanish (Latin America)",
  "Spanish (US)",
  "Spanish (Argentina)",
  "Spanish (Bolivia)",
] as const;

type Language = (typeof LANGUAGES)[number];

interface LanguageSheetProps {
  open: boolean;
  onClose: () => void;
  selected: Language;
  onSelect: (language: Language) => void;
}

export function LanguageSheet({ open, onClose, selected, onSelect }: LanguageSheetProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex flex-col bg-card">
      <div className="flex items-center gap-3 border-b border-border px-4 py-4">
        <button
          aria-label="Back"
          onClick={onClose}
          className="flex size-8 items-center justify-center text-foreground"
        >
          <ChevronLeft className="size-6" />
        </button>
        <h2 className="text-lg font-semibold">Language</h2>
      </div>

      <div className="flex-1 overflow-y-auto">
        {LANGUAGES.map((lang) => (
          <button
            key={lang}
            onClick={() => onSelect(lang)}
            className="flex w-full items-center justify-between px-4 py-3.5 text-left text-base text-foreground transition-colors hover:bg-secondary"
          >
            <span>{lang}</span>
            {selected === lang ? (
              <Check className="size-5 text-primary" />
            ) : null}
          </button>
        ))}
      </div>
    </div>
  );
}

export type { Language };
export { LANGUAGES };
