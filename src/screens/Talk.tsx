import { HELPER_LINES, helperDef } from '../data';
import { QuestBoard } from '../components/Quests';
import { SpeakButton } from '../components/SpeakButton';
import { HELPERS } from '../engine/roles';
import { pickLine } from '../lib/fun';
import { useGame } from '../store/game';

const TAG = {
  cheer: { text: '🎉 Hooray!', cls: 'bg-green-300' },
  complain: { text: '😠 Boo!', cls: 'bg-red-300' },
  ok: { text: '😐 Hmm.', cls: 'bg-gray-200' },
};

/** Town Talk: every helper cheers or complains about this year. Then the quest board. */
export function Talk() {
  const { game, nextYear } = useGame();
  const g = game!;
  const last = g.last!;
  const done = g.world.year > g.world.options.turns;
  const seed = g.world.options.seed;
  return (
    <div className="flex min-h-full flex-col gap-2">
      <div className="grid grid-cols-5 gap-2">
        {HELPERS.map((h, i) => {
          const r = last.talk[h];
          const d = helperDef(h);
          const line = pickLine(HELPER_LINES[h][r.why] ?? HELPER_LINES.ok, seed, last.year, h);
          return (
            <div key={h} className={`pop flex flex-col items-center gap-1 rounded-3xl border-[3px] border-ink p-2 text-center ${r.mood === 'complain' ? 'shake' : ''}`} style={{ background: d.color, animationDelay: `${i * 0.12}s` }}>
              <div className="flex items-center gap-1">
                <span className="text-[44px] leading-none">{d.icon}</span>
                <span className={`rounded-full border-2 border-ink px-2 text-[15px] font-black ${TAG[r.mood].cls}`}>{TAG[r.mood].text}</span>
              </div>
              <div className="text-[15px] font-black uppercase leading-none">{d.name}</div>
              <div className="flex flex-1 items-center rounded-2xl bg-white px-2 py-1 text-[18px] font-bold leading-snug">{line}</div>
              <SpeakButton small text={`${d.name}: ${line}`} />
            </div>
          );
        })}
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xl font-black">📜</span>
        <div className="min-w-0 flex-1"><QuestBoard compact /></div>
        <button className="btn btn-green shrink-0" onClick={nextYear}>{done ? 'The End 🏁' : 'Next Year ➡'}</button>
      </div>
    </div>
  );
}
