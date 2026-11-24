import { CONFIG as C } from './config';
import { pickWeighted, type Rng } from './rng';
import { CARD_ROLES } from './types';
import type { Card, Choice, NationId, NationState, Role } from './types';

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
type Style = Record<Role, Record<string, number>>;
const TAX = { sameTax: 3, raiseTax: 1, cutTax: 1 };
const SHOP = { bakeMore: 3, openTrade: 1, raisePrices: 1, bigSale: 1 };
const STYLE: Record<NationId, Style> = {
  rome: { king: { war: 2, build: 1, party: 1 }, bank: { lessSilver: 4, makeLittle: 2, steady: 2, makeLots: 1 }, tax: { raiseTax: 2, sameTax: 2 }, shop: SHOP },
  spain: { king: { treasureShips: 4, war: 2, borrow: 3 }, bank: { makeLittle: 3, steady: 2, makeLots: 1 }, tax: TAX, shop: SHOP },
  khan: { king: { build: 2, party: 1, war: 1 }, bank: { paperOnly: 3, makeLots: 3, makeLittle: 2, steady: 1 }, tax: { cutTax: 1, sameTax: 2 }, shop: SHOP },
  dragon: { king: { build: 3, party: 1 }, bank: { steady: 4, goldBack: 2, takeBack: 1, makeLittle: 1 }, tax: { silverTax: 3, sameTax: 2, raiseTax: 1 }, shop: SHOP },
  calm: { king: { build: 3, party: 1 }, bank: { takeBack: 2, steady: 3, moreCoins: 2, bigCoin: 1 }, tax: TAX, shop: SHOP },
  usa: { king: { build: 3, party: 1, bitcoin: 1 }, bank: { steady: 3, makeLittle: 3, lowerInterest: 1, raiseInterest: 1, leaveGold: 1 }, tax: { cutTax: 2, sameTax: 2 }, shop: SHOP },
};

export function chooseAI(cards: Card[], s: NationState, year: number, rng: Rng, unlockScale = 1): Choice {
  const choose = (role: Role): Card | null => {
    const style = STYLE[s.id][role];
    const options = availableCards(cards, s, year, role, unlockScale)
      .filter((c) => style[c.id])
      .map((c) => ({ item: c, w: style[c.id] }));
    return options.length ? pickWeighted(rng, options) : null;
  };
  return Object.fromEntries(CARD_ROLES.map((r) => [r, choose(r)])) as Choice;
}
