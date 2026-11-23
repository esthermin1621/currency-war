import { useEffect, useState } from 'react';
import { cardById, eventById, nationDef, wordById } from '../data';
import { CardView } from '../components/CardView';
import { Bubble } from '../components/Arti';
import { SpeakButton } from '../components/SpeakButton';
import { StatStrip } from '../components/StatStrip';
import { TownScene } from '../components/TownScene';
import { WorldMap } from '../components/WorldMap';
import type { GuessDir } from '../engine/detect';
import type { Role } from '../engine/types';
import { speak } from '../lib/speech';
import { GUESS, STEPS } from '../lib/text';
import { JOKES } from '../lib/fun';
import { useGame } from '../store/game';
import { Report } from './Report';
import { Result } from './Result';

/** Main game frame: one big picture on top (town or world map), picture meters, then this year's step. */
export function GameShell() {
  const { game, phase, go, setOverlay } = useGame();
  const [view, setView] = useState<'auto' | 'town' | 'map'>('auto');
  useEffect(() => setView('auto'), [phase]);
  if (!game) return null;
  const { world } = game;
  const me = world.nations[world.playerId];
  const def = nationDef(me.id);
  const turns = world.options.turns;
  const shownYear = Math.min(turns, phase === 'result' || phase === 'report' ? world.year - 1 : world.year);
  const step = STEPS.findIndex((s) => s.phase === phase);
  const showMap = view === 'auto' ? phase === 'report' : view === 'map';

  return (
    <div className="flex h-full flex-col gap-2 p-2.5">
      <header className="flex items-center gap-2">
        <div className="panel flex items-center gap-2 whitespace-nowrap px-3 py-1 text-xl font-black">
          <span className="text-3xl">{def.icon}</span>{def.name}
        </div>
        <div className="panel flex items-center gap-1.5 px-3 py-1.5" aria-label={`Year ${shownYear} of ${turns}`}>
          <span className="mr-1 whitespace-nowrap text-xl font-black">Year</span>
          {Array.from({ length: turns }, (_, i) => (
            <span
              key={i}
              className={`flex items-center justify-center rounded-full border-2 border-ink font-black ${i + 1 === shownYear ? 'h-9 w-9 bg-amber-300 text-xl' : i + 1 < shownYear ? 'h-5 w-5 bg-green-400 text-[0px]' : 'h-5 w-5 bg-white text-[0px]'}`}
            >
              {i + 1}
            </span>
          ))}
        </div>
        <span className="flex-1 whitespace-nowrap text-center text-lg" aria-label={STEPS[step]?.label}>
          {STEPS.map((s, i) => <span key={s.phase} className={i === step ? 'mx-0.5 text-3xl' : 'opacity-30'}>{s.icon}</span>)}
        </span>
        <button className="btn btn-white !min-h-[52px] !px-3 !text-[17px]" onClick={() => setView(showMap ? 'town' : 'map')}>
          <span className="whitespace-nowrap">{showMap ? '🏘️ Town' : '🌍 World'}</span>
        </button>
        <button className="btn btn-white !min-h-[52px] !px-3 !text-[17px]" onClick={() => setOverlay('words')} aria-label="My Money Words">
          <span className="whitespace-nowrap">📖 {game.words.length}</span>
        </button>
        <button className="btn btn-white !min-h-[52px] !px-3" aria-label="Teacher" onClick={() => setOverlay('teacher')}>🧑‍🏫</button>
        <button className="btn btn-white !min-h-[52px] !px-3" aria-label="Home" onClick={() => go('title')}>🏠</button>
      </header>

      <div className="panel aspect-[1000/250] max-h-[42%] w-full shrink-0 overflow-hidden !bg-[#8fd3f4]">
        {showMap
          ? <WorldMap crop medals className="h-full w-full" states={world.nations} playerId={world.playerId} />
          : <TownScene s={me} year={world.year} />}
      </div>
      <StatStrip s={me} prev={game.last?.prev} />
      <section className="panel min-h-0 flex-1 overflow-auto p-3">
        {phase === 'news' && <News />}
        {phase === 'president' && <ChoiceStep role="president" />}
        {phase === 'bank' && <ChoiceStep role="bank" />}
        {phase === 'guess' && <Guess />}
        {phase === 'result' && <Result />}
        {phase === 'report' && <Report />}
      </section>
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
      <Bubble>
        <div className="flex items-center gap-3">
          <h2 className="text-3xl font-black">⭐ Quick question: {w.quiz.q}</h2>
          <SpeakButton small text={w.quiz.q} />
        </div>
      </Bubble>
      <div className="flex gap-5">
        {options.map((o) => (
          <button
            key={o.text}
            onClick={() => setState(o === w.quiz.right ? 'right' : 'wrong')}
            className={`w-64 rounded-3xl border-[3px] border-ink bg-white p-4 shadow-[0_5px_0_#3b2f2f] ${state === 'wrong' && o === w.quiz.wrong ? 'shake opacity-50' : ''} ${state === 'right' && o === w.quiz.right ? '!bg-green-200' : ''}`}
          >
            <div className="text-6xl">{o.icon}</div>
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
  const joke = (JOKES.news as Record<string, string>)[event.id];
  const quiz = game!.quizWord;
  const waiting = game!.wordQueue.length > 0;
  useEffect(() => {
    if (!quiz && !waiting) speak(event.text);
  }, [event.id, quiz, waiting]);
  if (quiz) return <Quiz wordId={quiz} />;
  return (
    <div className="flex h-full items-center justify-center gap-6">
      <div className="pop flex h-44 w-44 shrink-0 items-center justify-center rounded-[36px] border-[3px] border-ink bg-amber-100 text-[110px] leading-none shadow-[0_5px_0_#3b2f2f]">
        {event.icon}
      </div>
      <div className="flex flex-col items-start gap-3">
        <div className="rounded-full bg-ink px-3 py-0.5 text-[16px] font-black text-white">
          📰 News{event.nation ? ` · Long ago in ${def.name}` : ''}
        </div>
        <Bubble>
          <div className="flex items-center gap-3">
            <div>
              <div className="text-3xl font-black">{event.text}</div>
              {joke && <div className="mt-1 text-xl text-ink/75">{joke}</div>}
            </div>
            <SpeakButton text={joke ? `${event.text} ${joke}` : event.text} />
          </div>
        </Bubble>
        <button className="btn self-center" onClick={() => go('president')}>OK ➡</button>
      </div>
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
  const line = role === 'president' ? 'You spend the gold. Pick one card.' : 'You make the money. Pick one card.';
  return (
    <div className="flex h-full flex-col items-center gap-2">
      <Bubble size={54}>
        <div className="flex items-center gap-3">
          <h2 className="whitespace-nowrap text-2xl font-black">{title}{g.mode === 'team' ? ', your turn!' : ''}</h2>
          <span className="text-xl">{line}</span>
          <SpeakButton small text={line} />
        </div>
      </Bubble>
      <div className="flex flex-1 flex-wrap items-center justify-center gap-4">
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
      <Bubble>
        <div className="flex items-center gap-3">
          <h2 className="text-4xl font-black">{q}</h2>
          <SpeakButton small text={q} />
        </div>
      </Bubble>
      <div className="flex gap-5">
        {(['up', 'same', 'down'] as GuessDir[]).map((d) => (
          <button key={d} className="btn btn-white !h-36 w-52 !text-2xl" onClick={() => makeGuess(d)}>
            <div className="text-6xl">🍞{GUESS[d].icon}</div>
            {GUESS[d].label}
          </button>
        ))}
      </div>
    </div>
  );
}
