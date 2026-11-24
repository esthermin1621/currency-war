import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CARDS, EVENTS, NATIONS, NATION_IDS, QUESTS } from '../data';
import { priceDirection, type GuessDir } from '../engine/detect';
import { createWorld, dealHand, playYear, type World } from '../engine/game';
import { checkQuests, questStats, refillQuests, type QuestState, type QuestYear } from '../engine/quests';
import { HELPERS, reactions, type Reaction } from '../engine/roles';
import { CARD_ROLES, type ChoiceIds, type Helper, type NationId, type NationState, type Phenomenon, type Role, type YearResult } from '../engine/types';
import { PHENOMENON } from '../lib/text';

const DATA = { nations: NATIONS, cards: CARDS, events: EVENTS };

export type Phase =
  | 'title' | 'howto' | 'pickLand' | 'pickJob'
  | 'news' | Role | 'guess' | 'result' | 'talk' | 'end';
export const IN_GAME: Phase[] = ['news', ...CARD_ROLES, 'guess', 'result', 'talk'];

export interface Settings {
  turns: 6 | 8 | 10;
  easy: boolean; // Easy = no random news
  allowed: NationId[];
  koHints: boolean;
  teacherTalk: boolean;
  riskSigns: boolean; // ⚠️ on risky cards
  seed: number; // 4-digit "same world" code
  pin: string;
}

export interface LogRow extends QuestYear {
  year: number;
  eventId: string;
  choice: ChoiceIds;
  guess: GuessDir;
  inflation: number;
  trust: number;
  jobs: number;
  happiness: number;
  acValue: number;
}

export interface Game {
  world: World;
  team: string;
  mode: 'solo' | 'team';
  hand: Record<Role, string[]>;
  choice: ChoiceIds;
  last: {
    year: number; prev: NationState; result: YearResult; guess: GuessDir; correct: boolean;
    others: Record<NationId, Phenomenon>; talk: Record<Helper, Reaction>;
  } | null;
  log: LogRow[];
  words: string[];
  wordQueue: string[];
  quizWord: string | null;
  quests: QuestState;
  questQueue: string[];
}

interface Store {
  phase: Phase;
  overlay: null | 'words' | 'teacher' | 'quests';
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
  toTalk: () => void;
  nextYear: () => void;
  dismissWord: () => void;
  answerQuiz: () => void;
  dismissQuest: () => void;
  quit: () => void;
}

const newSeed = () => 1000 + Math.floor(Math.random() * 9000);
const emptyChoice = (): ChoiceIds => ({ king: null, bank: null, tax: null, shop: null });

/** Add a word card to the queue if the team has not seen it yet. */
const withWords = (g: Game, ids: (string | null | undefined)[]): Game => {
  const queue = [...g.wordQueue];
  for (const id of ids) if (id && !g.words.includes(id) && !queue.includes(id)) queue.push(id);
  return { ...g, wordQueue: queue };
};

/** Check quests after something changed (a year ended or a word was found). */
const withQuests = (g: Game): Game => {
  const { state, finished } = checkQuests(QUESTS, g.quests, questStats(g.log, g.words.length));
  return finished.length ? { ...g, quests: state, questQueue: [...g.questQueue, ...finished] } : g;
};

export const useGame = create<Store>()(
  persist(
    (set, get) => ({
      phase: 'title',
      overlay: null,
      settings: { turns: 6, easy: false, allowed: NATION_IDS, koHints: false, teacherTalk: false, riskSigns: true, seed: newSeed(), pin: '1234' },
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
          choice: emptyChoice(),
          last: null, log: [], words: [], wordQueue: [], quizWord: null,
          quests: refillQuests(QUESTS, { active: [], done: [], stars: 0 }),
          questQueue: [],
        };
        set({ game: withWords(game, ['money']), phase: 'news' });
      },

      pickCard: (role, id) => {
        const g = get().game;
        if (!g) return;
        const choice = { ...g.choice, [role]: id };
        const next = CARD_ROLES[CARD_ROLES.indexOf(role) + 1] ?? 'guess';
        set({ game: withWords({ ...g, choice }, [role === 'king' ? 'centralBank' : null]), phase: next });
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
        const picks = out.choices[id];
        const correct = priceDirection(result.inflation) === guess;
        const talk = reactions(prev, result, picks);
        const others = Object.fromEntries(NATION_IDS.map((n) => [n, out.results[n].phenomenon])) as Record<NationId, Phenomenon>;
        const row: LogRow = {
          year, eventId: g.world.schedules[id][year - 1], choice: picks,
          guess, correct, phenomenon: result.phenomenon, inflation: result.inflation,
          breadPrice: s.breadPrice, treasury: s.treasury, trust: s.trust, jobs: s.jobs, happiness: s.happiness, acValue: s.acValue,
          picks: Object.values(picks).filter((x): x is string => !!x),
          moods: Object.fromEntries(HELPERS.map((h) => [h, talk[h].mood])) as QuestYear['moods'],
        };
        const usedInterest = CARDS.find((c) => c.id === picks.bank)?.tag === 'interest';
        const next: Game = { ...g, world: out.world, last: { year, prev, result, guess, correct, others, talk }, log: [...g.log, row] };
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

      toTalk: () => {
        const g = get().game;
        if (!g?.last) return;
        const withW = withWords(g, [g.last.year === 1 ? 'exchange' : null, g.last.year === 2 ? 'reserve' : null]);
        set({ game: withQuests(withW), phase: 'talk' });
      },

      nextYear: () => {
        const g = get().game;
        if (!g) return;
        if (g.world.year > g.world.options.turns) return set({ phase: 'end' });
        set({ game: { ...g, hand: dealHand(DATA, g.world), choice: emptyChoice() }, phase: 'news' });
      },

      dismissWord: () => {
        const g = get().game;
        if (!g || !g.wordQueue.length) return;
        const [id, ...rest] = g.wordQueue;
        set({ game: withQuests({ ...g, wordQueue: rest, words: [...g.words, id], quizWord: id }) });
      },

      answerQuiz: () => {
        const g = get().game;
        if (g) set({ game: { ...g, quizWord: null } });
      },

      dismissQuest: () => {
        const g = get().game;
        if (g) set({ game: { ...g, questQueue: g.questQueue.slice(1) } });
      },

      quit: () => set({ game: null, pickedLand: null, phase: 'title', overlay: null }),
    }),
    // v2: five helpers and quests. Old saved games are not loaded.
    { name: 'currency-wars-v2' },
  ),
);

export const useGameData = () => DATA;
