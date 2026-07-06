"use client";

import { useSyncExternalStore } from "react";

function makeMediaHook(query: string) {
  return function useMedia(): boolean {
    return useSyncExternalStore(
      (cb) => {
        const mq = window.matchMedia(query);
        mq.addEventListener("change", cb);
        return () => mq.removeEventListener("change", cb);
      },
      () => window.matchMedia(query).matches,
      () => false // server snapshot: assume no preference / fine pointer
    );
  };
}

/** Reactive prefers-reduced-motion. Every animated component gates on this. */
export const useReducedMotion = makeMediaHook("(prefers-reduced-motion: reduce)");

/** True on touch / coarse-pointer devices (skip custom cursor, heavy 3D). */
export const useCoarsePointer = makeMediaHook("(pointer: coarse)");

/**
 * False during SSR and the first client render, true afterward. Use to gate
 * client-only rendering (WebGL canvas, storage reads) without setState-in-effect.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}
