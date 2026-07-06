/** Faint CRT scanline overlay across the whole viewport. */
export function Scanline() {
  return (
    <div
      aria-hidden
      className="scanlines pointer-events-none fixed inset-0 z-[90] opacity-60 mix-blend-overlay"
    />
  );
}
