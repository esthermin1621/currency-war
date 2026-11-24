import { useEffect } from 'react';
import { atiRate, fmtRate, nationDef, wordById, type WordDef } from '../data';
import { speak } from '../lib/speech';
import { useGame } from '../store/game';
import { SpeakButton } from './SpeakButton';

export function WordCardView({ word, happened, compact }: { word: WordDef; happened?: string; compact?: boolean }) {
  const { koHints, teacherTalk } = useGame((s) => s.settings);
  return (
    <div className={`panel flex flex-col gap-2 bg-amber-50 ${compact ? 'p-3 text-[16px]' : 'p-6'}`}>
      <div className="flex items-center gap-3">
        <span className={compact ? 'text-3xl' : 'text-5xl'}>{word.icon}</span>
        <span className={`font-black uppercase ${compact ? 'text-xl' : 'text-4xl'}`}>{word.word}</span>
        <span className="flex-1" />
        <SpeakButton small={compact} text={`${word.word}. ${word.def}`} />
      </div>
      <p className={`font-bold ${compact ? '' : 'text-2xl'}`}>{word.def}</p>
      <p><b>📍 In your land:</b> {happened ?? word.happened}</p>
      <p><b>🏺 Long ago:</b> {word.history}</p>
      {koHints && <p className="rounded-xl bg-white px-3 py-1 text-[16px]">🇰🇷 {word.ko}</p>}
      {teacherTalk && !compact && <p className="rounded-xl bg-sky-100 px-3 py-1 text-[17px]">🧑‍🏫 Teacher Talk: {word.talk}</p>}
    </div>
  );
}

/** Pops up in the middle of the screen the first time something happens. */
export function WordCardModal() {
  const game = useGame((s) => s.game);
  const dismiss = useGame((s) => s.dismissWord);
  const id = game?.wordQueue[0];
  const word = id ? wordById(id) : null;
  useEffect(() => {
    if (word) speak(`This is called ${word.word}. ${word.def}`);
  }, [word]);
  if (!game || !word) return null;

  const me = game.world.nations[game.world.playerId];
  const def = nationDef(me.id);
  const rate = atiRate(me.id, me.acValue);
  const happened = word.id === 'exchange' ? `Now 1 ATI COIN = ${fmtRate(rate)} ${def.currency}.` : undefined;
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-ink/60 p-6">
      <div className="pop w-full max-w-2xl">
        <div className="mb-2 text-center text-2xl font-black text-white">✨ New word! This is called…</div>
        <WordCardView word={word} happened={happened} />
        <div className="mt-4 text-center">
          <button className="btn btn-green" onClick={dismiss}>Got it! 👍</button>
        </div>
      </div>
    </div>
  );
}
