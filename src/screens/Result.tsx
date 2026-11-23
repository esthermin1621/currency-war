import { useEffect, useState } from 'react';
import { Arti } from '../components/Arti';
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
  const reason = REASON[result.reason];
  const trend = (g: number) => (g > 0.15 ? '⬆️⬆️' : g > 0.01 ? '⬆️' : g < -0.15 ? '⬇️⬇️' : g < -0.01 ? '⬇️' : '➡️');
  const tile = 'flex h-28 w-36 flex-col items-center justify-center rounded-3xl border-[3px] border-ink bg-white';

  return (
    <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
      {/* The whole lesson as one picture: money and goods make the bread price. */}
      <div className="flex items-center gap-3 text-4xl font-black">
        <div className={tile}><div className="text-4xl">🪙 {trend(result.moneyGrowth)}</div><div className="text-xl">Money</div></div>
        <span>+</span>
        <div className={tile}><div className="text-4xl">🧺 {trend(result.goodsGrowth)}</div><div className="text-xl">Goods</div></div>
        <span>=</span>
        <div className="flex h-28 flex-col items-center justify-center rounded-3xl border-[3px] border-ink px-6" style={{ background: p.color }}>
          <div className="text-5xl tabular-nums">🍞 {fmt(price)} {dir}</div>
          <div className="text-[16px] font-bold text-ink/60">It was {fmt(prev.breadPrice)}.</div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Arti size={56} sad={result.phenomenon !== 'stable' && result.phenomenon !== 'mild'} />
        <div className="text-2xl font-black">{p.title}</div>
        <div className={`rounded-full border-2 border-ink/50 px-3 text-[17px] font-bold ${last.correct ? 'bg-green-200' : 'bg-white'}`}>
          {last.correct ? '⭐ Your guess was right!' : 'Good try!'}
        </div>
      </div>
      {result.notes.filter((n) => NOTE[n]).slice(0, 1).map((n) => <div key={n} className="text-[18px] font-bold">{NOTE[n]}</div>)}
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
