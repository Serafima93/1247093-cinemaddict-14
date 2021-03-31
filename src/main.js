import {createSiteMenuTemplate} from './view/menu.js';
import {createUser} from './view/user.js';


const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

// добавляю юзера
const siteUserElement = document.querySelector('.header');
render(siteUserElement, createUser(), 'beforeend');

// добавляю меню
const siteMainElement = document.querySelector('.main');
render(siteMainElement, createSiteMenuTemplate(), 'beforeend');
