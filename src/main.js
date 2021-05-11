import { FilmBoard } from './presenter/filmList';
import { FooterStatisticPresenter } from './presenter/footer';
import { UserProfilePresenter } from './presenter/user';
import { generateFilm } from './mock/film.js';
import { FILMS_MAX_COUNT } from './utils/utils-constans.js';

import { Films } from './model/movies.js';
import { Filter } from './model/filter.js';
import { Comments } from './model/comments.js';

const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer__statistics');
const siteHeaderElement = document.querySelector('.header');
const siteBodyElement = document.querySelector('body');

const films = new Array(FILMS_MAX_COUNT).fill().map(generateFilm);

// начало работы с моделью для презентера
const filmsModel = new Films();
filmsModel.setFilms(films);

const filterModel = new Filter();
const commentsModel = new Comments();
//Правильно ли я передаю?

const boardPresenter = new FilmBoard(siteMainElement, siteBodyElement, filmsModel, filterModel, commentsModel);
boardPresenter.init();

const footerStatisticPresenter = new FooterStatisticPresenter(siteFooterElement);
footerStatisticPresenter.init(films.length);

const userPresenter = new UserProfilePresenter(siteHeaderElement);
userPresenter.init();
