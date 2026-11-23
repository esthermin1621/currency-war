import { CONFIG as C } from './config';
import type { NationState, Phenomenon } from './types';

/** PRD section 8: which money event happened this year (priority order). */
export function detectPhenomenon(i: { inflation: number; jobsDelta: number; goodsGrowth: number }): Phenomenon {
  const d = C.detect;
  if (i.inflation > d.hyper) return 'hyperinflation';
  if (i.inflation > d.inflation && (i.jobsDelta <= d.stagJobs || i.goodsGrowth < d.stagGoods)) return 'stagflation';
  if (i.inflation > d.inflation) return 'inflation';
  if (i.inflation < d.deflation) return 'deflation';
  if (i.inflation <= d.stableHigh) return 'stable';
  return 'mild';
}

export type GuessDir = 'up' | 'down' | 'same';
export function priceDirection(inflation: number): GuessDir {
  if (inflation > C.guess.up) return 'up';
  if (inflation < C.guess.down) return 'down';
  return 'same';
}

export type Tier = 'golden' | 'strong' | 'struggling' | 'fallen';
export function score(s: NationState): number {
  const w = C.score;
  return w.trust * s.trust + w.happiness * s.happiness + w.jobs * s.jobs + w.ac * Math.min(100, s.acValue);
}
export function tier(points: number): Tier {
  const w = C.score;
  if (points >= w.golden) return 'golden';
  if (points >= w.strong) return 'strong';
  if (points >= w.struggling) return 'struggling';
  return 'fallen';
}
