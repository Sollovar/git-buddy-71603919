import { useSyncExternalStore } from "react";

const KEY = "selected-pair";
const DEFAULT_PAIR = "BTCUSDT";

let pair = DEFAULT_PAIR;
const listeners = new Set<() => void>();

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

function getSnapshot() {
  if (typeof window !== "undefined") {
    const stored = window.localStorage.getItem(KEY);
    if (stored && stored !== pair) pair = stored;
  }
  return pair;
}

function getServerSnapshot() {
  return DEFAULT_PAIR;
}

export function setPair(next: string) {
  pair = next;
  if (typeof window !== "undefined") window.localStorage.setItem(KEY, next);
  listeners.forEach((l) => l());
}

export function usePair(): [string, (next: string) => void] {
  const value = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return [value, setPair];
}
