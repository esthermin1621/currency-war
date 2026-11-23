import { CONFIG as C } from './config';
import { detectPhenomenon } from './detect';
import type { Rng } from './rng';
import type { Choice, Effect, EventCard, NationDef, NationState, Pending, Reason, YearResult } from './types';

const clamp = (v: number, lo = 0, hi = 100) => Math.min(hi, Math.max(lo, v));

/** Low trust makes people spend money fast, so prices rise more. */
export function velocity(trust: number): number {
  const d = (C.velocity.pivot - trust) / 100;
  return 1 + d * (d > 0 ? C.velocity.slopeLow : C.velocity.slopeHigh);
}

export function createNation(def: NationDef): NationState {
  const s = def.start;
  const v = velocity(s.trust);
  return {
    id: def.id,
    money: C.startMoney,
    goods: s.goods,
    trust: s.trust,
    breadPrice: C.startBread,
    jobs: 80,
    happiness: 70,
    treasury: 50,
    debt: 0,
    reserve: s.reserve,
    interest: C.baseInterest,
    acValue: 100,
    netIncome: s.netIncome,
    k: (C.startBread * s.goods) / (C.startMoney * v),
    priceFactor: 1,
    lastV: v,
    tradeOpen: s.tradeOpen,
    goldStandard: s.goldStandard,
    paperOnly: false,
    silverTax: false,
    bitcoin: 0,
    rebasePending: false,
    rebuilds: 0,
    pending: [],
    specialUses: {},
  };
}

/** One year for one land. Pure: same inputs give the same result. */
export function simulateYear(prev: NationState, choice: Choice, event: EventCard | null, rng: Rng): YearResult {
  const warRoll = rng();
  const btcRoll = rng();
  const notes: string[] = [];
  const s: NationState = { ...prev, pending: [], specialUses: { ...prev.specialUses } };

  // New money after a collapse: bread starts at 10 again.
  let basePrice = prev.breadPrice;
  if (prev.rebasePending) {
    s.priceFactor = 1;
    s.k = (C.startBread * prev.goods) / (prev.money * velocity(prev.trust));
    s.rebasePending = false;
    basePrice = C.startBread;
  }

  if (prev.bitcoin > 0) {
    s.bitcoin = prev.bitcoin * (1 + (btcRoll * 2 - 1) * C.bitcoin.swing);
    notes.push(s.bitcoin >= prev.bitcoin ? 'btcUp' : 'btcDown');
  }

  // 1. Gather inputs: effects waiting from past years, then event, president, bank.
  type Src = 'pending' | 'event' | 'card';
  const inputs: { e: Effect; src: Src; tag?: string }[] = [];
  const pending: Pending[] = [];
  for (const p of prev.pending) {
    if (p.in <= 0) {
      inputs.push({ e: p.effect, src: 'pending', tag: p.tag });
      if (p.years > 1) pending.push({ ...p, years: p.years - 1 });
    } else pending.push({ ...p, in: p.in - 1 });
  }
  if (event) inputs.push({ e: event.effect, src: 'event', tag: event.tag });
  for (const c of [choice.president, choice.bank]) {
    if (!c) continue;
    inputs.push({ e: c.effect, src: 'card', tag: c.tag });
    if (c.nation) s.specialUses[c.id] = (s.specialUses[c.id] ?? 0) + 1;
  }

  const acc = { money: 0, cardMoney: 0, goods: 0, price: 0, trust: 0, jobs: 0, happiness: 0, treasury: 0, debt: 0, reserve: 0, interest: 0, ac: 0 };
  let scandal = false;
  let freeze = false;
  let backed = false;

  for (const { e, src, tag } of inputs) {
    if (e.money) {
      if (src === 'card') acc.cardMoney += e.money;
      else acc.money += e.money * (src === 'event' && e.money < 0 && prev.silverTax ? 2 : 1);
    }
    acc.goods += e.goods ?? 0;
    acc.price += e.price ?? 0;
    acc.trust += e.trust ?? 0;
    acc.jobs += e.jobs ?? 0;
    acc.happiness += e.happiness ?? 0;
    acc.treasury += e.treasury ?? 0;
    acc.debt += e.debt ?? 0;
    acc.reserve += e.reserve ?? 0;
    acc.interest += e.interest ?? 0;
    if (e.acIfTrade && prev.tradeOpen) acc.ac += e.acIfTrade;
    for (const l of e.later ?? []) pending.push({ in: l.in - 1, years: l.years, effect: l.effect, tag: l.tag });

    switch (tag) {
      case 'openTrade': s.tradeOpen = true; break;
      case 'closeTrade': s.tradeOpen = false; break;
      case 'war':
        if (warRoll < C.war.winChance) {
          acc.reserve += C.war.winReserve;
          acc.treasury += C.war.winTreasury;
          notes.push('warWon');
        } else {
          acc.trust -= C.war.loseTrust;
          acc.happiness -= C.war.loseHappiness;
          notes.push('warLost');
        }
        break;
      case 'scandal': scandal = true; notes.push('scandal'); break;
      case 'priceFreeze': freeze = true; break;
      case 'debtCheck':
        if (prev.debt > 0) { acc.trust -= C.trust.kingDebtLoss; notes.push('kingDebt'); }
        break;
      case 'paperOnly': s.paperOnly = true; break;
      case 'makeLots': if (prev.paperOnly) acc.treasury += C.paperOnlyBonus; break;
      case 'silverTax': s.silverTax = true; break;
      case 'leaveGold': s.goldStandard = false; notes.push('leftGold'); break;
      case 'goldBack': backed = true; break;
      case 'bitcoin':
        if (s.bitcoin > 0) { acc.treasury += Math.round(s.bitcoin); s.bitcoin = 0; notes.push('btcSold'); }
        else { acc.treasury -= C.bitcoin.cost; s.bitcoin = C.bitcoin.cost; notes.push('btcBought'); }
        break;
    }
  }
  s.pending = pending;

  // Gold rule: a gold-backed bank can only add a little money.
  if ((s.goldStandard || backed) && acc.cardMoney > C.goldCap) {
    acc.cardMoney = C.goldCap;
    notes.push('goldCapped');
  }

  // 2. Money and goods.
  s.interest = clamp(prev.interest + acc.interest, 0, 10);
  const r = s.interest - C.baseInterest;
  const moneyGrowth = acc.money + acc.cardMoney - C.interestMoney * r;
  const goodsGrowth = C.gBase + acc.goods - C.interestGoods * r;
  s.money = Math.max(1, prev.money * (1 + moneyGrowth));
  s.goods = Math.max(1, prev.goods * (1 + goodsGrowth));
  s.priceFactor *= 1 + acc.price;
  s.reserve = Math.max(0, prev.reserve + acc.reserve);

  // 3-4. Velocity from trust, then bread price and inflation.
  const v = velocity(prev.trust);
  s.lastV = v;
  let price = (s.k * s.money * v * s.priceFactor) / s.goods;
  if (freeze) price = basePrice;
  const inflation = price / basePrice - 1;
  s.breadPrice = price;

  // 5. Jobs.
  s.jobs = clamp(prev.jobs + C.goodsJobs * goodsGrowth - C.interestJobs * r - C.deflationJobs * Math.max(0, -inflation) + acc.jobs);
  const jobsDelta = s.jobs - prev.jobs;

  // 6. Trust, treasury and debt, happiness, Arti-Coin value.
  const T = C.trust;
  let trust = prev.trust + acc.trust;
  if (inflation > T.hyperInflation) trust -= T.hyperLoss;
  else if (inflation > T.veryHighInflation) trust -= T.veryHighLoss;
  else if (inflation > T.highInflation) trust -= T.highLoss;
  else if (Math.abs(inflation) <= T.stableBand && !scandal) trust += T.stableGain;

  let treasury = prev.treasury + acc.treasury + s.netIncome + (s.silverTax ? C.silverTaxIncome : 0);
  let debt = prev.debt + acc.debt;
  if (debt > 0) treasury -= Math.ceil(debt * C.debt.interest);
  if (treasury < 0) { debt += -treasury; treasury = 0; notes.push('borrowed'); }
  if (debt > C.debt.limit) { trust -= T.defaultLoss; debt = Math.floor(debt / 2); notes.push('default'); }
  else if (debt > 0 && treasury >= C.debt.repayAbove) {
    const pay = Math.min(debt, C.debt.repayStep);
    treasury -= pay;
    debt -= pay;
  }
  s.treasury = Math.round(treasury);
  s.debt = Math.round(debt);

  s.happiness = clamp(prev.happiness + C.happiness.jobs * jobsDelta - C.happiness.inflation * Math.abs(inflation) + acc.happiness
    + (Math.abs(inflation) <= T.stableBand ? C.happiness.stableGain : 0));
  s.trust = clamp(trust);
  s.acValue = Math.max(1, (prev.acValue * (1 + C.worldInflation)) / (1 + inflation) * (C.ac.base + (C.ac.trust * s.trust) / 100) + acc.ac);

  const lostTrust = s.trust <= C.detect.lostTrust;
  if (s.trust <= 0) {
    // People use Arti-Coin now. The land starts new money next year (Rebuild mode).
    s.trust = C.rebuildTrust;
    s.rebasePending = true;
    s.rebuilds += 1;
    notes.push('rebuild');
  }

  return {
    state: s,
    inflation,
    goodsGrowth,
    moneyGrowth,
    jobsDelta,
    phenomenon: detectPhenomenon({ inflation, jobsDelta, goodsGrowth }),
    lostTrust,
    notes,
    reason: findReason(inflation, freeze, moneyGrowth, goodsGrowth, v / prev.lastV, acc.price),
  };
}

/** The biggest cause of this year's price change, for the "Why?" button. */
function findReason(inflation: number, freeze: boolean, m: number, g: number, vRatio: number, shock: number): Reason {
  if (freeze) return 'freeze';
  if (Math.abs(inflation) <= C.trust.stableBand) return 'calm';
  const dir = Math.sign(inflation);
  const parts: [Reason, number][] = [
    [dir > 0 ? 'moreMoney' : 'lessMoney', Math.log(1 + m)],
    [dir > 0 ? 'fewerGoods' : 'moreGoods', -Math.log(1 + g)],
    [dir > 0 ? 'lowTrust' : 'highTrust', Math.log(vRatio)],
    ['costs', Math.log(1 + shock)],
  ];
  parts.sort((a, b) => b[1] * dir - a[1] * dir);
  return parts[0][0];
}
