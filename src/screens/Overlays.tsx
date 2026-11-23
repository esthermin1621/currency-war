import { useState } from 'react';
import { NATIONS, WORDS } from '../data';
import { WordCardView } from '../components/WordCard';
import { useGame } from '../store/game';
import { LogTable } from './End';

/** My Money Words: every word card the team has collected. */
export function WordsOverlay() {
  const { game, setOverlay } = useGame();
  return (
    <div className="fixed inset-0 z-30 overflow-auto bg-paper p-4">
      <div className="mb-3 flex items-center gap-3">
        <h1 className="text-3xl font-black">📖 My Money Words</h1>
        <span className="flex-1" />
        <button className="btn" onClick={() => setOverlay(null)}>Close ✖</button>
      </div>
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-3">
        {WORDS.map((w) =>
          game?.words.includes(w.id) ? (
            <WordCardView key={w.id} word={w} compact />
          ) : (
            <div key={w.id} className="flex h-40 items-center justify-center rounded-3xl border-[3px] border-dashed border-ink/30 text-5xl text-ink/30">❓</div>
          ),
        )}
      </div>
    </div>
  );
}

function Toggle({ label, on, set }: { label: string; on: boolean; set: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-3 text-[18px]">
      <input type="checkbox" className="h-7 w-7" checked={on} onChange={(e) => set(e.target.checked)} />
      {label}
    </label>
  );
}

/** Teacher mode behind a 4-digit PIN: game settings, same-world code, turn log. */
export function TeacherOverlay() {
  const { settings, setSettings, setOverlay, game, quit } = useGame();
  const [pin, setPin] = useState('');
  const [open, setOpen] = useState(false);
  const close = () => setOverlay(null);

  if (!open) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60">
        <form className="panel flex flex-col items-center gap-4 p-8" onSubmit={(e) => { e.preventDefault(); if (pin === settings.pin) setOpen(true); else setPin(''); }}>
          <h1 className="text-3xl font-black">🧑‍🏫 Teacher</h1>
          <input autoFocus inputMode="numeric" maxLength={4} value={pin} onChange={(e) => setPin(e.target.value)} placeholder="PIN" className="h-16 w-44 rounded-2xl border-[3px] border-ink text-center text-3xl tracking-[0.4em]" />
          <p className="text-[15px] text-ink/60">For teachers only</p>
          <div className="flex gap-3">
            <button type="button" className="btn btn-white" onClick={close}>Back</button>
            <button className="btn">Open</button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-paper p-5">
      <div className="mx-auto flex max-w-4xl flex-col gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-black">🧑‍🏫 Teacher Mode</h1>
          <span className="flex-1" />
          <button className="btn" onClick={close}>Close ✖</button>
        </div>
        <div className="panel flex flex-col gap-3 p-4">
          <h2 className="text-xl font-black">Game settings <span className="text-[15px] font-normal">(used from the next new game)</span></h2>
          <div className="flex items-center gap-3 text-[18px]">
            Years per game
            {([6, 8, 10] as const).map((n) => (
              <button key={n} onClick={() => setSettings({ turns: n })} className={`h-12 w-14 rounded-xl border-[3px] font-black ${settings.turns === n ? 'border-ink bg-amber-300' : 'border-ink/30 bg-white'}`}>{n}</button>
            ))}
          </div>
          <Toggle label="Easy mode: no random news (history news only)" on={settings.easy} set={(easy) => setSettings({ easy })} />
          <Toggle label="Show Korean hints (one line per word)" on={settings.koHints} set={(koHints) => setSettings({ koHints })} />
          <Toggle label="Show a Teacher Talk question on word cards" on={settings.teacherTalk} set={(teacherTalk) => setSettings({ teacherTalk })} />
          <div className="flex flex-wrap items-center gap-2 text-[18px]">
            Lands to open
            {NATIONS.map((n) => {
              const on = settings.allowed.includes(n.id);
              return (
                <button
                  key={n.id}
                  onClick={() => {
                    const allowed = on ? settings.allowed.filter((x) => x !== n.id) : [...settings.allowed, n.id];
                    if (allowed.length) setSettings({ allowed });
                  }}
                  className={`rounded-xl border-[3px] px-2 py-1 text-[16px] font-bold ${on ? 'border-ink bg-green-200' : 'border-ink/30 bg-white text-ink/40'}`}
                >
                  {n.icon} {n.name}
                </button>
              );
            })}
          </div>
        </div>
        <div className="panel flex flex-wrap items-center gap-3 p-4 text-[18px]">
          <h2 className="text-xl font-black">Same-world code</h2>
          <input
            inputMode="numeric"
            maxLength={4}
            value={settings.seed}
            onChange={(e) => setSettings({ seed: Number(e.target.value.replace(/\D/g, '')) || 0 })}
            className="h-14 w-32 rounded-xl border-[3px] border-ink text-center text-3xl font-black"
          />
          <button className="btn btn-white !min-h-[52px]" onClick={() => setSettings({ seed: 1000 + Math.floor(Math.random() * 9000) })}>🎲 New code</button>
          <span className="basis-full text-[15px]">Teams that start with the same code get the same news, so results are fair to compare.</span>
        </div>
        {game && (
          <div className="panel p-4">
            <div className="mb-2 flex items-center gap-3">
              <h2 className="text-xl font-black">Turn log: {game.team}</h2>
              <span className="flex-1" />
              <button className="btn btn-white !min-h-[48px] !text-[17px]" onClick={() => window.print()}>🖨️ Print</button>
              <button className="btn btn-white !min-h-[48px] !text-[17px]" onClick={() => confirm('Delete the game in progress?') && quit()}>🗑️ Reset game</button>
            </div>
            <LogTable game={game} />
          </div>
        )}
      </div>
    </div>
  );
}
