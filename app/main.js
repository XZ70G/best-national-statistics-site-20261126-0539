// Router for Australia by the Numbers.
//
// Hash routes, one page each — the navigation links are plain <a href="#/..."> links, so
// every page is reached by a link and the browser's back button works as expected:
//
//   #/              overview: the headline numbers and where Australians live
//   #/population    population, growth and the states
//   #/economy       GDP, households and wages
//   #/labour        jobs, unemployment and participation
//   #/prices        inflation and the capital cities
//   #/sources       where every figure comes from
//
// The sort buttons on the population and prices pages re-render their page with a new
// order; the choice is kept in memory while the visitor browses, and a page load starts
// with the default order. window.__shotReady is false while a page renders and true once
// it is on screen, so a screenshot script knows when to capture.

import { overview, populationPage, economyPage, labourPage, pricesPage, sourcesPage, notFoundPage } from './views.js';

const app = document.getElementById('app');
const nav = document.getElementById('main-nav');

let populationSort = 'population';
let pricesSort = 'rate';

const ROUTES = {
  '': overview,
  '/population': () => populationPage(populationSort),
  '/economy': economyPage,
  '/labour': labourPage,
  '/prices': () => pricesPage(pricesSort),
  '/sources': sourcesPage,
};

const TITLES = {
  '': 'Australia by the Numbers',
  '/population': 'Population',
  '/economy': 'Economy',
  '/labour': 'Labour market',
  '/prices': 'Prices',
  '/sources': 'Sources and method',
};

function currentRoute() {
  const match = location.hash.match(/^#(\/[^?]*)/);
  if (!match) return '';
  return match[1] === '/' ? '' : match[1];
}

function render() {
  window.__shotReady = false;
  const route = currentRoute();
  const view = ROUTES[route];
  document.title = view
    ? `${TITLES[route]} | Australia by the Numbers`
    : 'Page not found | Australia by the Numbers';
  app.innerHTML = view ? view() : notFoundPage();
  nav.querySelectorAll('a').forEach((link) => {
    const linkRoute = link.getAttribute('href').slice(1);
    link.classList.toggle('current', linkRoute === route || (linkRoute === '/' && route === ''));
    if (link.classList.contains('current')) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
  bindSortButtons();
  window.scrollTo(0, 0);
  window.__shotReady = true;
}

// The sort buttons on the population and prices pages: clicking one re-renders the same
// page with the table and the chart in the chosen order.
function bindSortButtons() {
  app.querySelectorAll('.controls button').forEach((button) => {
    button.addEventListener('click', () => {
      const choice = button.getAttribute('data-sort');
      if (currentRoute() === '/population' && (choice === 'population' || choice === 'growth')) {
        populationSort = choice;
      } else if (currentRoute() === '/prices' && (choice === 'rate' || choice === 'name')) {
        pricesSort = choice;
      } else {
        return;
      }
      render();
    });
  });
}

window.addEventListener('hashchange', render);
render();
