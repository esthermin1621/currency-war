import type { Helper, Phenomenon } from './types';
import type { Mood } from './roles';

/** What a quest counts. */
export type QuestStat =
  | 'years' | 'rightGuesses' | 'cheapYears' | 'maxGold' | 'words' | 'stableYears' | 'allCheerYears'
  | 'kingCheers' | 'bankCheers' | 'taxCheers' | 'shopCheers' | 'peopleCheers'
  | 'party' | 'openTrade' | 'bakeMore';

export interface QuestDef {
  id: string;
  icon: string;
  text: string;
  stat: QuestStat;
  goal: number;
  stars: number;
}

/** One played year, as quests see it. */
export interface QuestYear {
  correct: boolean;
  breadPrice: number;
  treasury: number;
  phenomenon: Phenomenon;
  picks: string[];
  moods: Record<Helper, Mood>;
}

export const CHEAP_BREAD = 15;

export function questStats(years: QuestYear[], words: number): Record<QuestStat, number> {
  const count = (f: (y: QuestYear) => boolean) => years.filter(f).length;
  const cheers = (h: Helper) => count((y) => y.moods[h] === 'cheer');
  return {
    years: years.length,
    rightGuesses: count((y) => y.correct),
    cheapYears: count((y) => y.breadPrice < CHEAP_BREAD),
    maxGold: Math.max(0, ...years.map((y) => y.treasury)),
    words,
    stableYears: count((y) => y.phenomenon === 'stable'),
    allCheerYears: count((y) => Object.values(y.moods).every((m) => m === 'cheer')),
    kingCheers: cheers('king'),
    bankCheers: cheers('bank'),
    taxCheers: cheers('tax'),
    shopCheers: cheers('shop'),
    peopleCheers: cheers('people'),
    party: count((y) => y.picks.includes('party')),
    openTrade: count((y) => y.picks.includes('openTrade')),
    bakeMore: count((y) => y.picks.includes('bakeMore')),
  };
}

export interface QuestState {
  active: string[];
  done: string[];
  stars: number;
}

export const ACTIVE_QUESTS = 3;

/** Fill the quest board with the next quests that are not done yet. */
export function refillQuests(defs: QuestDef[], q: QuestState): QuestState {
  const active = q.active.filter((id) => !q.done.includes(id));
  for (const d of defs) {
    if (active.length >= ACTIVE_QUESTS) break;
    if (!q.done.includes(d.id) && !active.includes(d.id)) active.push(d.id);
  }
  return { ...q, active };
}

/** Check the board after a year. Returns the new state and the quests just finished. */
export function checkQuests(defs: QuestDef[], q: QuestState, stats: Record<QuestStat, number>): { state: QuestState; finished: string[] } {
  const finished = q.active.filter((id) => {
    const d = defs.find((x) => x.id === id);
    return d && stats[d.stat] >= d.goal;
  });
  const stars = finished.reduce((n, id) => n + (defs.find((x) => x.id === id)?.stars ?? 0), q.stars);
  const state = refillQuests(defs, { active: q.active.filter((id) => !finished.includes(id)), done: [...q.done, ...finished], stars });
  return { state, finished };
}
