import { useState } from 'react';
import { NATIONS, nationDef } from '../data';
import { SpeakButton } from '../components/SpeakButton';
import { WorldMap } from '../components/WorldMap';
import type { NationId } from '../engine/types';
import { useGame } from '../store/game';

export function Title() {
  const { go, game, setOverlay, settings } = useGame();
  return (
    <div className="relative flex h-full flex-col items-center justify-center gap-5 overflow-hidden p-6">
      <WorldMap className="pointer-events-none absolute inset-0 h-full w-full opacity-30" />
      <div className="relative text-center">
        <div className="text-7xl">🪙</div>
        <h1 className="text-6xl font-black tracking-tight">Currency Wars</h1>
        <div className="text-3xl font-extrabold text-amber-700">Arti-Coin</div>
        <p className="mt-2 text-2xl">Lead a land. Run its money for {settings.turns} years.</p>
      </div>
      <div className="relative flex flex-col items-stretch gap-3">
        {game && <button className="btn btn-green" onClick={() => go(game.world.year > game.world.options.turns ? 'end' : 'news')}>▶ Keep Playing</button>}
        <button className="btn" onClick={() => go('pickLand')}>{game ? 'New Game' : '▶ Play'}</button>
        <button className="btn btn-white" onClick={() => go('howto')}>❓ How to Play</button>
        <button className="btn btn-white" onClick={() => setOverlay('teacher')}>🧑‍🏫 Teacher</button>
      </div>
      <div className="relative rounded-full bg-white/80 px-4 py-1 text-[17px] font-bold">World code: {settings.seed}</div>
    </div>
  );
}

const HOW = [
  { icon: '📰', text: 'Read the news.' },
  { icon: '👑🏦', text: 'Pick two cards.' },
  { icon: '🤔🍞', text: 'Guess the bread price.' },
  { icon: '📈', text: 'See what happens!' },
];

export function HowTo() {
  const go = useGame((s) => s.go);
  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 p-6">
      <h1 className="text-4xl font-black">How to Play</h1>
      <div className="grid grid-cols-4 gap-4">
        {HOW.map((h, i) => (
          <div key={i} className="panel flex w-52 flex-col items-center gap-2 p-4 text-center">
            <div className="text-[15px] font-black text-ink/50">{i + 1}</div>
            <div className="text-6xl">{h.icon}</div>
            <div className="text-xl font-bold">{h.text}</div>
            <SpeakButton small text={h.text} />
          </div>
        ))}
      </div>
      <p className="text-2xl font-bold">Keep bread cheap. Keep people happy. ❤️</p>
      <button className="btn" onClick={() => go('title')}>OK</button>
    </div>
  );
}

export function PickLand() {
  const { go, pickLand, settings } = useGame();
  const [sel, setSel] = useState<NationId | null>(null);
  const pick = (id: NationId) => settings.allowed.includes(id) && setSel(id);
  return (
    <div className="flex h-full flex-col gap-3 p-4">
      <div className="flex items-center gap-3">
        <button className="btn btn-white !min-h-[52px] !px-4" onClick={() => go('title')}>⬅</button>
        <h1 className="text-3xl font-black">Pick Your Land</h1>
        <span className="text-xl">Welcome to Time World! 🌍</span>
        <span className="flex-1" />
        <button className="btn btn-green" disabled={!sel} onClick={() => sel && pickLand(sel)}>
          {sel ? `Choose ${nationDef(sel).name} ➡` : 'Tap a land'}
        </button>
      </div>
      <div className="panel min-h-0 flex-1 overflow-hidden !bg-sea">
        <WorldMap className="h-full w-full" selected={sel} allowed={settings.allowed} onSelect={pick} />
      </div>
      <div className="grid grid-cols-6 gap-2">
        {NATIONS.map((n) => {
          const off = !settings.allowed.includes(n.id);
          return (
            <button
              key={n.id}
              disabled={off}
              onClick={() => pick(n.id)}
              className={`flex flex-col gap-0.5 rounded-2xl border-[3px] p-2 text-left text-[14px] leading-tight ${sel === n.id ? 'border-amber-500 bg-amber-100' : 'border-ink bg-white'}`}
            >
              <span className="self-center text-5xl">{n.icon}</span>
              <span className="self-center text-[17px] font-black">{n.name}</span>
              <span className="self-center text-center font-bold" style={{ color: n.color }}>{n.moneyKind}</span>
              <span>👍 {n.strong}</span>
              <span>👎 {n.weak}</span>
              {settings.koHints && <span className="text-[12px] text-ink/70">🇰🇷 {n.ko}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function PickJob() {
  const { go, startGame, pickedLand } = useGame();
  const [team, setTeam] = useState('');
  const [mode, setMode] = useState<'solo' | 'team'>('team');
  if (!pickedLand) return null;
  const n = nationDef(pickedLand);
  return (
    <div className="flex h-full flex-col items-center justify-center gap-5 p-6">
      <div className="text-7xl">{n.icon}</div>
      <h1 className="text-4xl font-black">You lead {n.name}!</h1>
      <p className="text-xl">Your money is the <b>{n.currency}</b>.</p>
      <input
        value={team}
        onChange={(e) => setTeam(e.target.value)}
        maxLength={16}
        placeholder="Team name"
        className="h-16 w-80 rounded-2xl border-[3px] border-ink bg-white px-4 text-center text-2xl font-bold"
      />
      <div className="flex gap-4">
        {([['team', '👑 + 🏦', 'Two jobs, two friends'], ['solo', '🙋', 'I do both jobs']] as const).map(([m, icon, label]) => (
          <button key={m} onClick={() => setMode(m)} className={`w-64 rounded-3xl border-[3px] p-4 ${mode === m ? 'border-amber-500 bg-amber-100' : 'border-ink bg-white'}`}>
            <div className="text-4xl">{icon}</div>
            <div className="text-xl font-bold">{label}</div>
          </button>
        ))}
      </div>
      <div className="grid max-w-3xl grid-cols-2 gap-3 text-[18px]">
        <div className="panel p-3"><b>👑 President</b><br />You lead the country. You spend and collect money.</div>
        <div className="panel p-3"><b>🏦 Central Bank</b><br />You make the money. You decide how much.</div>
      </div>
      <div className="flex gap-3">
        <button className="btn btn-white" onClick={() => go('pickLand')}>⬅ Back</button>
        <button className="btn btn-green" onClick={() => startGame(team.trim() || 'My Team', mode)}>Start ▶</button>
      </div>
    </div>
  );
}
