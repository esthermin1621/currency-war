import { chooseAI, availableCards } from './ai';
import { CONFIG as C } from './config';
import { makeRng, mixSeed, pick, sample } from './rng';
import { createNation, simulateYear } from './simulate';
import type { Card, EventCard, NationDef, NationId, NationState, YearResult } from './types';

export interface GameData {
  nations: NationDef[];
  cards: Card[];
  events: EventCard[];
}

export interface GameOptions {
  seed: number;
  turns: number; // 6, 8 or 10
  /** all = history + random news, history = fixed history news only, none = quiet years */
  events: 'all' | 'history' | 'none';
}

export interface World {
  options: GameOptions;
  playerId: NationId;
  year: number; // next year to play, 1-based
  nations: Record<NationId, NationState>;
  /** event id for each year, per land */
  schedules: Record<NationId, string[]>;
}

const RANDOM_NEWS = ['goodHarvest', 'storm', 'invention', 'tradeFair', 'rumor', 'warEvent', 'warNearby', 'quiet'];

/** A 10-year history is squeezed into shorter games. */
export const scaleYear = (year: number, turns: number) => Math.max(1, Math.round((year * turns) / 10));

function buildSchedule(data: GameData, id: NationId, o: GameOptions, withRandom: boolean): string[] {
  const out: string[] = Array(o.turns).fill('quiet');
  const fixed = new Set<number>();
  if (o.events !== 'none') {
    for (const e of data.events) {
      if (e.nation !== id || !e.year) continue;
      const y = scaleYear(e.year, o.turns);
      out[y - 1] = e.id;
      fixed.add(y);
    }
  }
  if (o.events === 'all' && withRandom) {
    const rng = makeRng(mixSeed(o.seed, 'news', id));
    let warUsed = false;
    for (let y = 1; y <= o.turns; y++) {
      if (fixed.has(y)) continue;
      const pool = RANDOM_NEWS.filter((n) => n !== 'warEvent' || (!warUsed && y >= 3));
      const e = pick(rng, pool);
      out[y - 1] = e;
      if (e === 'warEvent') {
        warUsed = true;
        if (y + 2 <= o.turns && !fixed.has(y + 2)) { out[y + 1] = 'peace'; fixed.add(y + 2); }
      }
    }
  }
  return out;
}

export function createWorld(data: GameData, options: GameOptions, playerId: NationId): World {
  const nations = {} as Record<NationId, NationState>;
  const schedules = {} as Record<NationId, string[]>;
  for (const def of data.nations) {
    nations[def.id] = createNation(def);
    schedules[def.id] = buildSchedule(data, def.id, options, def.id === playerId);
  }
  return { options, playerId, year: 1, nations, schedules };
}

export const eventFor = (data: GameData, w: World, id: NationId, year = w.year): EventCard | null =>
  data.events.find((e) => e.id === w.schedules[id][year - 1]) ?? null;

/** The cards shown to the player this year: 3 common cards plus unlocked special cards. */
export function dealHand(data: GameData, w: World): { president: string[]; bank: string[] } {
  const s = w.nations[w.playerId];
  const scale = w.options.turns / 10;
  const deal = (role: 'president' | 'bank') => {
    const all = availableCards(data.cards, s, w.year, role, scale);
    const common = all.filter((c) => !c.nation);
    const rng = makeRng(mixSeed(w.options.seed, 'hand', role, w.year));
    let hand = sample(rng, common, 3);
    // War news: the bank is always tempted to pay for it with new money.
    if (role === 'bank' && eventFor(data, w, w.playerId)?.tag === 'forceMakeLots' && !hand.some((c) => c.id === 'makeLots')) {
      hand = [common.find((c) => c.id === 'makeLots')!, ...hand.slice(0, 2)];
    }
    return [...hand, ...all.filter((c) => c.nation)].map((c) => c.id);
  };
  return { president: deal('president'), bank: deal('bank') };
}

export interface YearOutcome {
  world: World;
  results: Record<NationId, YearResult>;
  choices: Record<NationId, { president: string | null; bank: string | null }>;
}

/** Play one year for every land. The player's cards come in; computer lands choose their own. */
export function playYear(data: GameData, w: World, choice: { president: string | null; bank: string | null }): YearOutcome {
  const year = w.year;
  const scale = w.options.turns / 10;
  const results = {} as Record<NationId, YearResult>;
  const choices = {} as YearOutcome['choices'];
  const nations = {} as Record<NationId, NationState>;
  const card = (id: string | null, s: NationState) => {
    const c = data.cards.find((x) => x.id === id) ?? null;
    if (c?.nation && (c.nation !== s.id || (s.specialUses[c.id] ?? 0) >= C.specialMaxUses)) return null;
    return c;
  };

  for (const def of data.nations) {
    const s = w.nations[def.id];
    const rng = makeRng(mixSeed(w.options.seed, 'year', def.id, year));
    const picked = def.id === w.playerId
      ? { president: card(choice.president, s), bank: card(choice.bank, s) }
      : chooseAI(data.cards, s, year, makeRng(mixSeed(w.options.seed, 'ai', def.id, year)), scale);
    const r = simulateYear(s, picked, eventFor(data, w, def.id), rng);
    results[def.id] = r;
    nations[def.id] = r.state;
    choices[def.id] = { president: picked.president?.id ?? null, bank: picked.bank?.id ?? null };
  }

  // Silver road: when Spain floods the world with silver, it reaches Silver Dragon next year.
  if (w.options.events !== 'none' && year >= scaleYear(5, w.options.turns) && results.spain.moneyGrowth > C.silverRoute.spainMoneyGrowth) {
    nations.dragon = {
      ...nations.dragon,
      pending: [...nations.dragon.pending, { in: 0, years: 1, effect: { money: C.silverRoute.dragonMoney } }],
    };
  }

  return { world: { ...w, year: year + 1, nations }, results, choices };
}

export type Strategy = (year: number, s: NationState) => { president: string | null; bank: string | null };

/** Run a whole game without a screen (tests and the console script use this). */
export function autoPlay(data: GameData, options: GameOptions, playerId: NationId, strategy: Strategy) {
  let world = createWorld(data, options, playerId);
  const years: YearResult[] = [];
  for (let y = 1; y <= options.turns; y++) {
    const out = playYear(data, world, strategy(y, world.nations[playerId]));
    world = out.world;
    years.push(out.results[playerId]);
  }
  return { world, years, final: world.nations[playerId] };
}
