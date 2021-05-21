import FilmBoard from './presenter/film-list';
import FooterStatisticPresenter from './presenter/footer';
import UserProfilePresenter from './presenter/user';
import MenuPresenter from './presenter/menu.js';
import { UpdateType } from './utils/constans.js';


// import { generateFilm } from './mock/film.js';
// import { FILMS_MAX_COUNT } from './utils/constans.js';
import Films from './model/films.js';
import Filter from './model/filter.js';
import Api from './api.js';

const AUTHORIZATION = 'Basic hS2sd3dfSwcl1sa2j2sima93';
const END_POINT = 'https://14.ecmascript.pages.academy/cinemaddict';

const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer__statistics');
const siteHeaderElement = document.querySelector('.header');
const siteBodyElement = document.querySelector('body');

// const films = new Array(FILMS_MAX_COUNT).fill().map(generateFilm);
const api = new Api(END_POINT, AUTHORIZATION);

const filmsModel = new Films();
const filterModel = new Filter();


// filmsModel.setData(films);

const boardPresenter = new FilmBoard(siteMainElement, siteBodyElement, filmsModel, filterModel, api);
const userPresenter = new UserProfilePresenter(siteHeaderElement);
const footerStatisticPresenter = new FooterStatisticPresenter(siteFooterElement);

boardPresenter.init();
userPresenter.init();


api.getFilms()
  .then((films) => {
    filmsModel.setData(UpdateType.INIT, films);
    const menuPresenter = new MenuPresenter(siteMainElement, filmsModel, filterModel);
    menuPresenter.init();
    footerStatisticPresenter.init(films.length);
  })
  .catch(() => {
    filmsModel.setData(UpdateType.INIT, []);
  });
