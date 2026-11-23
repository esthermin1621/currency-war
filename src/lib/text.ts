import type { GuessDir, Tier } from '../engine/detect';
import type { Phenomenon, Reason } from '../engine/types';

// All player-facing English: 10 words or fewer per sentence, 3 sentences or fewer per screen.

export const PHENOMENON: Record<Phenomenon, { title: string; icon: string; word: string | null; color: string }> = {
  hyperinflation: { title: 'Prices went up very, very fast!', icon: '🍞🚀', word: 'hyperinflation', color: '#fecaca' },
  stagflation: { title: 'Prices went up. Jobs went down.', icon: '🍞⬆️ 🔨⬇️', word: 'stagflation', color: '#fed7aa' },
  inflation: { title: 'Bread costs more now.', icon: '🍞⬆️', word: 'inflation', color: '#fecaca' },
  deflation: { title: 'Bread costs less. Shops are empty.', icon: '🍞⬇️', word: 'deflation', color: '#bfdbfe' },
  stable: { title: 'Prices stay the same. Shops are busy.', icon: '⭐', word: 'trust', color: '#bbf7d0' },
  mild: { title: 'Bread costs a little more.', icon: '🍞↗️', word: null, color: '#fef3c7' },
};

export const REASON: Record<Reason, string> = {
  calm: 'Money and goods did not change much. Prices stayed the same.',
  freeze: 'The king holds prices down. But shops have less to sell.',
  moreMoney: 'You made more money. But goods stayed the same.',
  fewerGoods: 'There are fewer goods. So each one costs more.',
  lowTrust: 'People do not trust the money. They spend it fast.',
  costs: 'Goods from far away cost more now.',
  lessMoney: 'There is less money. So prices went down.',
  moreGoods: 'There are more goods. So each one costs less.',
  highTrust: 'People trust the money. They keep it longer.',
};

export const NOTE: Record<string, string> = {
  warWon: '⚔️ You won the war! You got gold.',
  warLost: '⚔️ You lost the war. People are sad.',
  scandal: '🔍 People found out! Your coins have less silver.',
  borrowed: '📝 You had no gold. You had to borrow.',
  default: '💥 You cannot pay back the money. People are mad.',
  kingDebt: '👑 You did not pay back your gold. People trust you less.',
  goldCapped: '🥇 You need gold to make money. You made only a little.',
  leftGold: '🔓 You do not need gold now. You can make more money.',
  rebuild: '🪙 People use Arti-Coin now. You must start new money.',
  btcUp: '₿ Your Bitcoin went up!',
  btcDown: '₿ Your Bitcoin went down!',
  btcBought: '₿ You bought Bitcoin.',
  btcSold: '₿ You sold your Bitcoin.',
};

export const GUESS: Record<GuessDir, { icon: string; label: string }> = {
  up: { icon: '⬆️', label: 'More' },
  same: { icon: '➡️', label: 'The same' },
  down: { icon: '⬇️', label: 'Less' },
};

export const TIER: Record<Tier, { title: string; icon: string; text: string; color: string }> = {
  golden: { title: 'Golden Age', icon: '🌟', text: 'Your land is rich and happy. People trust your money!', color: '#fde68a' },
  strong: { title: 'Strong', icon: '💪', text: 'Your land is doing well.', color: '#bbf7d0' },
  struggling: { title: 'Hard Times', icon: '😟', text: 'Times are hard. Your money is weak.', color: '#fed7aa' },
  fallen: { title: 'Fallen', icon: '🏚️', text: 'People do not trust your money now.', color: '#e5e7eb' },
};

export const OTHER_NEWS: Record<Phenomenon, string> = {
  hyperinflation: 'Prices went up very, very fast there!',
  stagflation: 'Prices went up there. Jobs went down.',
  inflation: 'Prices went up there.',
  deflation: 'Prices went down there. Shops are empty.',
  stable: 'Prices stay the same there.',
  mild: 'Prices went up a little there.',
};

export const STEPS = [
  { phase: 'news', label: 'News', icon: '📰' },
  { phase: 'president', label: 'President', icon: '👑' },
  { phase: 'bank', label: 'Bank', icon: '🏦' },
  { phase: 'guess', label: 'Guess', icon: '🤔' },
  { phase: 'result', label: 'Result', icon: '🍞' },
  { phase: 'report', label: 'Report', icon: '📈' },
] as const;
