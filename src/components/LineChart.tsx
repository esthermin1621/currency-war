/** Bread price line, year 0 (start) to now. */
export function LineChart({ values, height = 170 }: { values: number[]; height?: number }) {
  const W = 520;
  const pad = { l: 44, r: 16, t: 14, b: 28 };
  const max = Math.max(...values, 12) * 1.1;
  const min = Math.min(...values, 8) * 0.9;
  const x = (i: number) => pad.l + (i * (W - pad.l - pad.r)) / Math.max(1, values.length - 1);
  const y = (v: number) => pad.t + ((max - v) * (height - pad.t - pad.b)) / (max - min);
  const pts = values.map((v, i) => `${x(i)},${y(v)}`).join(' ');
  return (
    <svg viewBox={`0 0 ${W} ${height}`} className="w-full" role="img" aria-label="Bread price each year">
      {[min, (min + max) / 2, max].map((v, i) => (
        <g key={i}>
          <line x1={pad.l} x2={W - pad.r} y1={y(v)} y2={y(v)} stroke="#3b2f2f" strokeOpacity={0.15} />
          <text x={pad.l - 6} y={y(v) + 5} textAnchor="end" fontSize={13} fill="#3b2f2f">{v >= 100 ? Math.round(v) : v.toFixed(0)}</text>
        </g>
      ))}
      <polyline points={pts} fill="none" stroke="#d97706" strokeWidth={4} strokeLinejoin="round" strokeLinecap="round" />
      {values.map((v, i) => (
        <g key={i}>
          <text x={x(i)} y={y(v) + 7} textAnchor="middle" fontSize={i === values.length - 1 ? 26 : 17}>🍞</text>
          <text x={x(i)} y={height - 8} textAnchor="middle" fontSize={14} fontWeight={700} fill="#3b2f2f">{i === 0 ? 'Start' : i}</text>
        </g>
      ))}
    </svg>
  );
}
