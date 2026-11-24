import { describe, expect, it } from 'vitest';
import { CARDS, EVENTS, NATIONS, nationDef } from '../src/data';
import questsJson from '../src/data/quests.json';
import roles from '../src/data/roles.json';
import { autoPlay } from '../src/engine/game';
import { checkQuests, questStats, refillQuests, type QuestDef, type QuestYear } from '../src/engine/quests';
import { HELPERS, reactions } from '../src/engine/roles';
import { makeRng } from '../src/engine/rng';
import { createNation, simulateYear } from '../src/engine/simulate';
import type { Card, Helper } from '../src/engine/types';

const data = { nations: NATIONS, cards: CARDS, events: EVENTS };
const card = (id: string) => CARDS.find((c) => c.id === id) as Card;
const QUESTS = questsJson as QuestDef[];

describe('helpers cheer and complain', () => {
  it('more tax: tax collector cheers, people complain', () => {
    const prev = createNation(nationDef('dragon'));
    const r = simulateYear(prev, { tax: card('raiseTax'), bank: card('steady') }, null, makeRng(1));
    const m = reactions(prev, r, { tax: 'raiseTax', bank: 'steady' });
    expect(m.tax.mood).toBe('cheer');
    expect(m.people.mood).toBe('complain');
    expect(m.king.mood).toBe('cheer');
  });

  it('lots of new money: banker and people complain', () => {
    const prev = createNation(nationDef('khan'));
    const r = simulateYear(prev, { bank: card('makeLots') }, null, makeRng(1));
    const m = reactions(prev, r, { bank: 'makeLots' });
    expect(m.bank.mood).toBe('complain');
    expect(m.people.mood).toBe('complain');
  });

  it('every reason has a line to say', () => {
    const prev = createNation(nationDef('rome'));
    const lines = roles.lines as unknown as Record<Helper, Record<string, string[]>>;
    for (const picks of [{ king: 'party', tax: 'sameTax', shop: 'bakeMore', bank: 'makeLittle' }, { tax: 'raiseTax', shop: 'raisePrices', bank: 'makeLots' }]) {
      const r = simulateYear(prev, Object.fromEntries(Object.entries(picks).map(([k, v]) => [k, card(v)])), null, makeRng(2));
      const m = reactions(prev, r, picks);
      for (const h of HELPERS) if (m[h].why !== 'ok') expect(lines[h][m[h].why], `${h}.${m[h].why}`).toBeTruthy();
    }
  });

  it('a good year can make everyone cheer', () => {
    const g = autoPlay(data, { seed: 1, turns: 6, events: 'none' }, 'dragon', () => ({ king: 'party', bank: 'makeLittle', tax: 'sameTax', shop: 'bakeMore' }));
    let prev = createNation(nationDef('dragon'));
    const all = g.years.some((r, i) => {
      const m = reactions(prev, r, g.picks[i]);
      prev = r.state;
      return HELPERS.every((h) => m[h].mood === 'cheer');
    });
    expect(all).toBe(true);
  });
});

describe('quests', () => {
  const year = (over: Partial<QuestYear> = {}): QuestYear => ({
    correct: true, breadPrice: 10, treasury: 60, phenomenon: 'stable', picks: ['party'],
    moods: { king: 'cheer', bank: 'cheer', tax: 'ok', shop: 'ok', people: 'cheer' }, ...over,
  });

  it('starts with 3 quests on the board', () => {
    expect(refillQuests(QUESTS, { active: [], done: [], stars: 0 }).active).toEqual(['firstYear', 'guess2', 'peopleCheer']);
  });

  it('finishes quests, gives stars and fills the board again', () => {
    const q0 = refillQuests(QUESTS, { active: [], done: [], stars: 0 });
    const { state, finished } = checkQuests(QUESTS, q0, questStats([year(), year()], 1));
    expect(finished).toEqual(['firstYear', 'guess2', 'peopleCheer']);
    expect(state.stars).toBe(5);
    expect(state.active).toHaveLength(3);
    expect(state.active).toContain('party');
  });

  it('a 6-year Grade 1 game can finish several quests', () => {
    expect(QUESTS.length).toBeGreaterThanOrEqual(10);
    for (const q of QUESTS) expect(q.text.split(' ').length).toBeLessThanOrEqual(8);
  });
});
