export type NationId = 'rome' | 'spain' | 'khan' | 'dragon' | 'calm' | 'usa';
export type Role = 'president' | 'bank';

/** Engine input shared by cards and events. Fractions for money/goods/price, points for the rest. */
export interface Effect {
  money?: number;
  goods?: number;
  price?: number;
  trust?: number;
  jobs?: number;
  happiness?: number;
  treasury?: number;
  debt?: number;
  reserve?: number;
  interest?: number;
  acIfTrade?: number;
  later?: { in: number; years: number; effect: Effect; tag?: string }[];
}

export interface Card {
  id: string;
  role: Role;
  name: string;
  text: string;
  hint: string;
  icon: string;
  effect: Effect;
  tag?: string;
  nation?: NationId;
  unlockYear?: number;
  ko?: string;
}

export interface EventCard {
  id: string;
  name: string;
  text: string;
  icon: string;
  effect: Effect;
  tag?: string;
  nation?: NationId;
  year?: number;
  fact?: string;
}

export interface NationDef {
  id: NationId;
  name: string;
  region: string;
  currency: string;
  moneyKind: string;
  icon: string;
  color: string;
  lon: number;
  lat: number;
  iso: string[];
  acRate: number;
  strong: string;
  weak: string;
  ko: string;
  start: { goods: number; trust: number; reserve: number; netIncome: number; tradeOpen: boolean; goldStandard: boolean };
}

export interface Pending {
  in: number;
  years: number;
  effect: Effect;
  tag?: string;
}

export interface NationState {
  id: NationId;
  money: number;
  goods: number;
  trust: number;
  breadPrice: number;
  jobs: number;
  happiness: number;
  treasury: number;
  debt: number;
  reserve: number;
  interest: number;
  acValue: number;
  netIncome: number;
  k: number;
  priceFactor: number;
  lastV: number;
  tradeOpen: boolean;
  goldStandard: boolean;
  paperOnly: boolean;
  silverTax: boolean;
  bitcoin: number;
  rebasePending: boolean;
  rebuilds: number;
  pending: Pending[];
  specialUses: Record<string, number>;
}

export type Phenomenon = 'hyperinflation' | 'stagflation' | 'inflation' | 'deflation' | 'stable' | 'mild';
export type Reason =
  | 'calm' | 'freeze' | 'moreMoney' | 'fewerGoods' | 'lowTrust' | 'costs'
  | 'lessMoney' | 'moreGoods' | 'highTrust';

export interface Choice {
  president?: Card | null;
  bank?: Card | null;
}

export interface YearResult {
  state: NationState;
  inflation: number;
  goodsGrowth: number;
  moneyGrowth: number;
  jobsDelta: number;
  phenomenon: Phenomenon;
  lostTrust: boolean;
  notes: string[];
  reason: Reason;
}
