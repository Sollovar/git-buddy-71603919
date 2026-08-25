import { Suspense, lazy, useEffect, useState } from "react";

import { usePair } from "@/hooks/use-pair";

/**
 * KLineChart renders to canvas and touches `window` at import time, so it is
 * only loaded after hydration.
 */
const DexKLineChart = lazy(() => import("@/components/dex/DexKLineChart"));

function Placeholder() {
  return <div className="min-h-0 flex-1 animate-pulse bg-secondary/40" />;
}

/** Desktop chart panel: full KLineCharts feature set, real market data. */
export function DexLiveChart() {
  const [pair] = usePair();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <Placeholder />;
  return (
    <Suspense fallback={<Placeholder />}>
      <DexKLineChart symbol={pair} />
    </Suspense>
  );
}
