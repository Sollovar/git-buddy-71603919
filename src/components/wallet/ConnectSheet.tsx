import { Loader2, Mail, Wallet } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { useConnectWithOtp, useWalletOptions } from "@dynamic-labs/sdk-react-core";

/**
 * Fully headless connect UI: our own bottom sheet driving Dynamic's hooks.
 * No Dynamic widget/modal is ever rendered, so the app keeps its own styling.
 */
export function ConnectSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { walletOptions, selectWalletOption } = useWalletOptions();
  const { connectWithEmail, verifyOneTimePassword } = useConnectWithOtp();

  const [busy, setBusy] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");

  /** Installed wallets first, then the rest — no duplicates per group. */
  const options = useMemo(() => {
    const seen = new Set<string>();
    return [...walletOptions]
      .filter((o) => {
        const id = o.group ?? o.key;
        if (seen.has(id)) return false;
        seen.add(id);
        return true;
      })
      .sort((a, b) => Number(b.isInstalledOnBrowser) - Number(a.isInstalledOnBrowser))
      .slice(0, 8);
  }, [walletOptions]);

  if (!open) return null;

  async function pickWallet(key: string) {
    setBusy(key);
    try {
      await selectWalletOption(key);
      onClose();
    } catch (error) {
      toast.error("Could not connect wallet", {
        description: error instanceof Error ? error.message : undefined,
      });
    } finally {
      setBusy(null);
    }
  }

  async function sendCode() {
    if (!email.includes("@")) {
      toast.error("Enter a valid email address");
      return;
    }
    setBusy("email");
    try {
      await connectWithEmail(email);
      setOtpSent(true);
      toast.success("Code sent", { description: `Check ${email} for your login code.` });
    } catch (error) {
      toast.error("Could not send the code", {
        description: error instanceof Error ? error.message : undefined,
      });
    } finally {
      setBusy(null);
    }
  }

  async function verifyCode() {
    setBusy("otp");
    try {
      await verifyOneTimePassword(otp);
      setOtp("");
      setOtpSent(false);
      onClose();
    } catch (error) {
      toast.error("Invalid code", {
        description: error instanceof Error ? error.message : undefined,
      });
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end" role="dialog" aria-label="Connect wallet">
      <button aria-label="Close" className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative max-h-[85vh] w-full overflow-y-auto rounded-t-3xl bg-card p-4 pb-8">
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-secondary" />
        <h2 className="text-lg font-medium">Connect wallet</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Use an existing wallet, or continue with email and we'll create one for you.
        </p>

        <div className="mt-4 space-y-2">
          {options.map((option) => (
            <button
              key={option.key}
              onClick={() => void pickWallet(option.key)}
              disabled={busy !== null}
              className="flex w-full items-center gap-3 rounded-2xl bg-secondary/50 px-4 py-3.5 text-left disabled:opacity-60"
            >
              <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-secondary">
                <Wallet className="size-4 text-muted-foreground" />
              </span>
              <span className="min-w-0 flex-1 truncate text-base">{option.name}</span>
              {busy === option.key ? (
                <Loader2 className="size-4 animate-spin text-muted-foreground" />
              ) : option.isInstalledOnBrowser ? (
                <span className="text-xs text-muted-foreground">Detected</span>
              ) : null}
            </button>
          ))}
          {options.length === 0 ? (
            <p className="rounded-2xl bg-secondary/50 px-4 py-3.5 text-sm text-muted-foreground">
              No browser wallets detected — continue with email below.
            </p>
          ) : null}
        </div>

        <div className="mt-5 rounded-2xl bg-secondary/50 p-4">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Mail className="size-4 text-muted-foreground" />
            Continue with email
          </div>

          {otpSent ? (
            <div className="mt-3 space-y-2">
              <input
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                inputMode="numeric"
                placeholder="6-digit code"
                className="w-full rounded-full border border-border bg-card px-4 py-3 text-base outline-none"
              />
              <button
                onClick={() => void verifyCode()}
                disabled={busy !== null || otp.length < 4}
                className="w-full rounded-full bg-primary py-3 text-base font-medium text-primary-foreground disabled:opacity-60"
              >
                {busy === "otp" ? "Verifying…" : "Verify code"}
              </button>
              <button
                onClick={() => setOtpSent(false)}
                className="w-full py-1 text-sm text-muted-foreground"
              >
                Use a different email
              </button>
            </div>
          ) : (
            <div className="mt-3 space-y-2">
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                autoComplete="email"
                placeholder="you@email.com"
                className="w-full rounded-full border border-border bg-card px-4 py-3 text-base outline-none"
              />
              <button
                onClick={() => void sendCode()}
                disabled={busy !== null}
                className="w-full rounded-full bg-primary py-3 text-base font-medium text-primary-foreground disabled:opacity-60"
              >
                {busy === "email" ? "Sending…" : "Send code"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
