import { describe, expect, it } from 'vitest';
import { CARDS, EVENTS, NATIONS, cardById, nationDef } from '../src/data';
import { detectPhenomenon, priceDirection } from '../src/engine/detect';
import { createWorld, dealHand } from '../src/engine/game';
import { makeRng } from '../src/engine/rng';
import { createNation, simulateYear, velocity } from '../src/engine/simulate';

const data = { nations: NATIONS, cards: CARDS, events: EVENTS };

describe('engine', () => {
  it('starts with bread at 10 in every land', () => {
    for (const def of NATIONS) {
      const s = createNation(def);
      expect((s.k * s.money * velocity(s.trust)) / s.goods).toBeCloseTo(10);
    }
  });

  it('more money with the same goods makes bread cost more', () => {
    const s = createNation(nationDef('khan'));
    const r = simulateYear(s, { bank: cardById('makeLots') }, null, makeRng(1));
    expect(r.inflation).toBeCloseTo(0.3);
    expect(r.reason).toBe('moreMoney');
    expect(r.state.trust).toBeLessThan(s.trust);
  });

  it('gold standard limits new money', () => {
    const r = simulateYear(createNation(nationDef('usa')), { bank: cardById('makeLots') }, null, makeRng(1));
    expect(r.notes).toContain('goldCapped');
    expect(r.inflation).toBeCloseTo(0.05);
  });

  it('detects phenomena in priority order', () => {
    expect(detectPhenomenon({ inflation: 0.6, jobsDelta: -5, goodsGrowth: -0.1 })).toBe('hyperinflation');
    expect(detectPhenomenon({ inflation: 0.1, jobsDelta: -5, goodsGrowth: 0 })).toBe('stagflation');
    expect(detectPhenomenon({ inflation: 0.1, jobsDelta: 0, goodsGrowth: 0 })).toBe('inflation');
    expect(detectPhenomenon({ inflation: -0.05, jobsDelta: 0, goodsGrowth: 0 })).toBe('deflation');
    expect(detectPhenomenon({ inflation: 0.01, jobsDelta: 0, goodsGrowth: 0 })).toBe('stable');
    expect(priceDirection(0.1)).toBe('up');
    expect(priceDirection(-0.1)).toBe('down');
    expect(priceDirection(0)).toBe('same');
  });

  it('deals 3 common cards per role, plus special cards', () => {
    const w = createWorld(data, { seed: 7, turns: 10, events: 'all' }, 'rome');
    const hand = dealHand(data, w);
    expect(hand.president).toHaveLength(3);
    expect(hand.bank).toHaveLength(4);
    expect(hand.bank).toContain('lessSilver');
  });

  it('player-facing sentences have 10 words or fewer', () => {
    const texts = [...CARDS.flatMap((c) => [c.text, c.hint]), ...EVENTS.map((e) => e.text)];
    for (const t of texts) {
      for (const sentence of t.split(/[.!?]+/).filter((x) => x.trim())) {
        expect(sentence.trim().split(/\s+/).length, sentence).toBeLessThanOrEqual(10);
      }
    }
  });
});
