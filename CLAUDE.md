# ATI ATI · Currency Wars (ATI COIN)

A browser money-history simulation, tuned for Grade 1 players (young readers, US Grade 1 English).
The team runs one of six lands for 6 years by default (6/8/10 in teacher mode). Full spec: `PRD.md` (the game has since moved past it: see below).

## Game design (current)
- Five helpers: 🤴 King, 🏦 Banker, 🧾 Tax Collector, 🧑‍🍳 Shopkeeper pick one card each year; 🙋 People make the bread-price guess.
- Each role sees only 2 cards (Tax sees More / Same / Less). Risky cards show a ⚠️ sign (teacher can turn it off).
- After the result, "Town Talk": every helper cheers or complains (`src/engine/roles.ts`, lines in `src/data/roles.json`).
- Roblox-style quests: 3 on the board at a time, stars as rewards, badges on the end screen (`src/engine/quests.ts`, `src/data/quests.json`).

## Rules for all player-facing English
- Max 8 words per sentence (checked by tests), max 3 sentences per screen (word cards are the one 4-part exception).
- Present or simple past tense, active voice, no relative clauses.
- No economic jargon except the 10 Word Card words (`src/data/words.json`).
- No percent signs on screen: use icons, arrows and colour together (never colour alone).
- Buttons at least 64px, body text at least 20px, every sentence has a 🔊 read-aloud option.
- The shared world money is spelled "ATI COIN"; the coin buddy is "Ati"; the logo reads "ATI ATI".
- Prefer short, common words (Dolch/Fry lists). Say "land", "mad", "pay back"; avoid words like "country", "limits", "debts".
- The whole app is in English, teacher mode included. Korean appears only in the optional Korean hints.

## Architecture rules
- `src/engine/` is pure TypeScript: no React imports, no `Math.random` (use the seeded RNG).
- Every tuning number lives in `src/engine/config.ts`.
- Card / event / nation / word content lives in `src/data/*.json`.
- One Zustand store (`src/store/game.ts`), saved to localStorage.
- Screen flow: title → pickLand → pickJob → [news → king → bank → tax → shop → guess → result → talk] × turns → end.

## Commands
- `npm run dev` — run the game
- `npm test` — engine tests + balance scenarios (PRD section 12); must pass after any config change
- `npm run sim -- rome makeLots` — print a 10-year run in the console
- `npm run build` — type-check and build for Vercel
