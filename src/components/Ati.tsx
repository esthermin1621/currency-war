/** Ati, the coin guide. Ati says every prompt, so the screen feels like a friend is talking. */
export function Ati({ size = 76, sad }: { size?: number; sad?: boolean }) {
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
      <Ati sad={sad} size={size} />
      <div className="relative rounded-3xl border-[3px] border-ink bg-white px-5 py-2.5 shadow-[0_4px_0_rgba(59,47,47,.25)]">
        <span className="absolute -left-[13px] top-1/2 h-5 w-5 -translate-y-1/2 rotate-45 border-b-[3px] border-l-[3px] border-ink bg-white" />
        <div className="relative">{children}</div>
      </div>
    </div>
  );
}

/** ATI ATI logo: the coin buddy and a chunky, playful wordmark. */
export function AtiLogo({ height = 120, tagline = true }: { height?: number; tagline?: boolean }) {
  const h = tagline ? 132 : 104;
  return (
    <svg viewBox={`0 0 392 ${h}`} height={height} className="block" role="img" aria-label="ATI ATI">
      <g transform="translate(4,4) scale(0.96)">
        <circle cx="50" cy="56" r="46" fill="#d97706" />
        <circle cx="50" cy="50" r="46" fill="#fbbf24" stroke="#3b2f2f" strokeWidth="5" />
        <circle cx="50" cy="50" r="35" fill="none" stroke="#f59e0b" strokeWidth="4" />
        <circle cx="36" cy="44" r="6" fill="#3b2f2f" />
        <circle cx="64" cy="44" r="6" fill="#3b2f2f" />
        <circle cx="38" cy="42" r="2" fill="#fff" />
        <circle cx="66" cy="42" r="2" fill="#fff" />
        <circle cx="26" cy="58" r="6" fill="#fb7185" opacity=".6" />
        <circle cx="74" cy="58" r="6" fill="#fb7185" opacity=".6" />
        <path d="M34 60 Q50 78 66 60" fill="none" stroke="#3b2f2f" strokeWidth="5" strokeLinecap="round" />
      </g>
      <g fontWeight={900} fontSize={66} stroke="#3b2f2f" strokeWidth={10} paintOrder="stroke" strokeLinejoin="round">
        <text x={112} y={78} fill="#fbbf24" transform="rotate(-4 112 78)">ATI</text>
        <text x={240} y={84} fill="#38bdf8" transform="rotate(4 240 84)">ATI</text>
      </g>
      {tagline && (
        <text x={250} y={124} textAnchor="middle" fontSize={22} fontWeight={800} fill="#b45309" letterSpacing={3}>
          CURRENCY WARS
        </text>
      )}
    </svg>
  );
}
