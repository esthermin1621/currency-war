import nationsJson from './nations.json';
import cardsJson from './cards.json';
import eventsJson from './events.json';
import wordsJson from './words.json';
import type { Card, EventCard, NationDef, NationId } from '../engine/types';

export interface WordDef {
  id: string;
  word: string;
  icon: string;
  def: string;
  happened: string;
  history: string;
  ko: string;
  talk: string;
  quiz: { q: string; right: { icon: string; text: string }; wrong: { icon: string; text: string } };
}

export const NATIONS = nationsJson as unknown as NationDef[];
export const CARDS = cardsJson as unknown as Card[];
export const EVENTS = eventsJson as unknown as EventCard[];
export const WORDS = wordsJson as unknown as WordDef[];
export const NATION_IDS = NATIONS.map((n) => n.id);

export const nationDef = (id: NationId) => NATIONS.find((n) => n.id === id)!;
export const cardById = (id: string | null | undefined) => CARDS.find((c) => c.id === id) ?? null;
export const eventById = (id: string | null | undefined) => EVENTS.find((e) => e.id === id) ?? null;
export const wordById = (id: string) => WORDS.find((w) => w.id === id)!;

import rolesJson from './roles.json';
import questsJson from './quests.json';
import type { Helper } from '../engine/types';
import type { QuestDef } from '../engine/quests';

export interface HelperDef { id: Helper; name: string; icon: string; color: string; job: string }
export const HELPERS_DEF = rolesJson.helpers as HelperDef[];
export const HELPER_LINES = rolesJson.lines as unknown as Record<Helper, Record<string, string[]>> & { ok: string[] };
export const helperDef = (id: Helper) => HELPERS_DEF.find((h) => h.id === id)!;
export const QUESTS = questsJson as QuestDef[];
export const questById = (id: string) => QUESTS.find((q) => q.id === id)!;
