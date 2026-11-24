// Every tuning number of the economy lives here. Change numbers here only.
export const CONFIG = {
  startBread: 10,
  startMoney: 100,
  worldInflation: 0.02, // ATI COIN grows about 2% a year
  gBase: 0, // natural goods growth per year
  baseInterest: 3,
  interestGoods: 0.005, // goods growth lost per interest point above 3
  interestMoney: 0.03, // money growth lost per interest point above 3
  interestJobs: 1.5,
  goodsJobs: 100,
  deflationJobs: 40,
  // V = 1 + slope * (pivot - trust) / 100. Low trust makes money move much faster.
  velocity: { pivot: 50, slopeHigh: 0.2, slopeLow: 1.5 },
  trust: {
    stableBand: 0.03,
    stableGain: 5,
    highInflation: 0.1,
    highLoss: 10,
    veryHighInflation: 0.25, // extra tier added while tuning (PRD has 10% and 50% only)
    veryHighLoss: 18,
    hyperInflation: 0.5,
    hyperLoss: 25,
    defaultLoss: 20,
    kingDebtLoss: 20,
  },
  happiness: { jobs: 0.3, inflation: 35, stableGain: 3 }, // Grade 1: price jumps hurt less // stableGain added while tuning: calm prices cheer people up
  ac: { base: 0.95, trust: 0.1 }, // yearly factor = base + trust * T/100
  debt: { interest: 0.1, limit: 60, repayAbove: 30, repayStep: 10 },
  goldCap: 0.05, // most money a gold-backed bank can add in a year
  goldBackMinReserve: 20,
  silverTaxIncome: 3,
  paperOnlyBonus: 10,
  war: { winChance: 0.5, winReserve: 30, winTreasury: 20, loseTrust: 5, loseHappiness: 8 },
  bitcoin: { cost: 20, swing: 0.4 },
  silverRoute: { spainMoneyGrowth: 0.15, dragonMoney: 0.05 },
  detect: { hyper: 0.5, inflation: 0.05, deflation: -0.02, stableHigh: 0.03, stagJobs: -3, stagGoods: -0.02, lostTrust: 10 },
  guess: { up: 0.03, down: -0.02 },
  rebuildTrust: 20,
  score: { trust: 0.3, happiness: 0.25, jobs: 0.2, ac: 0.25, golden: 75, strong: 55, struggling: 35 }, // Grade 1: easier tiers
  specialMaxUses: 2,
  // Grade 1: few cards to choose from. Tax shows all three (more, same, less).
  handSize: { king: 2, bank: 2, tax: 3, shop: 2 },
  // Who cheers and who complains (see roles.ts).
  mood: { goldMove: 5, highInflation: 0.1, tooPricey: 0.25, jobsDrop: -3, sadDrop: -8 },
} as const;
