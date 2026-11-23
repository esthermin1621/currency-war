import { useState } from 'react';
import type { Card } from '../engine/types';
import { useGame } from '../store/game';
import { SpeakButton } from './SpeakButton';

/** A policy card. First tap flips it to show a hint. The Choose button plays it. */
export function CardView({ card, onChoose }: { card: Card; onChoose: () => void }) {
  const [flipped, setFlipped] = useState(false);
  const ko = useGame((s) => s.settings.koHints);
  const special = !!card.nation;
  const tint = special ? 'bg-fuchsia-200' : card.role === 'president' ? 'bg-sky-200' : 'bg-amber-200';
  return (
    <div className="h-[252px] w-[200px] [perspective:1000px]">
      <div className={`flip relative h-full w-full ${flipped ? 'flipped' : ''}`}>
        <button
          onClick={() => setFlipped(true)}
          className="face absolute inset-0 flex flex-col items-center overflow-hidden rounded-3xl border-[3px] border-ink bg-white shadow-[0_5px_0_#3b2f2f]"
        >
          <span className={`relative flex h-[112px] w-full items-center justify-center text-[76px] leading-none ${tint}`}>
            {card.icon}
            {special && <span className="absolute left-2 top-2 rounded-full bg-fuchsia-600 px-2 py-0.5 text-[13px] font-bold text-white">★ Special</span>}
          </span>
          <span className="mt-1.5 px-2 text-[19px] font-black leading-tight">{card.name}</span>
          <span className="px-2 text-[16px] leading-snug">{card.text}</span>
          <span className="mb-1.5 mt-auto text-[14px] font-bold text-ink/50">Tap to turn over</span>
        </button>
        <div className={`face face-back absolute inset-0 flex flex-col items-center gap-1 rounded-3xl border-[3px] border-ink p-2.5 shadow-[0_5px_0_#3b2f2f] ${tint}`}>
          <div className="flex w-full items-center justify-between">
            <span className="text-3xl">{card.icon}</span>
            <SpeakButton small text={`${card.text} ${card.hint}`} />
          </div>
          {card.pic && <div className="whitespace-nowrap rounded-2xl bg-white px-2 py-0.5 text-[22px] tracking-tighter">{card.pic}</div>}
          <span className="text-[16px] font-bold leading-snug">{card.hint}</span>
          {ko && card.ko && <span className="text-[12px] leading-tight">🇰🇷 {card.ko}</span>}
          <span className="flex-1" />
          <button className="btn btn-green !min-h-[52px] w-full !px-2 !text-xl" onClick={onChoose}>Choose ✔</button>
          <button className="text-[14px] font-bold underline" onClick={() => setFlipped(false)}>Turn back</button>
        </div>
      </div>
    </div>
  );
}
