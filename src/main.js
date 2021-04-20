import { UserProfile } from './view/user.js';
import { FooterStatistic } from './view/footer.js';
import { render } from './utils/utils-render.js';
import { FilmBoard } from './presenter/MovieList';
/* моки */
import { generateFilm } from './mock/film.js';

const FILMS_MAX_COUNT = 20;

const films = new Array(FILMS_MAX_COUNT).fill().map(generateFilm);

const siteUserElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer__statistics');

/* создание юзера */
render(siteUserElement, new UserProfile());

const boardPresenter = new FilmBoard(siteMainElement);

boardPresenter.init(films);
/* создание счетчика на футере */
render(siteFooterElement, new FooterStatistic(FILMS_MAX_COUNT));

