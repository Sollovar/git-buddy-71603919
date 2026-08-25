import { Check, X } from "lucide-react";

export function ExpirySheet({
  open,
  current,
  options,
  onSelect,
  onClose,
}: {
  open: boolean;
  current: string;
  options: { key: string; hint: string }[];
  onSelect: (key: string) => void;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      <button
        aria-label="Close expiry selection"
        className="absolute inset-0 bg-foreground/30"
        onClick={onClose}
      />
      <div className="relative overflow-hidden rounded-t-[2rem] bg-card pb-6 pt-4 shadow-[0_-12px_40px_-12px_rgba(0,0,0,0.25)]">
        <div className="flex items-center justify-between px-5 pb-2">
          <span className="text-base text-muted-foreground">Expires in</span>
          <button aria-label="Close" onClick={onClose}>
            <X className="size-5 text-muted-foreground" />
          </button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto">
          {options.map((o) => (
            <button
              key={o.key}
              onClick={() => {
                onSelect(o.key);
                onClose();
              }}
              className={`flex w-full items-center justify-between px-5 py-4 text-left ${
                o.key === current ? "bg-secondary" : ""
              }`}
            >
              <p className="text-base">{o.key}</p>

              {o.key === current && <Check className="size-5" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
