import type { NationState } from '../engine/types';

const LEVELS = [
  { label: 'Empty streets', scene: '🏚️ 🕸️ 😢 🥀', bg: '#e5e7eb' },
  { label: 'Hard times', scene: '🏠 🧺 😟 🌧️', bg: '#fed7aa' },
  { label: 'Getting by', scene: '🏠 🏪 😐 🍞', bg: '#fef3c7' },
  { label: 'Doing well', scene: '🏡 🏪 🙂 🍞 🧺', bg: '#d9f99d' },
  { label: 'Busy and happy', scene: '🏛️ 🏪 😀 🍞 🎉', bg: '#bbf7d0' },
];

/** City picture in 5 steps (rich to fallen), plus the two piles that set the price: money and goods. */
export function CityScene({ s }: { s: NationState }) {
  const mood = (s.trust + s.happiness + s.jobs) / 3;
  const level = LEVELS[Math.min(4, Math.max(0, Math.floor((mood - 10) / 18)))];
  const pile = (icon: string, n: number) => icon.repeat(Math.min(8, Math.max(1, Math.round(n / 25))));
  return (
    <div className="mt-1.5 flex flex-col gap-1.5 text-[15px] font-bold">
      <div className="rounded-2xl border-2 border-ink/70 px-3 py-1 text-center" style={{ background: level.bg }}>
        <div className="text-2xl">{level.scene}</div>
        <div>{level.label}</div>
      </div>
      <div className="rounded-2xl border-2 border-ink/70 bg-white px-3 py-1 leading-tight">
        <div>Money<br />{pile('🪙', s.money)}</div>
        <div>Goods<br />{pile('🧺', s.goods)}</div>
      </div>
    </div>
  );
}
