import { FilmBoard } from './presenter/MovieList';
import { generateFilm } from './mock/film.js';

const FILMS_MAX_COUNT = 20;

const films = new Array(FILMS_MAX_COUNT).fill().map(generateFilm);

const siteMainElement = document.querySelector('.main');

const boardPresenter = new FilmBoard(siteMainElement);
boardPresenter.init(films);

