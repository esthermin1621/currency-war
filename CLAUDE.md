# Currency Wars: Arti-Coin

A browser money-history simulation for students who read English at a US Grade 2 level (AR 2.0–2.9).
The player is President + Central Bank of one of six lands for 10 years (turns). Full spec: `PRD.md`.

## Rules for all player-facing English
- Max 10 words per sentence, max 3 sentences per screen (word cards are the one 4-part exception).
- Present or simple past tense, active voice, no relative clauses.
- No economic jargon except the 10 Word Card words (`src/data/words.json`).
- No percent signs on screen: use icons, arrows and colour together (never colour alone).
- Buttons at least 64px, body text at least 20px, every sentence has a 🔊 read-aloud option.
- Teacher mode text may be Korean.

## Architecture rules
- `src/engine/` is pure TypeScript: no React imports, no `Math.random` (use the seeded RNG).
- Every tuning number lives in `src/engine/config.ts`.
- Card / event / nation / word content lives in `src/data/*.json`.
- One Zustand store (`src/store/game.ts`), saved to localStorage.
- Screen flow: title → pickLand → pickJob → [news → president → bank → guess → result → report] × turns → end.

## Commands
- `npm run dev` — run the game
- `npm test` — engine tests + balance scenarios (PRD section 12); must pass after any config change
- `npm run sim -- rome makeLots` — print a 10-year run in the console
- `npm run build` — type-check and build for Vercel
