import { useEffect, useState } from 'react';
import { SpeakButton } from '../components/SpeakButton';
import { NOTE, PHENOMENON, REASON } from '../lib/text';
import { useGame } from '../store/game';

function useCountUp(from: number, to: number, ms = 2500) {
  const [v, setV] = useState(from);
  useEffect(() => {
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / ms);
      setV(from + (to - from) * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [from, to, ms]);
  return v;
}

const fmt = (n: number) => (n >= 100 ? Math.round(n).toString() : n.toFixed(1));

export function Result() {
  const { game, toReport } = useGame();
  const [why, setWhy] = useState(false);
  const last = game!.last!;
  const { prev, result } = last;
  const s = result.state;
  const price = useCountUp(prev.breadPrice, s.breadPrice);
  const p = PHENOMENON[result.phenomenon];
  const dir = s.breadPrice > prev.breadPrice + 0.05 ? '⬆️' : s.breadPrice < prev.breadPrice - 0.05 ? '⬇️' : '➡️';
  const chips: [string, number][] = [['❤️ Trust', s.trust - prev.trust], ['🔨 Jobs', s.jobs - prev.jobs], ['😀 Happy', s.happiness - prev.happiness], ['💰 Gold', s.treasury - prev.treasury]];
  const reason = REASON[result.reason];

  return (
    <div className="flex h-full flex-col items-center justify-center gap-2.5 text-center">
      <div className="flex items-center gap-4">
        <div className="rounded-3xl border-[3px] border-ink px-6 py-2" style={{ background: p.color }}>
          <div className="text-[15px] font-bold text-ink/60">🍞 Bread was {fmt(prev.breadPrice)}. Now it is</div>
          <div className="text-6xl font-black tabular-nums">{fmt(price)} {dir}</div>
        </div>
        <div className="max-w-sm text-left">
          <div className="text-4xl">{p.icon}</div>
          <div className="text-2xl font-black leading-tight">{p.title}</div>
          <div className={`mt-1 inline-block rounded-full px-3 text-[17px] font-bold ${last.correct ? 'bg-green-200' : 'bg-white'}`}>
            {last.correct ? '⭐ Your guess was right!' : '🤔 Not this time. Good try!'}
          </div>
        </div>
      </div>
      <div className="flex flex-wrap justify-center gap-2 text-[17px] font-bold">
        {chips.map(([label, d]) => (
          <span key={label} className={`rounded-full border-2 border-ink/60 px-3 py-0.5 ${Math.abs(d) < 0.5 ? 'bg-white' : d > 0 ? 'bg-green-100' : 'bg-red-100'} ${Math.abs(d) >= 8 ? 'ring-4 ring-amber-400' : ''}`}>
            {label} {Math.abs(d) < 0.5 ? '➡️' : d > 0 ? '⬆️' : '⬇️'}{Math.abs(d) >= 8 ? (d > 0 ? '⬆️' : '⬇️') : ''}
          </span>
        ))}
      </div>
      {result.notes.filter((n) => NOTE[n]).slice(0, 2).map((n) => <div key={n} className="text-[18px] font-bold">{NOTE[n]}</div>)}
      {why && (
        <div className="pop flex items-center gap-2 rounded-2xl border-2 border-ink bg-sky-100 px-4 py-1.5 text-xl font-bold">
          💡 {reason} <SpeakButton small text={reason} />
        </div>
      )}
      <div className="flex gap-3">
        {!why && <button className="btn btn-blue" onClick={() => setWhy(true)}>Why? 💡</button>}
        <button className="btn" onClick={toReport}>Next ➡</button>
      </div>
    </div>
  );
}
