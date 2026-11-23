import { describe, expect, it } from 'vitest';
import { CARDS, EVENTS, NATIONS, NATION_IDS } from '../src/data';
import { score, tier } from '../src/engine/detect';
import { autoPlay, type GameOptions, type Strategy } from '../src/engine/game';
import type { NationId } from '../src/engine/types';

const data = { nations: NATIONS, cards: CARDS, events: EVENTS };
const opts = (events: GameOptions['events'], seed = 1234): GameOptions => ({ seed, turns: 10, events });
const run = (id: NationId, strategy: Strategy, events: GameOptions['events'] = 'none', seed = 1234) => {
  const g = autoPlay(data, opts(events, seed), id, strategy);
  const prices = g.years.map((y) => y.state.breadPrice.toFixed(1)).join(' ');
  console.log(`${id.padEnd(7)} bread: 10.0 ${prices} | ${tier(score(g.final))} ${score(g.final).toFixed(0)}`);
  return g;
};
const firstYear = (g: ReturnType<typeof run>, p: string) => g.years.findIndex((y) => y.phenomenon === p) + 1;

describe('balance scenarios (PRD section 12)', () => {
  it('Keep It Steady every year, no news: prices stay calm, Strong or better', () => {
    for (const id of NATION_IDS) {
      const g = run(id, () => ({ president: null, bank: 'steady' }));
      for (const y of g.years) expect(Math.abs(y.inflation)).toBeLessThanOrEqual(0.03);
      expect(['golden', 'strong']).toContain(tier(score(g.final)));
    }
  });

  it('Make Lots of Money every year: hyperinflation within 4 years, Fallen', () => {
    const g = run('khan', () => ({ president: null, bank: 'makeLots' }));
    const y = firstYear(g, 'hyperinflation');
    expect(y).toBeGreaterThan(0);
    expect(y).toBeLessThanOrEqual(4);
    expect(tier(score(g.final))).toBe('fallen');
  });

  it('Take Money Back every year: deflation within 3 years, jobs fall', () => {
    const g = run('calm', () => ({ president: null, bank: 'takeBack' }));
    const y = firstYear(g, 'deflation');
    expect(y).toBeGreaterThan(0);
    expect(y).toBeLessThanOrEqual(3);
    expect(g.final.jobs).toBeLessThan(80);
  });

  it('Oil shock + Make Lots of Money: stagflation that year', () => {
    const g = run('usa', (y) => ({ president: null, bank: y === 8 ? 'makeLots' : 'steady' }), 'history');
    expect(g.years[7].phenomenon).toBe('stagflation');
    // Same with a paper-money land hit by a storm-size goods shock.
    const g2 = run('usa', (y) => ({ president: null, bank: y === 1 ? 'leaveGold' : y === 8 ? 'makeLots' : 'steady' }), 'history');
    expect(g2.years[7].phenomenon).toBe('stagflation');
  });

  it('Rome: Less Silver twice: trust is 30 or less after people find out', () => {
    const g = run('rome', (y) => ({ president: null, bank: y <= 2 ? 'lessSilver' : 'steady' }));
    expect(g.years[2].notes).toContain('scandal');
    expect(g.years[3].notes).toContain('scandal');
    expect(g.years[3].state.trust).toBeLessThanOrEqual(30);
  });

  it('A good mix (Build + Make a Little + Back with Gold) can reach Golden Age', () => {
    const mix: Strategy = (y, s) => ({ president: s.treasury >= 30 ? 'build' : y % 2 ? 'cutTax' : 'raiseTax', bank: y % 3 === 0 && s.reserve >= 20 ? 'goldBack' : 'makeLittle' });
    for (const id of ['dragon', 'rome', 'khan'] as NationId[]) {
      expect(tier(score(run(id, mix, 'history').final))).toBe('golden');
    }
    // The United States has a harder history (banks close, oil shock): Strong is a good result.
    expect(['golden', 'strong']).toContain(tier(score(run('usa', mix, 'history').final)));
  });

  it('Same seed and same choices: the result is exactly the same', () => {
    const s: Strategy = (y) => ({ president: y % 2 ? 'build' : 'cutTax', bank: y % 3 ? 'makeLittle' : 'makeLots' });
    const a = run('spain', s, 'all', 4321);
    const b = run('spain', s, 'all', 4321);
    const c = run('spain', s, 'all', 9999);
    expect(a).toEqual(b);
    expect(JSON.stringify(a.world)).not.toEqual(JSON.stringify(c.world));
  });
});
