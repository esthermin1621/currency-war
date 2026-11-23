/** Arti, the coin guide. Arti says every prompt, so the screen feels like a friend is talking. */
export function Arti({ size = 76, sad }: { size?: number; sad?: boolean }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className="shrink-0" aria-hidden>
      <circle cx="50" cy="52" r="44" fill="#d97706" />
      <circle cx="50" cy="48" r="44" fill="#fbbf24" stroke="#3b2f2f" strokeWidth="4" />
      <circle cx="50" cy="48" r="34" fill="none" stroke="#f59e0b" strokeWidth="4" />
      <circle cx="36" cy="42" r="6" fill="#3b2f2f" />
      <circle cx="64" cy="42" r="6" fill="#3b2f2f" />
      <circle cx="38" cy="40" r="2" fill="#fff" />
      <circle cx="66" cy="40" r="2" fill="#fff" />
      <circle cx="26" cy="56" r="6" fill="#fb7185" opacity=".6" />
      <circle cx="74" cy="56" r="6" fill="#fb7185" opacity=".6" />
      <path d={sad ? 'M36 68 Q50 56 64 68' : 'M34 58 Q50 76 66 58'} fill="none" stroke="#3b2f2f" strokeWidth="5" strokeLinecap="round" />
    </svg>
  );
}

export function Bubble({ children, sad, size }: { children: React.ReactNode; sad?: boolean; size?: number }) {
  return (
    <div className="flex items-center gap-2">
      <Arti sad={sad} size={size} />
      <div className="relative rounded-3xl border-[3px] border-ink bg-white px-5 py-2.5 shadow-[0_4px_0_rgba(59,47,47,.25)]">
        <span className="absolute -left-[13px] top-1/2 h-5 w-5 -translate-y-1/2 rotate-45 border-b-[3px] border-l-[3px] border-ink bg-white" />
        <div className="relative">{children}</div>
      </div>
    </div>
  );
}
