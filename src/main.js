import { FilmBoard } from './presenter/filmList';
import { FooterStatisticPresenter } from './presenter/footer';
import { UserProfilePresenter } from './presenter/user';
import { MenuPresenter } from './presenter/menu.js';

import { generateFilm } from './mock/film.js';
import { FILMS_MAX_COUNT } from './utils/utils-constans.js';

import { Films } from './model/films.js';
import { Filter } from './model/filter.js';
import { Comments } from './model/comments.js';

const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer__statistics');
const siteHeaderElement = document.querySelector('.header');
const siteBodyElement = document.querySelector('body');

const films = new Array(FILMS_MAX_COUNT).fill().map(generateFilm);

// начало работы с моделью
const filmsModel = new Films();
filmsModel.setFilms(films);

const filterModel = new Filter();
const commentsModel = new Comments();

// films.forEach((film) => film.comments);
//Правильно ли я передаю? может надо только значение комментов?Или это внутри презентера?

const boardPresenter = new FilmBoard(siteMainElement, siteBodyElement, filmsModel, filterModel, commentsModel);
boardPresenter.init();

const menuPresenter =  new MenuPresenter(siteMainElement, filmsModel, filterModel);
menuPresenter.init();

const footerStatisticPresenter = new FooterStatisticPresenter(siteFooterElement);
footerStatisticPresenter.init(films.length);

const userPresenter = new UserProfilePresenter(siteHeaderElement);
userPresenter.init();
