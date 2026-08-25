import { Suspense, lazy, useEffect, useState } from "react";

/**
 * KLineChart renders to canvas and touches `window` at import time, so it is
 * only loaded after hydration.
 */
const KLineChartPanel = lazy(() => import("@/components/KLineChartPanel"));

function Placeholder() {
  return <div className="mt-2 h-[380px] w-full animate-pulse rounded-xl bg-secondary/60" />;
}

export function LiveChart({ symbol }: { symbol: string }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <Placeholder />;
  return (
    <Suspense fallback={<Placeholder />}>
      <KLineChartPanel symbol={symbol} />
    </Suspense>
  );
}
