import type { NationState } from '../engine/types';
import { JOKES, pickLine } from '../lib/fun';

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, Math.round(v)));
const fmt = (n: number) => (n >= 100 ? Math.round(n).toString() : n.toFixed(1));
const SHIRTS = ['#f87171', '#60a5fa', '#34d399', '#fbbf24', '#c084fc'];
const SKIN = ['#fcd9b6', '#e8b98a', '#c68b59', '#fcd9b6', '#a8724a'];

function Person({ x, y, i, face, tool, idle }: { x: number; y: number; i: number; face: 'happy' | 'flat' | 'sad'; tool?: boolean; idle?: boolean }) {
  const mouth = face === 'happy' ? 'M-6 3 Q0 10 6 3' : face === 'sad' ? 'M-6 8 Q0 2 6 8' : 'M-5 6 L5 6';
  return (
    <g transform={`translate(${x},${y})`} opacity={idle ? 0.55 : 1}>
      <rect x={-13} y={14} width={26} height={30} rx={10} fill={idle ? '#9ca3af' : SHIRTS[i % 5]} stroke="#3b2f2f" strokeWidth={2} />
      <circle r={15} fill={SKIN[i % 5]} stroke="#3b2f2f" strokeWidth={2} />
      <circle cx={-5} cy={-3} r={2.2} fill="#3b2f2f" />
      <circle cx={5} cy={-3} r={2.2} fill="#3b2f2f" />
      <path d={mouth} fill="none" stroke="#3b2f2f" strokeWidth={2.2} strokeLinecap="round" />
      {face === 'sad' && <path d="M9 1 q3 5 0 7 q-3 -2 0 -7" fill="#38bdf8" />}
      {tool && <text x={12} y={22} fontSize={22}>🔨</text>}
      {idle && <text x={10} y={-12} fontSize={15}>💤</text>}
    </g>
  );
}

/**
 * The town is the main picture of the game. Every number is something you can see:
 * bread sign = price, baskets = goods, coin stacks = money, hearts = trust,
 * faces = happy, hammers = jobs, weather = how the land is doing.
 */
export function TownScene({ s, year = 0 }: { s: NationState; year?: number }) {
  const mood = (s.trust + s.happiness + s.jobs) / 3;
  const level = mood >= 72 ? 3 : mood >= 50 ? 2 : mood >= 30 ? 1 : 0;
  const sky = ['#9aa5b1', '#c3d3e0', '#a9def7', '#86d3f8'][level];
  const grass = ['#a9a57e', '#b6c88c', '#98d57c', '#7fd46c'][level];
  const hill = ['#bdb994', '#c8d6a3', '#b4e39b', '#a2e48f'][level];
  const happy = clamp(s.happiness / 20, 0, 5);
  const jobs = clamp(s.jobs / 20, 0, 5);
  const hearts = clamp(s.trust / 20, 0, 5);
  const coins = clamp(s.money / 12, 1, 36);
  const baskets = clamp(s.goods / 12, 1, 12);
  const T = JOKES.town;
  const mood2 = s.breadPrice >= 30 ? T.veryHigh : s.trust <= 25 ? T.noTrust : s.breadPrice >= 15 ? T.high
    : s.jobs < 50 ? T.noJobs : s.breadPrice < 8 ? T.low : s.happiness < 35 ? T.sad : T.happy;
  const say = pickLine(mood2, s.id, year, 'town');
  const sayFace = mood2 === T.happy ? 'happy' : mood2 === T.high || mood2 === T.veryHigh ? 'flat' : 'sad';
  const face = (i: number) => (i < happy ? 'happy' : s.happiness < 35 ? 'sad' : 'flat') as 'happy' | 'flat' | 'sad';

  return (
    <svg viewBox="0 0 1000 250" className="block h-full w-full" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Your town">
      <rect width="1000" height="250" fill={sky} />
      {level >= 2 && (
        <g transform="translate(930,42)">
          {Array.from({ length: 8 }, (_, i) => <line key={i} x1={0} y1={-34} x2={0} y2={-44} stroke="#fbbf24" strokeWidth={5} strokeLinecap="round" transform={`rotate(${i * 45})`} />)}
          <circle r={27} fill="#fde047" stroke="#f59e0b" strokeWidth={3} />
        </g>
      )}
      {[[90, 38, 1], [520, 28, 0.8], [760, 50, 0.7]].slice(0, level >= 3 ? 1 : 3).map(([x, y, k], i) => (
        <g key={i} transform={`translate(${x},${y}) scale(${k})`} fill={level <= 1 ? '#6b7280' : '#fff'} opacity={0.95}>
          <ellipse rx={44} ry={17} /><ellipse cx={-18} cy={-12} rx={22} ry={16} /><ellipse cx={16} cy={-15} rx={26} ry={19} />
          {level === 0 && [-24, -6, 12, 30].map((dx) => <line key={dx} x1={dx} y1={24} x2={dx - 6} y2={44} stroke="#60a5fa" strokeWidth={4} strokeLinecap="round" />)}
        </g>
      ))}
      <ellipse cx="260" cy="205" rx="430" ry="75" fill={hill} />
      <ellipse cx="820" cy="210" rx="380" ry="65" fill={hill} />
      <rect y="178" width="1000" height="72" fill={grass} />
      <rect y="232" width="1000" height="18" fill="#d6c7a1" />

      {/* Bakery: the sign shows the bread price */}
      <g transform="translate(40,0)">
        <rect x={0} y={84} width={190} height={104} fill="#fde7c3" stroke="#3b2f2f" strokeWidth={3} />
        <path d="M-12 86 L95 34 L202 86 Z" fill="#c2410c" stroke="#3b2f2f" strokeWidth={3} />
        {[0, 1, 2, 3, 4].map((i) => <rect key={i} x={i * 38} y={86} width={38} height={18} fill={i % 2 ? '#fff' : '#f87171'} stroke="#3b2f2f" strokeWidth={2} />)}
        <rect x={18} y={116} width={72} height={46} rx={4} fill="#bae6fd" stroke="#3b2f2f" strokeWidth={3} />
        <text x={54} y={150} fontSize={28} textAnchor="middle">{baskets >= 3 ? '🍞🥖' : '🍞'}</text>
        <rect x={118} y={120} width={46} height={68} rx={4} fill="#92400e" stroke="#3b2f2f" strokeWidth={3} />
        <g transform="translate(206,58)">
          <rect x={0} y={0} width={150} height={66} rx={14} fill="#fff" stroke="#3b2f2f" strokeWidth={4} />
          <rect x={66} y={66} width={10} height={64} fill="#92400e" stroke="#3b2f2f" strokeWidth={2} />
          <text x={12} y={46} fontSize={36}>🍞</text>
          <text x={144} y={47} fontSize={38} fontWeight={900} textAnchor="end" fill="#3b2f2f">{fmt(s.breadPrice)}</text>
        </g>
      </g>

      {/* Market: baskets are the goods */}
      <g transform="translate(430,0)">
        <rect x={6} y={96} width={8} height={92} fill="#92400e" /><rect x={226} y={96} width={8} height={92} fill="#92400e" />
        {[0, 1, 2, 3, 4, 5].map((i) => <path key={i} d={`M${i * 40} 78 h40 v22 q-20 14 -40 0 Z`} fill={i % 2 ? '#fff' : '#34d399'} stroke="#3b2f2f" strokeWidth={2.5} />)}
        <rect x={0} y={150} width={240} height={14} rx={3} fill="#b45309" stroke="#3b2f2f" strokeWidth={3} />
        <rect x={10} y={164} width={220} height={26} fill="#d97706" stroke="#3b2f2f" strokeWidth={3} />
        {Array.from({ length: baskets }, (_, i) => (
          <text key={i} x={8 + (i % 6) * 38} y={i < 6 ? 148 : 122} fontSize={30}>🧺</text>
        ))}
        <text x={120} y={184} fontSize={17} fontWeight={900} textAnchor="middle" fill="#fff">GOODS</text>
      </g>

      {/* Bank: coin stacks are the money, hearts are trust */}
      <g transform="translate(730,0)">
        <path d="M-10 92 L100 44 L210 92 Z" fill="#e5e7eb" stroke="#3b2f2f" strokeWidth={3} />
        <rect x={0} y={92} width={200} height={14} fill="#f3f4f6" stroke="#3b2f2f" strokeWidth={3} />
        <rect x={6} y={106} width={188} height={76} fill="#f9fafb" stroke="#3b2f2f" strokeWidth={3} />
        {[22, 68, 114, 160].map((x) => <rect key={x} x={x} y={106} width={18} height={76} fill="#e5e7eb" stroke="#3b2f2f" strokeWidth={2.5} />)}
        <rect x={-6} y={182} width={212} height={10} fill="#d1d5db" stroke="#3b2f2f" strokeWidth={3} />
        <text x={100} y={82} fontSize={17} fontWeight={900} textAnchor="middle" fill="#3b2f2f">BANK</text>
        <text x={100} y={30} fontSize={24} textAnchor="middle">
          {Array.from({ length: 5 }, (_, i) => <tspan key={i} opacity={i < hearts ? 1 : 0.2}>{i < hearts ? '❤️' : '🤍'}</tspan>)}
        </text>
        {Array.from({ length: coins }, (_, i) => {
          const col = Math.floor(i / 6);
          return <ellipse key={i} cx={22 + col * 31} cy={226 - (i % 6) * 8} rx={13} ry={5.5} fill="#fbbf24" stroke="#92400e" strokeWidth={2} />;
        })}
      </g>

      {/* People: faces show happy, hammers show jobs */}
      {s.breadPrice >= 30 && <text x={150} y={240} fontSize={34}>🛒💰</text>}
      <Person x={698} y={198} i={3} face={sayFace} />
      <g>
        <rect x={520} y={10} width={232} height={46} rx={18} fill="#fff" stroke="#3b2f2f" strokeWidth={3} />
        <path d="M682 54 L700 54 L698 176 Z" fill="#fff" stroke="#3b2f2f" strokeWidth={3} strokeLinejoin="round" />
        <rect x={680} y={50} width={22} height={8} fill="#fff" />
        <text x={636} y={40} textAnchor="middle" fontSize={18} fontWeight={800} fill="#3b2f2f">{say}</text>
      </g>
      {[0, 1, 2, 3, 4].map((i) => <Person key={`h${i}`} x={250 + i * 38} y={196} i={i} face={face(i)} />)}
      {[0, 1, 2, 3, 4].map((i) => <Person key={`w${i}`} x={468 + i * 46} y={200} i={i + 2} face={i < jobs ? 'happy' : 'flat'} tool={i < jobs} idle={i >= jobs} />)}
    </svg>
  );
}
