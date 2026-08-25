import { Check } from "lucide-react";

export function TickSizeSheet({
  open,
  options,
  current,
  onSelect,
  onClose,
}: {
  open: boolean;
  options: string[];
  current: string;
  onSelect: (t: string) => void;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      <button
        aria-label="Close tick size"
        className="absolute inset-0 bg-foreground/30"
        onClick={onClose}
      />
      <div className="relative overflow-hidden rounded-t-[2rem] bg-card pb-8 pt-3 shadow-[0_-12px_40px_-12px_rgba(0,0,0,0.25)]">
        <div className="mx-auto mb-2 h-1 w-12 rounded-full bg-secondary" />
        <div className="max-h-[70vh] overflow-y-auto">
          {options.map((t) => (
            <button
              key={t}
              onClick={() => {
                onSelect(t);
                onClose();
              }}
              className="flex w-full items-center justify-between px-6 py-5 text-left text-base"
            >
              <span className={t === current ? "text-primary" : ""}>{t}</span>
              {t === current && <Check className="size-5 text-primary" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
