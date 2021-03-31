import {createSiteMenuTemplate} from './view/menu.js';
import {createUser} from './view/user.js';
import {createFilmCard} from './view/film-card.js';
import {createShowMoreButton} from './view/button-show-more.js';
import {createPopUp} from './view/pop-up-information.js';


const CARDS_COUNT = 5;

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

// добавляю юзера
const siteUserElement = document.querySelector('.header');
render(siteUserElement, createUser(), 'beforeend');

// добавляю меню
const siteMainElement = document.querySelector('.main');
render(siteMainElement, createSiteMenuTemplate(), 'beforeend');

// добавляю карточку

for (let i = 0; i < CARDS_COUNT; i++) {
  const siteMainElement = document.querySelector('.main');
  render(siteMainElement, createFilmCard(), 'beforeend');
}

// добавляю кнопку
render(siteMainElement, createShowMoreButton(), 'beforeend');

//поп-ап
render(siteMainElement, createPopUp(), 'beforeend');


