import type { NationState } from '../engine/types';

const arrow = (now: number, before: number | undefined, eps = 0.5) =>
  before === undefined || Math.abs(now - before) < eps ? '' : now > before ? '⬆️' : '⬇️';

function Gauge({ icon, value }: { icon: string; value: number }) {
  const full = Math.round(value / 20);
  return (
    <span className="whitespace-nowrap text-[19px] tracking-tighter" aria-label={`${full} of 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} style={{ opacity: i < full ? 1 : 0.18, filter: i < full ? 'none' : 'grayscale(1)' }}>{icon}</span>
      ))}
    </span>
  );
}

function Tile({ label, trend, good, children }: { label: string; trend: string; good?: boolean; children: React.ReactNode }) {
  const bg = !trend || good === undefined ? 'bg-white' : good ? 'bg-green-100' : 'bg-red-100';
  return (
    <div className={`flex min-w-0 flex-auto items-center justify-center gap-1 whitespace-nowrap rounded-2xl border-[3px] border-ink px-1.5 py-1 ${bg}`}>
      <span className="text-[15px] font-black">{label}</span>
      {children}
      {trend && <span className="pop text-xl">{trend}</span>}
    </div>
  );
}

/** Five big picture meters. No percent signs: pictures, counts and arrows only. */
export function StatStrip({ s, prev }: { s: NationState; prev?: NationState }) {
  const t = {
    bread: arrow(s.breadPrice, prev?.breadPrice, 0.05),
    trust: arrow(s.trust, prev?.trust),
    jobs: arrow(s.jobs, prev?.jobs),
    happy: arrow(s.happiness, prev?.happiness),
    gold: arrow(s.treasury, prev?.treasury),
  };
  return (
    <div className="flex gap-2">
      <Tile label="Bread" trend={t.bread}>
        <span className="text-2xl">🍞</span>
        <span className="text-2xl font-black tabular-nums">{s.breadPrice >= 100 ? Math.round(s.breadPrice) : s.breadPrice.toFixed(1)}</span>
      </Tile>
      <Tile label="Trust" trend={t.trust} good={t.trust === '⬆️'}><Gauge icon="❤️" value={s.trust} /></Tile>
      <Tile label="Jobs" trend={t.jobs} good={t.jobs === '⬆️'}><Gauge icon="🔨" value={s.jobs} /></Tile>
      <Tile label="Happy" trend={t.happy} good={t.happy === '⬆️'}>
        <Gauge icon={s.happiness >= 60 ? '😀' : s.happiness >= 35 ? '😐' : '😢'} value={s.happiness} />
      </Tile>
      <Tile label="Gold" trend={t.gold} good={t.gold === '⬆️'}>
        <span className="text-2xl">💰</span>
        <span className="text-2xl font-black tabular-nums">{s.treasury}</span>
        {s.debt > 0 && <span className="rounded-lg bg-red-200 px-1 text-[15px] font-bold">📝{s.debt}</span>}
        {s.bitcoin > 0 && <span className="rounded-lg bg-amber-200 px-1 text-[15px] font-bold">₿{Math.round(s.bitcoin)}</span>}
      </Tile>
    </div>
  );
}
