import { FilmBoard } from './presenter/movieList';
import { generateFilm } from './mock/film.js';
import { FILMS_MAX_COUNT } from './utils/utils-constans.js';


const films = new Array(FILMS_MAX_COUNT).fill().map(generateFilm);

const siteMainElement = document.querySelector('.main');

const boardPresenter = new FilmBoard(siteMainElement);
boardPresenter.init(films);

