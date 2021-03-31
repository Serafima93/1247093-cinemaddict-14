import {createSiteMenuTemplate} from './view/menu.js';
import {createUser} from './view/user.js';
import {filmListWrap, createFilmCard} from './view/film-card.js';
import {createShowMoreButton} from './view/button-show-more.js';
import {createPopUp} from './view/pop-up-information.js';
import {createFooterStatistic} from './view/footer.js';


const CARDS_MAX_COUNT = 5;
// const CARDS_MIN_COUNT = 2;

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};
const siteUserElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer__statistics');


// добавляю юзера
render(siteUserElement, createUser(), 'beforeend');

// добавляю меню
render(siteMainElement, createSiteMenuTemplate(), 'beforeend');

// добавляю карточку
render(siteUserElement, filmListWrap(), 'beforeend');
for (let i = 0; i < CARDS_MAX_COUNT; i++) {
  render(siteMainElement, createFilmCard(), 'beforeend');
}

// добавляю кнопку
render(siteMainElement, createShowMoreButton(), 'beforeend');

//поп-ап
render(siteMainElement, createPopUp(), 'beforeend');

// статистика из футера
render(siteFooterElement, createFooterStatistic(), 'beforeend');
