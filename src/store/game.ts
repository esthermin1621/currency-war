import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CARDS, EVENTS, NATIONS, NATION_IDS } from '../data';
import { priceDirection, type GuessDir } from '../engine/detect';
import { createWorld, dealHand, playYear, type World } from '../engine/game';
import type { NationId, NationState, Phenomenon, Role, YearResult } from '../engine/types';
import { PHENOMENON } from '../lib/text';

const DATA = { nations: NATIONS, cards: CARDS, events: EVENTS };

export type Phase =
  | 'title' | 'howto' | 'pickLand' | 'pickJob'
  | 'news' | 'president' | 'bank' | 'guess' | 'result' | 'report' | 'end';

export interface Settings {
  turns: 6 | 8 | 10;
  easy: boolean; // Easy = no random news
  allowed: NationId[];
  koHints: boolean;
  teacherTalk: boolean;
  seed: number; // 4-digit "same world" code
  pin: string;
}

export interface LogRow {
  year: number;
  eventId: string;
  president: string | null;
  bank: string | null;
  guess: GuessDir;
  correct: boolean;
  phenomenon: Phenomenon;
  inflation: number;
  breadPrice: number;
  trust: number;
  jobs: number;
  happiness: number;
  acValue: number;
}

export interface Game {
  world: World;
  team: string;
  mode: 'solo' | 'team';
  hand: { president: string[]; bank: string[] };
  choice: { president: string | null; bank: string | null };
  last: { year: number; prev: NationState; result: YearResult; guess: GuessDir; correct: boolean; others: Record<NationId, Phenomenon> } | null;
  log: LogRow[];
  words: string[];
  wordQueue: string[];
  quizWord: string | null;
}

interface Store {
  phase: Phase;
  overlay: null | 'words' | 'teacher';
  settings: Settings;
  pickedLand: NationId | null;
  game: Game | null;
  go: (phase: Phase) => void;
  setOverlay: (o: Store['overlay']) => void;
  setSettings: (s: Partial<Settings>) => void;
  pickLand: (id: NationId) => void;
  startGame: (team: string, mode: 'solo' | 'team') => void;
  pickCard: (role: Role, id: string) => void;
  makeGuess: (g: GuessDir) => void;
  toReport: () => void;
  nextYear: () => void;
  dismissWord: () => void;
  answerQuiz: () => void;
  quit: () => void;
}

const newSeed = () => 1000 + Math.floor(Math.random() * 9000);

/** Add a word card to the queue if the team has not seen it yet. */
const withWords = (g: Game, ids: (string | null | undefined)[]): Game => {
  const queue = [...g.wordQueue];
  for (const id of ids) if (id && !g.words.includes(id) && !queue.includes(id)) queue.push(id);
  return { ...g, wordQueue: queue };
};

export const useGame = create<Store>()(
  persist(
    (set, get) => ({
      phase: 'title',
      overlay: null,
      settings: { turns: 10, easy: false, allowed: NATION_IDS, koHints: false, teacherTalk: false, seed: newSeed(), pin: '1234' },
      pickedLand: null,
      game: null,

      go: (phase) => set({ phase }),
      setOverlay: (overlay) => set({ overlay }),
      setSettings: (s) => set({ settings: { ...get().settings, ...s } }),
      pickLand: (id) => set({ pickedLand: id, phase: 'pickJob' }),

      startGame: (team, mode) => {
        const { settings, pickedLand } = get();
        if (!pickedLand) return;
        const world = createWorld(DATA, { seed: settings.seed, turns: settings.turns, events: settings.easy ? 'history' : 'all' }, pickedLand);
        const game: Game = {
          world, team, mode,
          hand: dealHand(DATA, world),
          choice: { president: null, bank: null },
          last: null, log: [], words: [], wordQueue: [], quizWord: null,
        };
        set({ game: withWords(game, ['money']), phase: 'news' });
      },

      pickCard: (role, id) => {
        const g = get().game;
        if (!g) return;
        const choice = { ...g.choice, [role]: id };
        if (role === 'president') set({ game: withWords({ ...g, choice }, ['centralBank']), phase: 'bank' });
        else set({ game: { ...g, choice }, phase: 'guess' });
      },

      makeGuess: (guess) => {
        const g = get().game;
        if (!g) return;
        const id = g.world.playerId;
        const year = g.world.year;
        const prev = g.world.nations[id];
        const out = playYear(DATA, g.world, g.choice);
        const result = out.results[id];
        const s = result.state;
        const correct = priceDirection(result.inflation) === guess;
        const others = Object.fromEntries(NATION_IDS.map((n) => [n, out.results[n].phenomenon])) as Record<NationId, Phenomenon>;
        const row: LogRow = {
          year, eventId: g.world.schedules[id][year - 1], president: g.choice.president, bank: g.choice.bank,
          guess, correct, phenomenon: result.phenomenon, inflation: result.inflation,
          breadPrice: s.breadPrice, trust: s.trust, jobs: s.jobs, happiness: s.happiness, acValue: s.acValue,
        };
        const usedInterest = CARDS.find((c) => c.id === g.choice.bank)?.tag === 'interest';
        const next: Game = { ...g, world: out.world, last: { year, prev, result, guess, correct, others }, log: [...g.log, row] };
        set({
          game: withWords(next, [
            PHENOMENON[result.phenomenon].word,
            usedInterest ? 'interest' : null,
            result.lostTrust ? 'trust' : null,
            result.notes.includes('rebuild') ? 'reserve' : null,
          ]),
          phase: 'result',
        });
      },

      toReport: () => {
        const g = get().game;
        if (!g?.last) return;
        set({ game: withWords(g, [g.last.year === 1 ? 'exchange' : null, g.last.year === 2 ? 'reserve' : null]), phase: 'report' });
      },

      nextYear: () => {
        const g = get().game;
        if (!g) return;
        if (g.world.year > g.world.options.turns) return set({ phase: 'end' });
        set({ game: { ...g, hand: dealHand(DATA, g.world), choice: { president: null, bank: null } }, phase: 'news' });
      },

      dismissWord: () => {
        const g = get().game;
        if (!g || !g.wordQueue.length) return;
        const [id, ...rest] = g.wordQueue;
        set({ game: { ...g, wordQueue: rest, words: [...g.words, id], quizWord: id } });
      },

      answerQuiz: () => {
        const g = get().game;
        if (g) set({ game: { ...g, quizWord: null } });
      },

      quit: () => set({ game: null, pickedLand: null, phase: 'title', overlay: null }),
    }),
    { name: 'currency-wars-v1' },
  ),
);

export const useGameData = () => DATA;
