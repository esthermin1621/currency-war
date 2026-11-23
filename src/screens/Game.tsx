import { useEffect, useState } from 'react';
import { cardById, eventById, nationDef, wordById } from '../data';
import { CardView } from '../components/CardView';
import { CityScene } from '../components/CityScene';
import { SpeakButton } from '../components/SpeakButton';
import { StatPanel } from '../components/StatPanel';
import { WorldMap } from '../components/WorldMap';
import type { GuessDir } from '../engine/detect';
import type { Role } from '../engine/types';
import { speak } from '../lib/speech';
import { GUESS, STEPS } from '../lib/text';
import { useGame } from '../store/game';
import { Report } from './Report';
import { Result } from './Result';

/** Main game frame: numbers on the left, world map on top, this year's step below. */
export function GameShell() {
  const { game, phase, go, setOverlay } = useGame();
  if (!game) return null;
  const { world } = game;
  const me = world.nations[world.playerId];
  const def = nationDef(me.id);
  const shownYear = Math.min(world.options.turns, phase === 'result' || phase === 'report' ? world.year - 1 : world.year);
  const step = STEPS.findIndex((s) => s.phase === phase);

  return (
    <div className="flex h-full flex-col gap-2 p-2.5">
      <header className="flex items-center gap-2">
        <div className="panel flex items-center gap-2 px-3 py-1 text-xl font-black">
          <span className="text-3xl">{def.icon}</span>
          <span className="whitespace-nowrap">{def.name}</span>
          <span className="hidden whitespace-nowrap text-[15px] font-bold text-ink/60 xl:inline">{game.team}</span>
        </div>
        <div className="panel whitespace-nowrap px-3 py-1.5 text-xl font-black">📅 Year {shownYear} of {world.options.turns}</div>
        <ol className="flex flex-1 items-center justify-center gap-1">
          {STEPS.map((s, i) => (
            <li
              key={s.phase}
              className={`flex items-center gap-1 rounded-full border-2 px-2.5 py-1 text-[15px] font-bold ${i === step ? 'border-ink bg-amber-300' : i < step ? 'border-ink/40 bg-green-100 text-ink/60' : 'border-ink/30 bg-white text-ink/50'}`}
            >
              <span>{s.icon}</span>
              <span className={i === step ? '' : 'hidden xl:inline'}>{s.label}</span>
            </li>
          ))}
        </ol>
        <button className="btn btn-white !min-h-[52px] !px-3 !text-[17px]" onClick={() => setOverlay('words')} aria-label="My Money Words"><span className="whitespace-nowrap">📖 {game.words.length}/10</span></button>
        <button className="btn btn-white !min-h-[52px] !px-3" aria-label="Teacher" onClick={() => setOverlay('teacher')}>🧑‍🏫</button>
        <button className="btn btn-white !min-h-[52px] !px-3" aria-label="Home" onClick={() => go('title')}>🏠</button>
      </header>

      <div className="grid min-h-0 flex-1 grid-cols-[250px_1fr] gap-2.5">
        <aside className="panel overflow-auto p-2">
          <StatPanel s={me} prev={game.last?.prev} />
          <CityScene s={me} />
        </aside>
        <main className="flex min-h-0 flex-col gap-2">
          <div className="panel shrink-0 overflow-hidden !bg-sea">
            <WorldMap crop className="block w-full" states={world.nations} playerId={world.playerId} />
          </div>
          <section className="panel min-h-0 flex-1 overflow-auto p-3">
            {phase === 'news' && <News />}
            {phase === 'president' && <ChoiceStep role="president" />}
            {phase === 'bank' && <ChoiceStep role="bank" />}
            {phase === 'guess' && <Guess />}
            {phase === 'result' && <Result />}
            {phase === 'report' && <Report />}
          </section>
        </main>
      </div>
    </div>
  );
}

/** One easy question about the last new word. No penalty for a wrong answer. */
function Quiz({ wordId }: { wordId: string }) {
  const answer = useGame((s) => s.answerQuiz);
  const [state, setState] = useState<'ask' | 'wrong' | 'right'>('ask');
  const w = wordById(wordId);
  const options = wordId.length % 2 ? [w.quiz.right, w.quiz.wrong] : [w.quiz.wrong, w.quiz.right];
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
      <div className="flex items-center gap-3">
        <h2 className="text-3xl font-black">⭐ Quick question: {w.quiz.q}</h2>
        <SpeakButton small text={w.quiz.q} />
      </div>
      <div className="flex gap-5">
        {options.map((o) => (
          <button
            key={o.text}
            onClick={() => setState(o === w.quiz.right ? 'right' : 'wrong')}
            className={`w-64 rounded-3xl border-[3px] border-ink bg-white p-4 shadow-[0_5px_0_#3b2f2f] ${state === 'wrong' && o === w.quiz.wrong ? 'shake opacity-50' : ''} ${state === 'right' && o === w.quiz.right ? '!bg-green-200' : ''}`}
          >
            <div className="text-5xl">{o.icon}</div>
            <div className="text-xl font-bold">{o.text}</div>
          </button>
        ))}
      </div>
      {state === 'wrong' && <p className="text-xl font-bold">Good try! Tap the other one.</p>}
      {state === 'right' && <button className="btn btn-green pop" onClick={answer}>Yes! ⭐ Go on</button>}
    </div>
  );
}

function News() {
  const { game, go } = useGame();
  const world = game!.world;
  const event = eventById(world.schedules[world.playerId][world.year - 1])!;
  const def = nationDef(world.playerId);
  const quiz = game!.quizWord;
  const waiting = game!.wordQueue.length > 0;
  useEffect(() => {
    if (!quiz && !waiting) speak(event.text);
  }, [event.id, quiz, waiting]);
  if (quiz) return <Quiz wordId={quiz} />;
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
      <div className="text-[17px] font-black uppercase tracking-widest text-ink/60">
        📰 Time World News {event.nation ? `· Long ago in ${def.name}` : ''}
      </div>
      <div className="pop flex items-center gap-5 rounded-3xl border-[3px] border-ink bg-amber-50 px-8 py-4">
        <span className="text-7xl">{event.icon}</span>
        <div className="text-left">
          <div className="text-[17px] font-bold text-ink/60">{event.name}</div>
          <div className="text-3xl font-black">{event.text}</div>
        </div>
        <SpeakButton text={event.text} />
      </div>
      <button className="btn" onClick={() => go('president')}>OK ➡</button>
    </div>
  );
}

function ChoiceStep({ role }: { role: Role }) {
  const { game, pickCard } = useGame();
  const g = game!;
  const me = g.world.nations[g.world.playerId];
  const cards = g.hand[role].map((id) => cardById(id)!).map((c) =>
    c.tag === 'bitcoin' && me.bitcoin > 0
      ? { ...c, name: 'Sell Bitcoin', text: 'Sell your Bitcoin for gold.', hint: 'You get gold back. It may be more or less.' }
      : c,
  );
  const title = role === 'president' ? '👑 President' : '🏦 Central Bank';
  const line = role === 'president' ? 'You spend and collect money. Pick one card.' : 'You make the money. Pick one card.';
  return (
    <div className="flex h-full flex-col items-center gap-2">
      <div className="flex items-center gap-3">
        <h2 className="whitespace-nowrap text-2xl font-black">{title}{g.mode === 'team' ? ', your turn!' : ''}</h2>
        <span className="text-[18px]">{line}</span>
        <SpeakButton small text={line} />
      </div>
      <div className="flex flex-1 flex-wrap items-center justify-center gap-2">
        {cards.map((c) => <CardView key={`${g.world.year}-${c.id}`} card={c} onChoose={() => pickCard(role, c.id)} />)}
      </div>
    </div>
  );
}

function Guess() {
  const { game, makeGuess } = useGame();
  const g = game!;
  const q = 'Will bread cost more or less?';
  const picked = [cardById(g.choice.president), cardById(g.choice.bank)];
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
      <div className="flex gap-2 text-[17px] font-bold">
        {picked.map((c) => c && <span key={c.id} className="rounded-full border-2 border-ink/60 bg-white px-3 py-1">{c.icon} {c.name}</span>)}
      </div>
      <div className="flex items-center gap-3">
        <h2 className="text-4xl font-black">🤔 {q}</h2>
        <SpeakButton small text={q} />
      </div>
      <div className="flex gap-5">
        {(['up', 'same', 'down'] as GuessDir[]).map((d) => (
          <button key={d} className="btn btn-white !h-32 w-48 !text-2xl" onClick={() => makeGuess(d)}>
            <div className="text-5xl">🍞{GUESS[d].icon}</div>
            {GUESS[d].label}
          </button>
        ))}
      </div>
    </div>
  );
}
