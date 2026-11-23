import { useState } from 'react';
import type { Card } from '../engine/types';
import { useGame } from '../store/game';
import { SpeakButton } from './SpeakButton';

/** A policy card. First tap flips it to show a hint. The Choose button plays it. */
export function CardView({ card, onChoose }: { card: Card; onChoose: () => void }) {
  const [flipped, setFlipped] = useState(false);
  const ko = useGame((s) => s.settings.koHints);
  const special = !!card.nation;
  return (
    <div className="h-[244px] w-[172px] [perspective:1000px]">
      <div className={`flip relative h-full w-full ${flipped ? 'flipped' : ''}`}>
        <button
          onClick={() => setFlipped(true)}
          className={`face absolute inset-0 flex flex-col items-center gap-1.5 rounded-3xl border-[3px] border-ink p-3 shadow-[0_5px_0_#3b2f2f] ${special ? 'bg-fuchsia-100' : 'bg-white'}`}
        >
          {special && <span className="rounded-full bg-fuchsia-600 px-2 text-[13px] font-bold text-white">★ Special</span>}
          <span className="text-5xl">{card.icon}</span>
          <span className="text-[18px] font-black leading-tight">{card.name}</span>
          <span className="text-[16px] leading-snug">{card.text}</span>
          <span className="mt-auto text-[14px] font-bold text-ink/50">Tap to turn over</span>
        </button>
        <div className="face face-back absolute inset-0 flex flex-col items-center gap-1 rounded-3xl border-[3px] border-ink bg-amber-100 p-2.5 shadow-[0_5px_0_#3b2f2f]">
          <div className="flex w-full items-center justify-between">
            <span className="text-2xl">{card.icon}</span>
            <SpeakButton small text={`${card.text} ${card.hint}`} />
          </div>
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
