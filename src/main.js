import FilmBoard from './presenter/film-list';
import FooterStatisticPresenter from './presenter/footer';
import UserProfilePresenter from './presenter/user';
import MenuPresenter from './presenter/menu.js';

import { generateFilm } from './mock/film.js';
import { FILMS_MAX_COUNT } from './utils/constans.js';
import Films from './model/films.js';
import Filter from './model/filter.js';
import Api from './api.js';

const AUTHORIZATION = 'Basic hS2sd3dfSwcl1sa2j2';
const END_POINT = 'https://14.ecmascript.pages.academy/cinemaddict';


const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer__statistics');
const siteHeaderElement = document.querySelector('.header');
const siteBodyElement = document.querySelector('body');

const films = new Array(FILMS_MAX_COUNT).fill().map(generateFilm);

const filmsModel = new Films();
filmsModel.setFilms(films);

const filterModel = new Filter();

const boardPresenter = new FilmBoard(siteMainElement, siteBodyElement, filmsModel, filterModel);
boardPresenter.init();

const menuPresenter = new MenuPresenter(siteMainElement, filmsModel, filterModel);
menuPresenter.init();

const footerStatisticPresenter = new FooterStatisticPresenter(siteFooterElement);
footerStatisticPresenter.init(films.length);

const userPresenter = new UserProfilePresenter(siteHeaderElement);
userPresenter.init();

const api = new Api(END_POINT, AUTHORIZATION);

api.getFilms().then((films) => {
  console.log(films);
  // Есть проблема: cтруктура объекта похожа, но некоторые ключи называются иначе,
  // а ещё на сервере используется snake_case, а у нас camelCase.
  // Можно, конечно, переписать часть нашего клиентского приложения, но зачем?
  // Есть вариант получше - паттерн "Адаптер"
});
