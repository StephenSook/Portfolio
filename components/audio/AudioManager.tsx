"use client";

import { useEffect, useRef } from "react";
import { audioState, useAudioEnabled } from "@/lib/audio";

/**
 * Mounts the ambient audio element and a mute toggle. Never autoplays: audio
 * only starts after the user opts in (boot consent or this toggle). The track
 * file is added in Milestone 4; until then the toggle is a no-op-safe control.
 */
export function AudioManager() {
  const enabled = useAudioEnabled();
  const ref = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    audioState.init();
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (enabled) {
      el.volume = 0.16;
      el.play().catch(() => {
        /* browser blocked; user can retry via toggle */
      });
    } else {
      el.pause();
    }
  }, [enabled]);

  return (
    <>
      <audio ref={ref} loop preload="none" src="/audio/calm.mp3" />
      <button
        type="button"
        onClick={() => audioState.toggle()}
        aria-pressed={enabled}
        aria-label={enabled ? "Mute ambient audio" : "Play ambient audio"}
        className="fixed right-4 top-4 z-[110] grid h-10 w-10 place-items-center rounded-full border border-[var(--line-strong)] bg-[var(--panel)]/70 text-[var(--text)] backdrop-blur transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
      >
        {enabled ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M3 10v4h4l5 5V5L7 10H3zm13.5 2a4.5 4.5 0 00-2.5-4v8a4.5 4.5 0 002.5-4zM14 3.2v2.1a7 7 0 010 13.4v2.1a9 9 0 000-17.6z" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M3 10v4h4l5 5V5L7 10H3zm18.3-1.3l-1.4-1.4L17 10.2 14.1 7.3l-1.4 1.4L15.6 11.6l-2.9 2.9 1.4 1.4L17 13l2.9 2.9 1.4-1.4L18.4 11.6l2.9-2.9z" />
          </svg>
        )}
      </button>
    </>
  );
}
