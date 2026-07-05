"use client";

import { useSyncExternalStore } from "react";

export type Toast = {
  id: number;
  title: string;
  detail: string;
};

let toasts: Toast[] = [];
const seen = new Set<string>();
let nextId = 1;
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

export const toast = {
  /** Fire an achievement toast once per unique title (deduped). */
  unlock(t: { title: string; detail: string }) {
    if (seen.has(t.title)) return;
    seen.add(t.title);
    const item: Toast = { id: nextId++, ...t };
    toasts = [...toasts, item];
    emit();
    setTimeout(() => {
      toasts = toasts.filter((x) => x.id !== item.id);
      emit();
    }, 4200);
  },
  dismiss(id: number) {
    toasts = toasts.filter((x) => x.id !== id);
    emit();
  },
};

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}
function getSnapshot() {
  return toasts;
}

export function useToasts(): Toast[] {
  return useSyncExternalStore(subscribe, getSnapshot, () => toasts);
}
