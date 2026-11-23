// Console run: npm run sim -- <nation> <bankCard> [presidentCard] [events] [seed]
import { CARDS, EVENTS, NATIONS } from '../src/data';
import { score, tier } from '../src/engine/detect';
import { autoPlay } from '../src/engine/game';
import type { NationId } from '../src/engine/types';

const [nation = 'rome', bank = 'steady', president = 'none', events = 'history', seed = '1234'] = process.argv.slice(2);
const mix = bank === 'mix';
const g = autoPlay(
  { nations: NATIONS, cards: CARDS, events: EVENTS },
  { seed: Number(seed), turns: 10, events: events as 'all' | 'history' | 'none' },
  nation as NationId,
  (y, s) => mix
    ? { president: s.treasury >= 30 ? 'build' : y % 2 ? 'cutTax' : 'raiseTax', bank: y % 3 === 0 && s.reserve >= 20 ? 'goldBack' : 'makeLittle' }
    : { president: president === 'none' ? null : president, bank },
);
console.log('year  bread  infl%  trust  jobs  happy  gold  loans   AC  what happened');
g.years.forEach((r, i) => {
  const s = r.state;
  const f = (n: number, w: number, d = 0) => n.toFixed(d).padStart(w);
  console.log(`${f(i + 1, 4)} ${f(s.breadPrice, 6, 1)} ${f(r.inflation * 100, 6, 1)} ${f(s.trust, 6)} ${f(s.jobs, 5)} ${f(s.happiness, 6)} ${f(s.treasury, 5)} ${f(s.debt, 6)} ${f(s.acValue, 4)}  ${r.phenomenon} ${r.notes.join(',')}`);
});
console.log(`score ${score(g.final).toFixed(1)} -> ${tier(score(g.final))}`);
