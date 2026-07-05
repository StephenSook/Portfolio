"use client";

import { useToasts } from "@/lib/toast";

/** Xbox-style achievement popups, bottom-right. Live region for a11y. */
export function AchievementToaster() {
  const toasts = useToasts();
  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed bottom-4 right-4 z-[120] flex flex-col gap-2"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          className="hud-frame flex items-center gap-3 rounded-sm px-4 py-3 shadow-lg animate-[toast-in_0.35s_ease]"
          style={{ minWidth: 240 }}
        >
          <span
            aria-hidden
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[var(--accent)] text-[var(--accent)]"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.8 5.9 21.4l1.4-6.8L2.2 9.9l6.9-.8L12 2z"
                fill="currentColor"
              />
            </svg>
          </span>
          <div className="min-w-0">
            <p className="hud-label !text-[var(--muted)]">Achievement unlocked</p>
            <p className="truncate font-hud text-sm font-semibold text-[var(--text)]">
              {t.title}
            </p>
            <p className="truncate text-xs text-[var(--muted)]">{t.detail}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
