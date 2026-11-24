import { useEffect } from 'react';
import { QUESTS, questById, questText } from '../data';
import { questStats } from '../engine/quests';
import { speak } from '../lib/speech';
import { useGame } from '../store/game';
import { SpeakButton } from './SpeakButton';

function useStats() {
  const game = useGame((s) => s.game);
  return game ? questStats(game.log, game.words.length) : null;
}

/** Roblox-style quest board: the 3 quests you are working on, with progress bars. */
export function QuestBoard({ compact }: { compact?: boolean }) {
  const game = useGame((s) => s.game);
  const stats = useStats();
  if (!game || !stats) return null;
  return (
    <div className={`flex ${compact ? 'gap-2' : 'flex-col gap-2'}`}>
      {game.quests.active.map((id) => {
        const q = questById(id);
        const have = Math.min(q.goal, stats[q.stat]);
        return (
          <div key={id} className="flex flex-1 items-center gap-2 rounded-2xl border-[3px] border-ink bg-white px-2 py-1">
            <span className="text-3xl">{q.icon}</span>
            <div className="min-w-0 flex-1">
              <div className="text-[17px] font-bold leading-tight">{questText(q, game.world.playerId)}</div>
              <div className="mt-1 flex items-center gap-1.5">
                <span className="h-3.5 flex-1 overflow-hidden rounded-full border-2 border-ink/40 bg-ink/5">
                  <span className="block h-full rounded-full bg-green-400 transition-all" style={{ width: `${(have / q.goal) * 100}%` }} />
                </span>
                <span className="whitespace-nowrap text-[14px] font-black">{q.goal > 9 ? (have >= q.goal ? '✔' : '') : `${have}/${q.goal}`}</span>
              </div>
            </div>
            <span className="whitespace-nowrap text-[15px] font-black text-amber-600">+{q.stars}⭐</span>
          </div>
        );
      })}
    </div>
  );
}

/** Full quest list: done, working on, and still to come. */
export function QuestsOverlay() {
  const { game, setOverlay } = useGame();
  if (!game) return null;
  return (
    <div className="fixed inset-0 z-30 overflow-auto bg-paper p-4">
      <div className="mb-3 flex items-center gap-3">
        <h1 className="text-3xl font-black">📜 Quests</h1>
        <span className="rounded-full bg-amber-300 px-4 py-1 text-2xl font-black">⭐ {game.quests.stars}</span>
        <span className="flex-1" />
        <button className="btn" onClick={() => setOverlay(null)}>Close ✖</button>
      </div>
      <h2 className="mb-1 text-xl font-black">Now</h2>
      <QuestBoard />
      <h2 className="mb-1 mt-4 text-xl font-black">All quests</h2>
      <div className="grid grid-cols-2 gap-2">
        {QUESTS.map((q) => {
          const done = game.quests.done.includes(q.id);
          return (
            <div key={q.id} className={`flex items-center gap-2 rounded-2xl border-[3px] px-3 py-1.5 text-[18px] font-bold ${done ? 'border-ink bg-green-100' : 'border-ink/25 bg-white text-ink/60'}`}>
              <span className="text-2xl">{done ? '🏅' : q.icon}</span>
              <span className="flex-1">{questText(q, game.world.playerId)}</span>
              <span className="text-amber-600">+{q.stars}⭐</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** Pop-up when a quest is done. */
export function QuestModal() {
  const game = useGame((s) => s.game);
  const dismiss = useGame((s) => s.dismissQuest);
  const id = game?.questQueue[0];
  const q = id ? questById(id) : null;
  const text = q && game ? questText(q, game.world.playerId) : '';
  useEffect(() => {
    if (text) speak(`Quest done! ${text}`);
  }, [text]);
  if (!game || !q || game.wordQueue.length) return null;
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-ink/60 p-6">
      <div className="pop panel flex w-full max-w-xl flex-col items-center gap-2 !bg-amber-50 p-6 text-center">
        <div className="text-[40px] leading-none">🎉 🏅 🎉</div>
        <div className="text-4xl font-black text-green-700">QUEST DONE!</div>
        <div className="flex items-center gap-2 text-2xl font-bold">
          <span className="text-4xl">{q.icon}</span> {text} <SpeakButton small text={`Quest done! ${text}`} />
        </div>
        <div className="text-4xl">{'⭐'.repeat(q.stars)}</div>
        <div className="text-xl font-bold">You got {q.stars} {q.stars === 1 ? 'star' : 'stars'}!</div>
        <button className="btn btn-green mt-1" onClick={dismiss}>Yay! 🙌</button>
      </div>
    </div>
  );
}
