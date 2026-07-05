"use client";

import { useSyncExternalStore } from "react";

/**
 * Ambient audio state. OFF by default, never autoplays. The actual <audio>
 * element lives in AudioManager; this store just holds the on/off intent and
 * persists it so the choice survives navigation.
 */
let enabled = false;
let ready = false;
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

export const audioState = {
  init() {
    if (ready) return;
    ready = true;
    try {
      enabled = localStorage.getItem("audio-enabled") === "1";
    } catch {
      enabled = false;
    }
    emit();
  },
  set(v: boolean) {
    enabled = v;
    try {
      localStorage.setItem("audio-enabled", v ? "1" : "0");
    } catch {
      /* ignore */
    }
    emit();
  },
  toggle() {
    audioState.set(!enabled);
  },
  get() {
    return enabled;
  },
};

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function useAudioEnabled(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => enabled,
    () => false
  );
}
