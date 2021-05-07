import { FilmBoard } from './presenter/filmList';
import { FooterStatisticPresenter } from './presenter/footer';
import { UserProfilePresenter } from './presenter/user';
import { generateFilm } from './mock/film.js';
import { FILMS_MAX_COUNT } from './utils/utils-constans.js';

const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer__statistics');
const siteHeaderElement = document.querySelector('.header');
const siteBodyElement = document.querySelector('body');

const films = new Array(FILMS_MAX_COUNT).fill().map(generateFilm);

const boardPresenter = new FilmBoard(siteMainElement, siteBodyElement);
boardPresenter.init(films);

const footerStatisticPresenter = new FooterStatisticPresenter(siteFooterElement);
footerStatisticPresenter.init(films.length);

const userPresenter = new UserProfilePresenter(siteHeaderElement);
userPresenter.init();
