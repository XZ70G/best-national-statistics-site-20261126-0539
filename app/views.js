// Page templates for Australia by the Numbers.
//
// Each function returns the HTML for one hash route. All figures come from data.js, which
// holds only numbers the ABS published; every page ends with a Sources note naming the
// release and period behind its figures. Nothing here fetches anything: the whole site is
// static files, and the charts are SVG drawn by charts.js from the same data.

import { siteMeta, population, labour, prices, economy } from './data.js';
import { horizontalBars, verticalBars, stackedBar, stackedLegend } from './charts.js';

function sourceNote(text) {
  return `<p class="source-note">Sources: ${text}. Figures are as published by the ABS; see the <a href="#/sources">Sources page</a> for the full citations.</p>`;
}

function statCard(value, label, detail) {
  return `<div class="stat"><p class="stat-value">${value}</p><p class="stat-label">${label}</p><p class="stat-detail">${detail}</p></div>`;
}

function sectionHead(title, intro) {
  return `<h1>${title}</h1><p class="intro">${intro}</p>`;
}

function signed(n, unit = '') {
  return (n > 0 ? '+' : '') + n.toLocaleString('en-AU') + unit;
}

// ---------------------------------------------------------------- overview (#/)

export function overview() {
  const stateRows = population.states.map((s) => ({
    label: `${s.code} — ${s.name}`,
    value: s.popThousands,
  }));
  return `
  ${sectionHead(
    'Australia at a glance',
    'The headline numbers for the country, drawn from the latest Australian Bureau of Statistics releases. Pick a topic below to see the detail behind each figure.',
  )}
  <div class="stat-grid">
    ${statCard(population.totalLabel, 'People in Australia', `Estimated resident population at ${population.asAt}; ${signed(population.annualChange)} (+${population.annualChangePct}%) over the year.`)}
    ${statCard(labour.unemploymentRate.toFixed(1) + '%', 'Unemployment rate', `Seasonally adjusted, ${labour.period}; up ${labour.unemploymentChangePts} points on September.`)}
    ${statCard('+' + prices.annualChange.toFixed(1) + '%', 'Consumer prices, over the year', `Monthly CPI, ${prices.period}; above the 2–3% target band for the ${prices.monthsAboveTargetBand}th month in a row.`)}
    ${statCard('+' + economy.gdpAnnual.toFixed(1) + '%', 'GDP growth, over the year', `June quarter 2025, seasonally adjusted chain volume; $${economy.gdpValueBillions.toFixed(1)} billion in the quarter.`)}
  </div>
  <h2>Where Australians live</h2>
  <p>Population of each state and territory at ${population.asAt}, in thousands. New South Wales holds almost a third of the country; Western Australia grew fastest over the year (+${population.states.find((s) => s.code === 'WA').changePct}%).</p>
  <div class="chart">${horizontalBars(stateRows, { format: (v) => v.toLocaleString('en-AU', { minimumFractionDigits: 1 }) + 'k' })}</div>
  <p><a class="button" href="#/population">See the full population page →</a></p>
  <h2>Explore the numbers</h2>
  <ul class="topic-list">
    <li><a href="#/population">Population</a> — 27.6 million people, where they live, and what drove growth.</li>
    <li><a href="#/economy">Economy</a> — GDP, household spending and saving, and wage growth.</li>
    <li><a href="#/labour">Labour market</a> — jobs, unemployment and participation, October 2026.</li>
    <li><a href="#/prices">Prices</a> — inflation, what is pushing it up, and how each capital city compares.</li>
  </ul>
  ${sourceNote('ABS, National, state and territory population (Jun 2025); Labour Force, Australia (Oct 2026); Consumer Price Index, Australia (Sep 2026); Australian National Accounts (Jun 2025)')}
  `;
}

// ------------------------------------------------------------- population (#/population)

export function populationPage(sortKey = 'population') {
  const sorted = [...population.states].sort((a, b) =>
    sortKey === 'growth' ? b.changePct - a.changePct : b.popThousands - a.popThousands,
  );
  const rows = sorted.map((s) => ({ label: `${s.code} — ${s.name}`, value: s.popThousands }));
  const growthParts = [
    { label: 'Natural increase (births minus deaths)', value: population.naturalIncrease, valueText: population.naturalIncrease.toLocaleString('en-AU'), shareText: ((population.naturalIncrease / population.annualChange) * 100).toFixed(1) + '%' },
    { label: 'Net overseas migration', value: population.netOverseasMigration, valueText: population.netOverseasMigration.toLocaleString('en-AU'), shareText: ((population.netOverseasMigration / population.annualChange) * 100).toFixed(1) + '%' },
  ];
  const tableRows = sorted
    .map(
      (s) => `<tr><td>${s.name} (${s.code})</td><td class="num">${(s.popThousands * 1000).toLocaleString('en-AU')}</td><td class="num">+${s.changeThousands.toLocaleString('en-AU', { minimumFractionDigits: 1 })}k</td><td class="num">+${s.changePct.toFixed(1)}%</td></tr>`,
    )
    .join('');
  return `
  ${sectionHead(
    'Population',
    `Australia's estimated resident population was ${population.totalLabel} at ${population.asAt} — ${signed(population.annualChange)} people (+${population.annualChangePct}%) more than a year earlier.`,
  )}
  <div class="stat-grid">
    ${statCard(population.totalLabel, 'Estimated resident population', `At ${population.asAt} (preliminary).`)}
    ${statCard('+' + population.annualChangePct.toFixed(1) + '%', 'Growth over the year', `${signed(population.annualChange)} people in the year to June 2025.`)}
    ${statCard(population.medianAge.toFixed(1), 'Median age', 'Years, at 30 June 2025.')}
    ${statCard(population.bornOverseasPct + '%', 'Born overseas', `${population.bornOverseasMillions} million people; ${population.bornInAustraliaMillions} million (${population.bornInAustraliaPct}%) were born in Australia.`)}
  </div>
  <h2>What drove the growth</h2>
  <p>In the year to June 2025 the population grew by ${population.annualChange.toLocaleString('en-AU')} people. Most of that growth came from migration; the rest from births outnumbering deaths.</p>
  <div class="chart">${stackedBar(growthParts)}</div>
  <ul class="legend">${stackedLegend(growthParts)}</ul>
  <p>Natural increase was ${population.naturalIncrease.toLocaleString('en-AU')} people — ${population.births.toLocaleString('en-AU')} births minus ${population.deaths.toLocaleString('en-AU')} deaths. The largest overseas-born groups are ${population.largestOverseasBorn.join(', ')}.</p>
  <h2>Population by state and territory</h2>
  <p>Population at ${population.asAt} and the change on a year ago. Use the buttons to reorder the table and the chart.</p>
  <div class="controls" role="group" aria-label="Sort states">
    <button type="button" data-sort="population" class="${sortKey === 'population' ? 'active' : ''}">Sort by population</button>
    <button type="button" data-sort="growth" class="${sortKey === 'growth' ? 'active' : ''}">Sort by growth rate</button>
  </div>
  <div class="chart">${horizontalBars(rows, { format: (v) => v.toLocaleString('en-AU', { minimumFractionDigits: 1 }) + 'k' })}</div>
  <table class="data-table">
    <thead><tr><th>State / territory</th><th class="num">Population</th><th class="num">Change (people)</th><th class="num">Change (%)</th></tr></thead>
    <tbody>${tableRows}</tbody>
  </table>
  ${sourceNote(population.source + ' and ABS, Australia’s population by country of birth')}
  `;
}

// ----------------------------------------------------------------- economy (#/economy)

export function economyPage() {
  const growthRows = [
    { label: 'GDP, quarter', value: economy.gdpQuarterly },
    { label: 'GDP, year', value: economy.gdpAnnual },
    { label: 'GDP per person, quarter', value: economy.gdpPerCapitaQuarterly },
    { label: 'Household spending, quarter', value: economy.householdConsumptionQuarterly },
    { label: 'Wages (WPI), year', value: economy.wagePriceIndexAnnual },
  ];
  return `
  ${sectionHead(
    'Economy',
    `The economy grew ${economy.gdpQuarterly.toFixed(1)}% in the ${economy.period} and ${economy.gdpAnnual.toFixed(1)}% over the year, to $${economy.gdpValueBillions.toFixed(1)} billion in the quarter.`,
  )}
  <div class="stat-grid">
    ${statCard('+' + economy.gdpQuarterly.toFixed(1) + '%', 'GDP, June quarter 2025', 'Seasonally adjusted, chain volume measures.')}
    ${statCard('+' + economy.gdpAnnual.toFixed(1) + '%', 'GDP, over the year', 'Financial year 2024–25: +' + economy.financialYearGrowth.toFixed(1) + '%.')}
    ${statCard(economy.householdSavingRatio.toFixed(1) + '%', 'Household saving ratio', `Down from ${economy.householdSavingRatioPrevious.toFixed(1)}% in the March quarter.`)}
    ${statCard('+' + economy.wagePriceIndexAnnual.toFixed(1) + '%', 'Wage Price Index, over the year', `Public sector +${economy.wagePriceIndexPublic.toFixed(1)}%; private sector +${economy.wagePriceIndexPrivate.toFixed(1)}%.`)}
  </div>
  <h2>Growth at a glance</h2>
  <p>Percentage change for the main measures, June quarter 2025. GDP per person fell over the year even though total GDP rose — the population grew faster than the economy.</p>
  <div class="chart">${horizontalBars(growthRows, { max: 4, format: (v) => (v > 0 ? '+' : '') + v.toFixed(1) + '%' })}</div>
  <h2>Households</h2>
  <p>Household consumption rose ${economy.householdConsumptionQuarterly.toFixed(1)}% in the quarter, contributing ${economy.householdConsumptionContributionPts.toFixed(1)} percentage points to GDP growth. Discretionary spending — the things people choose to buy rather than need — rose ${economy.discretionarySpendingQuarterly.toFixed(1)}%.</p>
  <p>But households saved less: the saving ratio fell to ${economy.householdSavingRatio.toFixed(1)}% from ${economy.householdSavingRatioPrevious.toFixed(1)}% in the March quarter.</p>
  <h2>A slow year</h2>
  <p>Across financial year 2024–25 the economy grew ${economy.financialYearGrowth.toFixed(1)}% — ${economy.financialYearNote}.</p>
  ${sourceNote(economy.source)}
  `;
}

// ------------------------------------------------------------------- labour (#/labour)

export function labourPage() {
  const stateRows = labour.stateUnemploymentTrend.map((s) => ({ label: `${s.code} — ${s.name}`, value: s.rate }));
  const worst = [...labour.stateUnemploymentTrend].sort((a, b) => b.rate - a.rate)[0];
  const best = [...labour.stateUnemploymentTrend].sort((a, b) => a.rate - b.rate)[0];
  return `
  ${sectionHead(
    'Labour market',
    `In ${labour.period} the unemployment rate was ${labour.unemploymentRate.toFixed(1)}% — ${labour.unemploymentNote.toLowerCase()} — while ${labour.employedLabel} people were employed.`,
  )}
  <div class="stat-grid">
    ${statCard(labour.unemploymentRate.toFixed(1) + '%', 'Unemployment rate', `Seasonally adjusted, ${labour.period}; up ${labour.unemploymentChangePts} points on September. Trend: ${labour.trendUnemploymentRate.toFixed(1)}%.`)}
    ${statCard(labour.employedLabel, 'People employed', `${signed(labour.employedMonthlyChange)} (${labour.employedMonthlyChangePct}%) in the month; +${labour.employedYearChange.toLocaleString('en-AU')} (+${labour.employedYearChangePct}%) over the year.`)}
    ${statCard(labour.participationRate.toFixed(1) + '%', 'Participation rate', `Down ${Math.abs(labour.participationChangePts)} points in the month.`)}
    ${statCard(labour.youthUnemploymentRate.toFixed(1) + '%', 'Youth unemployment (15–24)', `Up ${labour.youthUnemploymentChangePts} points in the month.`)}
  </div>
  <h2>Who is out of work</h2>
  <p>${labour.unemployedLabel} people were unemployed in ${labour.period}, ${signed(labour.unemployedMonthlyChange)} more than in September and ${signed(labour.unemployedYearChange)} (+${labour.unemployedYearChangePct}%) more than a year earlier.</p>
  <p>Looking beyond the headline rate: the underemployment rate was ${labour.underemploymentRate.toFixed(1)}% and the underutilisation rate — unemployed plus underemployed — was ${labour.underutilisationRate.toFixed(1)}%. The employment-to-population ratio was ${labour.employmentToPopulation.toFixed(1)}% (${labour.trendEmploymentToPopulation.toFixed(1)}% in trend terms).</p>
  <h2>Unemployment by state (trend)</h2>
  <p>Trend unemployment rates, ${labour.period}. ${worst.name} was highest at ${worst.rate.toFixed(1)}%; the Australian Capital Territory was lowest at ${best.rate.toFixed(1)}%. Tasmania and the Northern Territory are not published in this state series.</p>
  <div class="chart">${horizontalBars(stateRows, { max: 6, format: (v) => v.toFixed(1) + '%' })}</div>
  ${sourceNote(labour.source + ' (released 19 November 2026)')}
  `;
}

// ------------------------------------------------------------------- prices (#/prices)

export function pricesPage(sortKey = 'rate') {
  const sorted = [...prices.byCity].sort((a, b) =>
    sortKey === 'name' ? a.city.localeCompare(b.city) : b.annual - a.annual,
  );
  const chartRows = sorted.map((c) => ({ label: c.city, value: c.annual }));
  const ausIndex = sorted.findIndex((c) => c.city === 'Australia');
  const tableRows = sorted
    .map(
      (c) => `<tr${c.city === 'Australia' ? ' class="total-row"' : ''}><td>${c.city}</td><td class="num">${c.annual.toFixed(1)}%</td></tr>`,
    )
    .join('');
  return `
  ${sectionHead(
    'Prices',
    `Consumer prices rose ${prices.monthlyChange.toFixed(1)}% in ${prices.period} and ${prices.annualChange.toFixed(1)}% over the year — up from ${prices.previousAnnualChange.toFixed(1)}% in August and above the Reserve Bank's ${prices.targetBand} target band for the ${prices.monthsAboveTargetBand}th month in a row.`,
  )}
  <div class="stat-grid">
    ${statCard('+' + prices.annualChange.toFixed(1) + '%', 'CPI, over the year', `Monthly CPI, ${prices.period}; +${prices.monthlyChange.toFixed(1)}% in the month.`)}
    ${statCard('+' + prices.quarterlyAnnualChange.toFixed(1) + '%', 'CPI, September quarter', `+${prices.quarterlyChange.toFixed(1)}% in the quarter.`)}
    ${statCard(prices.trimmedMeanAnnual.toFixed(1) + '%', 'Trimmed mean (underlying inflation)', `${prices.trimmedMeanAnnual.toFixed(1)}% over the year to September; the quarterly trimmed mean was ${prices.quarterlyTrimmedMeanAnnual.toFixed(1)}%.`)}
    ${statCard('+' + prices.automotiveFuelMonthly.toFixed(1) + '%', 'Automotive fuel, in September', `After a ${prices.automotiveFuelPreviousMonthly.toFixed(1)}% rise in August.`)}
  </div>
  <h2>What pushed prices up</h2>
  <p>The largest contributors to annual inflation were ${prices.largestContributors.map((c) => `${c.group} (+${c.annual.toFixed(1)}%)`).join(', ')}.</p>
  <h2>Inflation by capital city</h2>
  <p>Annual CPI change to the September quarter 2026. Hobart rose fastest at ${prices.byCity.find((c) => c.city === 'Hobart').annual.toFixed(1)}%; Melbourne slowest at ${prices.byCity.find((c) => c.city === 'Melbourne').annual.toFixed(1)}%.</p>
  <div class="controls" role="group" aria-label="Sort cities">
    <button type="button" data-sort="rate" class="${sortKey === 'rate' ? 'active' : ''}">Sort by inflation rate</button>
    <button type="button" data-sort="name" class="${sortKey === 'name' ? 'active' : ''}">Sort alphabetically</button>
  </div>
  <div class="chart">${verticalBars(chartRows, { format: (v) => v.toFixed(1) + '%', highlightIndex: ausIndex })}</div>
  <table class="data-table">
    <thead><tr><th>City</th><th class="num">CPI, year to Sep quarter 2026</th></tr></thead>
    <tbody>${tableRows}</tbody>
  </table>
  ${sourceNote(prices.source + ' (released 28 October 2026)')}
  `;
}

// ------------------------------------------------------------------ sources (#/sources)

export function sourcesPage() {
  return `
  ${sectionHead(
    'Sources and method',
    'Every figure on this site comes from the Australian Bureau of Statistics. This page lists each release, so any number can be checked against its source.',
  )}
  <h2>The releases behind the figures</h2>
  <ul class="source-list">
    <li><strong>Population</strong> — ${population.source}; and ABS, Australia's population by country of birth, latest release. Population at 30 June 2025 is preliminary.</li>
    <li><strong>Labour market</strong> — ${labour.source}, released 19 November 2026. Seasonally adjusted unless a figure says "trend".</li>
    <li><strong>Prices</strong> — ${prices.source}, released 28 October 2026.</li>
    <li><strong>Economy</strong> — ${economy.source}.</li>
  </ul>
  <h2>What this site does not do</h2>
  <ul>
    <li>No figure is estimated or invented. Where the ABS has not published a number — for example, trend unemployment for Tasmania and the Northern Territory — the site says so instead of filling it in.</li>
    <li>No interest-rate figure is shown: the cash rate is set by the Reserve Bank, not the ABS, and was not verified against the Bank's own publication for this site.</li>
    <li>No time series is drawn from a single release: the charts compare places and groups at one point in time, not a made-up history.</li>
  </ul>
  <h2>How the site works</h2>
  <p>This is a static site: pages, styles, charts and figures are files in this folder, and nothing is fetched from the internet. The charts are drawn by the site's own code from the figures in its data file. It works on a desktop and on a phone, with no account and no tracking.</p>
  <p class="source-note">All figures: Australian Bureau of Statistics (abs.gov.au). This site is not affiliated with the ABS; it republishes published figures with their sources.</p>
  `;
}

export function notFoundPage() {
  return `
  <h1>That page isn't here</h1>
  <p class="intro">There is no statistics page at this address. Try one of the sections below.</p>
  <ul class="topic-list">
    <li><a href="#/">Overview</a> — Australia at a glance.</li>
    <li><a href="#/population">Population</a></li>
    <li><a href="#/economy">Economy</a></li>
    <li><a href="#/labour">Labour market</a></li>
    <li><a href="#/prices">Prices</a></li>
  </ul>
  `;
}

export { siteMeta };
