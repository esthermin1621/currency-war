import { CONFIG as C } from './config';
import type { ChoiceIds, Helper, NationState, YearResult } from './types';

export type Mood = 'cheer' | 'complain' | 'ok';
export interface Reaction {
  mood: Mood;
  /** which line to say, see src/data/roles.json */
  why: string;
}

export const HELPERS: Helper[] = ['king', 'bank', 'tax', 'shop', 'people'];

/**
 * Each helper cares about one part of the money flow.
 * King: the gold box. Banker: calm prices. Tax collector: tax coming in.
 * Shopkeeper: buyers. People: cheap bread, jobs and low tax.
 */
export function reactions(prev: NationState, r: YearResult, picks: ChoiceIds): Record<Helper, Reaction> {
  const M = C.mood;
  const s = r.state;
  const infl = r.inflation;
  const gold = s.treasury - prev.treasury;
  const stable = Math.abs(infl) <= C.trust.stableBand;
  const has = (id: string) => Object.values(picks).includes(id);
  const R = (mood: Mood, why: string): Reaction => ({ mood, why });

  const king =
    has('party') ? R('cheer', 'party')
    : r.notes.includes('warWon') ? R('cheer', 'warWon')
    : r.notes.includes('warLost') ? R('complain', 'warLost')
    : s.debt > prev.debt || r.notes.includes('default') ? R('complain', 'debt')
    : gold >= M.goldMove ? R('cheer', 'moreGold')
    : gold <= -M.goldMove ? R('complain', 'lessGold')
    : R('ok', 'ok');

  const bank =
    infl > M.highInflation ? R('complain', 'pricesUp')
    : infl < C.detect.deflation ? R('complain', 'pricesDown')
    : stable ? R('cheer', 'steady')
    : R('ok', 'ok');

  const tax =
    has('raiseTax') || has('silverTax') ? R('cheer', 'moreTax')
    : has('cutTax') ? R('complain', 'lessTax')
    : r.jobsDelta <= M.jobsDrop ? R('complain', 'poorPeople')
    : r.jobsDelta > 0 ? R('cheer', 'busyTown')
    : R('ok', 'ok');

  const shop =
    infl < C.detect.deflation ? R('complain', 'noBuyers')
    : infl > M.tooPricey ? R('complain', 'tooPricey')
    : has('closeBorders') ? R('complain', 'gatesClosed')
    : has('bigSale') ? R('complain', 'sale')
    : has('raisePrices') ? R('cheer', 'higherPrices')
    : has('openTrade') ? R('cheer', 'trade')
    : has('bakeMore') ? R('cheer', 'moreBread')
    : r.jobsDelta > 0 && infl <= C.detect.inflation ? R('cheer', 'busy')
    : R('ok', 'ok');

  const people =
    infl > C.detect.inflation ? R('complain', 'breadUp')
    : has('raiseTax') ? R('complain', 'taxUp')
    : r.jobsDelta <= M.jobsDrop ? R('complain', 'noJobs')
    : s.happiness - prev.happiness <= M.sadDrop ? R('complain', 'sad')
    : has('party') ? R('cheer', 'party')
    : has('cutTax') ? R('cheer', 'taxDown')
    : has('bigSale') ? R('cheer', 'sale')
    : infl <= C.trust.stableBand && r.jobsDelta >= 0 ? R('cheer', infl < 0 ? 'cheapBread' : 'jobs')
    : R('ok', 'ok');

  return { king, bank, tax, shop, people };
}
