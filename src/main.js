import { createSiteMenuTemplate } from './view/menu.js';
import { createUser } from './view/user.js';
import { filmListWrap, createFilmCard } from './view/film-card.js';
import { createShowMoreButton } from './view/button-show-more.js';
import { createPopUp } from './view/pop-up-information.js';
import { createFooterStatistic } from './view/footer.js';

// моки
import { generateFilm } from './mock/film.js';


const FILMS_MAX_COUNT = 20;
const FILMS_MIN_COUNT = 2;
const FILM_COUNT_PER_STEP = 5;

const films = new Array(FILMS_MAX_COUNT).fill().map(generateFilm);


// создание функции рендеринга
const render = (container, template, place = 'beforeend') => {
  container.insertAdjacentHTML(place, template);
};

const siteUserElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer__statistics');

// создание юзера

render(siteUserElement, createUser());

// создание меню

const favoritFilm = films.filter((film) => film.isFavorit).length;
const watchedFilm = films.filter((film) => film.isWatched).length;
const futureFilm = films.filter((film) => film.futureFilm).length;


/* функция для самых рейтинговых фильмов  */

const rateFilm = films.slice().sort((a, b) => b.rating - a.rating);

/* самые коментированные фильмы */

const commentsFilm = films.slice().sort((a, b) => b.comments.length - a.comments.length);


render(siteMainElement, createSiteMenuTemplate(favoritFilm, watchedFilm, futureFilm));

// создание списка фильмов

render(siteMainElement, filmListWrap());

const filmCardContainers = document.querySelectorAll('.films-list__container');

for (let i = 0; i < Math.min(films.length, FILM_COUNT_PER_STEP); i++) {
  render(filmCardContainers[0], createFilmCard(films[i]));
}

// кнопка
if (films.length > FILM_COUNT_PER_STEP) {

  let renderedFilmCount = FILM_COUNT_PER_STEP;

  const buttonPlace = siteMainElement.querySelector('.films-list');
  render(buttonPlace, createShowMoreButton());
  const showMoreButton = siteMainElement.querySelector('.films-list__show-more');

  showMoreButton.addEventListener('click', (evt) => {
    evt.preventDefault();
    films
      .slice(renderedFilmCount, renderedFilmCount + FILM_COUNT_PER_STEP)
      .forEach((film) => render(filmCardContainers[0], createFilmCard(film)));

    renderedFilmCount += FILM_COUNT_PER_STEP;
    if (renderedFilmCount >= films.length) {
      showMoreButton.remove();
    }
  });
}

// дополнительные фильмы
for (let i = 0; i < FILMS_MIN_COUNT; i++) {
  render(filmCardContainers[1], createFilmCard(rateFilm[i]));
  render(filmCardContainers[2], createFilmCard(commentsFilm[i]));
}

render(siteMainElement, createPopUp(films[0]));


// создание счетчика на футере

render(siteFooterElement, createFooterStatistic(FILMS_MAX_COUNT));

