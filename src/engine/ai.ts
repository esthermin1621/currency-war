import { CONFIG as C } from './config';
import { pickWeighted, type Rng } from './rng';
import type { Card, NationId, NationState, Role } from './types';

/** Cards a land may play this year (common cards + unlocked special cards). */
export function availableCards(cards: Card[], s: NationState, year: number, role: Role, unlockScale = 1): Card[] {
  return cards.filter((c) => {
    if (c.role !== role) return false;
    if (c.nation && c.nation !== s.id) return false;
    if (c.nation && (s.specialUses[c.id] ?? 0) >= C.specialMaxUses) return false;
    if (c.unlockYear && year < Math.max(1, Math.round(c.unlockYear * unlockScale))) return false;
    if (c.id === 'goldBack' && s.reserve < C.goldBackMinReserve) return false;
    if (c.id === 'openTrade' && s.tradeOpen) return false;
    if (c.id === 'closeBorders' && !s.tradeOpen) return false;
    if (c.id === 'leaveGold' && !s.goldStandard) return false;
    return true;
  });
}

/** How each computer land likes to play. It follows real history, with some luck. */
const STYLE: Record<NationId, { president: Record<string, number>; bank: Record<string, number> }> = {
  rome: { president: { war: 2, raiseTax: 2, build: 1 }, bank: { lessSilver: 4, makeLittle: 2, steady: 2, makeLots: 1 } },
  spain: { president: { treasureShips: 4, war: 2, borrow: 3 }, bank: { makeLittle: 3, steady: 2, makeLots: 1 } },
  khan: { president: { build: 2, cutTax: 1, war: 1 }, bank: { paperOnly: 3, makeLots: 3, makeLittle: 2, steady: 1 } },
  dragon: { president: { silverTax: 3, build: 3, raiseTax: 1 }, bank: { steady: 4, goldBack: 2, takeBack: 1, makeLittle: 1 } },
  calm: { president: { build: 3, raiseTax: 1, cutTax: 1 }, bank: { takeBack: 2, steady: 3, moreCoins: 2, bigCoin: 1 } },
  usa: { president: { build: 3, cutTax: 2, bitcoin: 1 }, bank: { steady: 3, makeLittle: 3, lowerInterest: 1, raiseInterest: 1, leaveGold: 1 } },
};

export function chooseAI(cards: Card[], s: NationState, year: number, rng: Rng, unlockScale = 1): { president: Card | null; bank: Card | null } {
  const choose = (role: Role): Card | null => {
    const style = STYLE[s.id][role];
    const options = availableCards(cards, s, year, role, unlockScale)
      .filter((c) => style[c.id])
      .map((c) => ({ item: c, w: style[c.id] }));
    return options.length ? pickWeighted(rng, options) : null;
  };
  return { president: choose('president'), bank: choose('bank') };
}
