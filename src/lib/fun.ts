import jokes from '../data/jokes.json';
import { mixSeed } from '../engine/rng';

export const JOKES = jokes;

/** Pick one funny line. The same game and year always get the same line. */
export function pickLine(list: string[], ...key: (string | number)[]): string {
  return list[mixSeed(...key) % list.length];
}
