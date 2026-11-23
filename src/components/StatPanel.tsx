import { nationDef } from '../data';
import type { NationState } from '../engine/types';

const arrow = (now: number, before: number | undefined, eps = 0.5) =>
  before === undefined || Math.abs(now - before) < eps ? '➡️' : now > before ? '⬆️' : '⬇️';

function Gauge({ icon, value }: { icon: string; value: number }) {
  const full = Math.round(value / 20);
  return (
    <span className="text-[22px] tracking-tight" aria-label={`${full} of 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} style={{ opacity: i < full ? 1 : 0.18, filter: i < full ? 'none' : 'grayscale(1)' }}>{icon}</span>
      ))}
    </span>
  );
}

function Row({ label, children, trend, good }: { label: string; children: React.ReactNode; trend: string; good?: boolean | null }) {
  const bg = good == null || trend === '➡️' ? 'bg-white' : good ? 'bg-green-100' : 'bg-red-100';
  return (
    <div className={`flex items-center gap-2 rounded-2xl border-2 border-ink/70 px-3 py-1.5 ${bg}`}>
      <div className="min-w-0 flex-1">
        <div className="text-[13px] font-extrabold uppercase tracking-wide text-ink/60">{label}</div>
        <div className="flex items-center gap-1 font-extrabold">{children}</div>
      </div>
      <div className="text-2xl" aria-label="change">{trend}</div>
    </div>
  );
}

/** The six numbers of the land. Every number has a picture and an arrow, never a percent. */
export function StatPanel({ s, prev }: { s: NationState; prev?: NationState }) {
  const def = nationDef(s.id);
  const rate = (def.acRate * 100) / s.acValue;
  const t = {
    bread: arrow(s.breadPrice, prev?.breadPrice, 0.05),
    trust: arrow(s.trust, prev?.trust),
    jobs: arrow(s.jobs, prev?.jobs),
    happy: arrow(s.happiness, prev?.happiness),
    gold: arrow(s.treasury, prev?.treasury),
    ac: arrow(s.acValue, prev?.acValue),
  };
  return (
    <div className="flex flex-col gap-1.5">
      <Row label="Bread price" trend={t.bread} good={null}>
        <span className="text-3xl">🍞</span>
        <span className="text-3xl tabular-nums">{s.breadPrice >= 100 ? Math.round(s.breadPrice) : s.breadPrice.toFixed(1)}</span>
      </Row>
      <Row label="Trust" trend={t.trust} good={t.trust === '⬆️'}><Gauge icon="❤️" value={s.trust} /></Row>
      <Row label="Jobs" trend={t.jobs} good={t.jobs === '⬆️'}><Gauge icon="🔨" value={s.jobs} /></Row>
      <Row label="Happy" trend={t.happy} good={t.happy === '⬆️'}>
        <Gauge icon={s.happiness >= 60 ? '😀' : s.happiness >= 35 ? '😐' : '😢'} value={s.happiness} />
      </Row>
      <Row label="Gold box" trend={t.gold} good={t.gold === '⬆️'}>
        <span className="text-2xl">💰</span>
        <span className="text-2xl tabular-nums">{s.treasury}</span>
        {s.debt > 0 && <span className="ml-1 rounded-lg bg-red-200 px-1.5 text-base">📝 −{s.debt}</span>}
        {s.bitcoin > 0 && <span className="ml-1 rounded-lg bg-amber-200 px-1.5 text-base">₿ {Math.round(s.bitcoin)}</span>}
      </Row>
      <Row label="Arti-Coin rate" trend={t.ac} good={t.ac === '⬆️'}>
        <span className="text-[17px] leading-tight">🪙 1 = {rate >= 100 ? Math.round(rate) : rate.toFixed(1)} {def.currency}</span>
      </Row>
    </div>
  );
}
