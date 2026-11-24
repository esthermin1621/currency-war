import { QUESTS, WORDS, cardById, eventById, nationDef, questText } from '../data';
import { CARD_ROLES } from '../engine/types';
import { LineChart } from '../components/LineChart';
import { score, tier } from '../engine/detect';
import { GUESS, TIER } from '../lib/text';
import { JOKES } from '../lib/fun';
import { Ati } from '../components/Ati';
import { useGame, type Game } from '../store/game';
import { Ranking } from './Report';

export function LogTable({ game }: { game: Game }) {
  return (
    <table className="w-full border-collapse text-left text-[14px]">
      <thead>
        <tr className="border-b-2 border-ink">
          {['Year', 'News', '🤴', '🏦', '🧾', '🧑‍🍳', '🙋', '🍞', 'What happened'].map((h) => <th key={h} className="px-1.5 py-1">{h}</th>)}
        </tr>
      </thead>
      <tbody>
        {game.log.map((r) => (
          <tr key={r.year} className="border-b border-ink/20">
            <td className="px-1.5 py-0.5">{r.year}</td>
            <td className="px-1.5">{eventById(r.eventId)?.name}</td>
            {CARD_ROLES.map((role) => <td key={role} className="px-1.5">{cardById(r.choice[role])?.name ?? '—'}</td>)}
            <td className="px-1.5">{GUESS[r.guess].icon} {r.correct ? '⭐' : ''}</td>
            <td className="px-1.5 tabular-nums">{r.breadPrice.toFixed(1)}</td>
            <td className="px-1.5 capitalize">{r.phenomenon === 'mild' ? 'small rise' : r.phenomenon}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function End() {
  const { game, quit, setOverlay } = useGame();
  if (!game) return null;
  const me = game.world.nations[game.world.playerId];
  const def = nationDef(me.id);
  const tierId = tier(score(me));
  const t = TIER[tierId];
  const right = game.log.filter((r) => r.correct).length;
  const big = [...game.log].sort((a, b) => Math.abs(b.inflation) - Math.abs(a.inflation))[0];
  const bigCard = big && (cardById(big.choice.bank) ?? cardById(big.choice.king));
  return (
    <div className="mx-auto flex min-h-full max-w-5xl flex-col gap-3 p-4">
      <div className="panel flex items-center gap-4 p-4" style={{ background: t.color }}>
        <div className="text-7xl">{t.icon}</div>
        <div className="flex-1">
          <div className="text-[17px] font-bold">{def.icon} {def.name} · {game.team} · World code {game.world.options.seed}</div>
          <h1 className="text-5xl font-black">{t.title}</h1>
          <p className="text-2xl font-bold">{t.text}</p>
          <p className="mt-1 flex items-center gap-2 text-xl"><Ati size={40} sad={tierId === 'fallen'} /> {JOKES.end[tierId]}</p>
        </div>
        <div className="text-right text-xl font-bold">
          <div className="text-3xl font-black text-amber-600">⭐ {game.quests.stars} stars</div>
          <div>🏅 Quests: {game.quests.done.length}</div>
          <div>🤔 Right guesses: {right} of {game.log.length}</div>
          <div>📖 Words: {game.words.length} of {WORDS.length}</div>
          <div>❤️ {Math.round(me.trust)} 🔨 {Math.round(me.jobs)} 😀 {Math.round(me.happiness)}</div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="panel p-3"><LineChart values={[10, ...game.log.map((r) => r.breadPrice)]} /></div>
        <div className="panel p-3"><h3 className="mb-1 text-xl font-black">🏆 Strongest money</h3><Ranking /></div>
      </div>
      <div className="panel bg-sky-50 p-4">
        {bigCard && <p className="text-xl">🔎 Your biggest choice: <b>Year {big.year}, {bigCard.icon} {bigCard.name}</b>.</p>}
        <p className="text-2xl font-black">✏️ What will you do next time?</p>
        <div className="mt-2 hidden h-16 border-b-2 border-ink/40 print:block" />
      </div>
      <div className="panel p-3">
        <h3 className="mb-1 text-xl font-black">🏅 My Quest Badges</h3>
        <div className="flex flex-wrap gap-2 text-[17px] font-bold">
          {QUESTS.map((q) => (
            <span key={q.id} className={`rounded-full border-2 px-3 py-0.5 ${game.quests.done.includes(q.id) ? 'border-ink bg-green-200' : 'border-ink/20 text-ink/30'}`}>{q.icon} {questText(q, game.world.playerId)}</span>
          ))}
        </div>
      </div>
      <div className="panel p-3">
        <h3 className="mb-1 text-xl font-black">📖 My Money Words</h3>
        <div className="flex flex-wrap gap-2 text-[17px] font-bold">
          {WORDS.map((w) => (
            <span key={w.id} className={`rounded-full border-2 px-3 py-0.5 ${game.words.includes(w.id) ? 'border-ink bg-amber-200' : 'border-ink/20 text-ink/30'}`}>{w.icon} {w.word}</span>
          ))}
        </div>
      </div>
      <div className="panel p-3"><LogTable game={game} /></div>
      <div className="no-print flex justify-center gap-3 pb-4">
        <button className="btn btn-white" onClick={() => setOverlay('words')}>📖 My Words</button>
        <button className="btn btn-white" onClick={() => window.print()}>🖨️ Print</button>
        <button className="btn btn-green" onClick={quit}>Play Again 🔁</button>
      </div>
    </div>
  );
}
