// Australia by the Numbers — the figures the site shows.
//
// Every number here comes from the Australian Bureau of Statistics releases named in each
// section's `source` field. Nothing here is estimated or invented: where the ABS did not
// publish a figure, the site says so instead of guessing one. Figures are shown with the
// period they describe, so a reader always knows how fresh a number is.

export const siteMeta = {
  country: 'Australia',
  title: 'Australia by the Numbers',
  tagline: 'The key national statistics, in plain language, with the source on every figure.',
  updated: '26 November 2026',
};

// Population — ABS, National, state and territory population, June 2025 (preliminary).
export const population = {
  source: 'ABS, National, state and territory population, June 2025',
  total: 27614411,
  totalLabel: '27,614,411',
  asAt: '30 June 2025',
  annualChange: 420100,
  annualChangePct: 1.5,
  quarterlyChange: 82189,
  quarterlyChangePct: 0.3,
  naturalIncrease: 114556,
  births: 300277,
  deaths: 185721,
  netOverseasMigration: 305569,
  bornInAustraliaMillions: 18.8,
  bornInAustraliaPct: 68.0,
  bornOverseasMillions: 8.8,
  bornOverseasPct: 32,
  largestOverseasBorn: ['India', 'England', 'China', 'New Zealand'],
  medianAge: 38.5,
  // State and territory populations at 30 June 2025, in thousands, with the change on a year ago.
  states: [
    { code: 'NSW', name: 'New South Wales', popThousands: 8593.9, changeThousands: 101.8, changePct: 1.2 },
    { code: 'VIC', name: 'Victoria', popThousands: 7074.5, changeThousands: 123.5, changePct: 1.8 },
    { code: 'QLD', name: 'Queensland', popThousands: 5669.8, changeThousands: 97.9, changePct: 1.8 },
    { code: 'SA', name: 'South Australia', popThousands: 1902.3, changeThousands: 20.2, changePct: 1.1 },
    { code: 'WA', name: 'Western Australia', popThousands: 3043.7, changeThousands: 65.6, changePct: 2.2 },
    { code: 'TAS', name: 'Tasmania', popThousands: 576.0, changeThousands: 1.2, changePct: 0.2 },
    { code: 'NT', name: 'Northern Territory', popThousands: 264.4, changeThousands: 3.5, changePct: 1.4 },
    { code: 'ACT', name: 'Australian Capital Territory', popThousands: 484.8, changeThousands: 6.4, changePct: 1.3 },
  ],
};

// Labour market — ABS, Labour Force, Australia, October 2026 (released 19 November 2026).
// Seasonally adjusted unless a figure says "trend".
export const labour = {
  source: 'ABS, Labour Force, Australia, October 2026',
  period: 'October 2026',
  unemploymentRate: 4.9,
  unemploymentChangePts: 0.1,
  unemploymentNote: 'Highest since October 2021',
  employed: 14738600,
  employedLabel: '14,738,600',
  employedMonthlyChange: -43500,
  employedMonthlyChangePct: -0.3,
  unemployed: 753700,
  unemployedLabel: '753,700',
  unemployedMonthlyChange: 17800,
  participationRate: 66.6,
  participationChangePts: -0.2,
  employmentToPopulation: 63.3,
  employmentToPopulationChangePts: -0.3,
  underemploymentRate: 6.2,
  underutilisationRate: 11.1,
  youthUnemploymentRate: 11.3,
  youthUnemploymentChangePts: 0.1,
  trendUnemploymentRate: 4.8,
  trendEmploymentToPopulation: 63.6,
  employedYearChange: 83500,
  employedYearChangePct: 0.6,
  unemployedYearChange: 95400,
  unemployedYearChangePct: 14.5,
  // Trend unemployment rates by state, October 2026. Tasmania and the Northern Territory
  // are not published in this state series, so they are left out rather than filled in.
  stateUnemploymentTrend: [
    { code: 'NSW', name: 'New South Wales', rate: 4.6 },
    { code: 'VIC', name: 'Victoria', rate: 5.2 },
    { code: 'QLD', name: 'Queensland', rate: 4.7 },
    { code: 'SA', name: 'South Australia', rate: 4.6 },
    { code: 'WA', name: 'Western Australia', rate: 4.5 },
    { code: 'ACT', name: 'Australian Capital Territory', rate: 4.2 },
  ],
};

// Prices — ABS, Consumer Price Index, Australia, September 2026 (released 28 October 2026).
export const prices = {
  source: 'ABS, Consumer Price Index, Australia, September 2026',
  period: 'September 2026',
  monthlyChange: 0.8,
  annualChange: 4.3,
  previousAnnualChange: 4.0,
  monthsAboveTargetBand: 14,
  targetBand: '2–3%',
  quarterlyChange: 1.3,
  quarterlyAnnualChange: 3.9,
  trimmedMeanAnnual: 3.6,
  quarterlyTrimmedMeanAnnual: 3.7,
  quarterlyTrimmedMeanQuarterly: 1.0,
  largestContributors: [
    { group: 'Housing', annual: 5.3 },
    { group: 'Transport', annual: 5.3 },
    { group: 'Food and non-alcoholic beverages', annual: 3.1 },
  ],
  automotiveFuelMonthly: 9.4,
  automotiveFuelPreviousMonthly: 14.8,
  // CPI by capital city, annual change to the September quarter 2026.
  byCity: [
    { city: 'Sydney', annual: 3.8 },
    { city: 'Melbourne', annual: 3.6 },
    { city: 'Brisbane', annual: 4.1 },
    { city: 'Adelaide', annual: 4.7 },
    { city: 'Perth', annual: 4.2 },
    { city: 'Hobart', annual: 4.8 },
    { city: 'Darwin', annual: 4.5 },
    { city: 'Canberra', annual: 4.0 },
    { city: 'Australia', annual: 3.9 },
  ],
};

// Economy — ABS, Australian National Accounts, June quarter 2025.
export const economy = {
  source: 'ABS, Australian National Accounts: National Income, Expenditure and Product, June 2025',
  period: 'June quarter 2025',
  gdpQuarterly: 0.6,
  gdpAnnual: 1.8,
  gdpValueBillions: 664.2,
  financialYearGrowth: 1.3,
  financialYearNote: 'Weakest year-on-year growth since the early 1990s, excluding the COVID-affected 2019–20 year',
  gdpPerCapitaQuarterly: 0.2,
  gdpPerCapitaAnnual: -0.4,
  householdConsumptionQuarterly: 0.9,
  householdConsumptionContributionPts: 0.4,
  discretionarySpendingQuarterly: 1.4,
  householdSavingRatio: 4.2,
  householdSavingRatioPrevious: 5.2,
  wagePriceIndexAnnual: 3.4,
  wagePriceIndexPublic: 3.8,
  wagePriceIndexPrivate: 3.2,
};
