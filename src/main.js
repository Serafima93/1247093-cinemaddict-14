import { createSiteMenuTemplate } from './view/menu.js';
import { createUser } from './view/user.js';
import { filmListWrap, createFilmCard } from './view/film-card.js';
import { createShowMoreButton } from './view/button-show-more.js';
import { createPopUp } from './view/pop-up-information.js';
import { createFooterStatistic } from './view/footer.js';

import {generateFilm, generatePopUpFilm} from './mock/film';

const CARDS_MAX_COUNT = 5;
const CARDS_MIN_COUNT = 2;

const films = new Array(CARDS_MAX_COUNT).fill().map(generateFilm);

const popups = new Array(1).fill().map(generatePopUpFilm);


const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};
const siteUserElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer__statistics');


render(siteUserElement, createUser(), 'beforeend');

render(siteMainElement, createSiteMenuTemplate(), 'beforeend');

render(siteMainElement, filmListWrap(), 'beforeend');
const filmCardContainers = document.querySelectorAll('.films-list__container');

for (let i = 0; i < CARDS_MAX_COUNT; i++) {
  render(filmCardContainers[0], createFilmCard(films[i]), 'beforeend');
}

for (let i = 0; i < CARDS_MIN_COUNT; i++) {
  render(filmCardContainers[1], createFilmCard(films[i]), 'beforeend');
  render(filmCardContainers[2], createFilmCard(films[i]), 'beforeend');
}


render(siteMainElement, createShowMoreButton(), 'beforeend');


// Почему нужен цикл? и почему так createPopUp(popups) - не работает?
for (let i = 0; i < 1; i++) {
  render(siteMainElement, createPopUp(popups[i]), 'beforeend');
}

render(siteFooterElement, createFooterStatistic(), 'beforeend');
