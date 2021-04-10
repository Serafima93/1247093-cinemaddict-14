import { createSiteMenuTemplate } from './view/menu.js';
import { UserProfileView } from './view/user.js';
import { createFilmListWrap} from './view/film-list-section';

import { createFilmCard } from './view/film-card.js';
import { createShowMoreButton } from './view/button-show-more.js';
import { createPopUp } from './view/pop-up-information.js';
import { createFooterStatistic } from './view/footer.js';

// моки
import { generateFilm } from './mock/film.js';

import { renderTemplate, renderElement, RenderPosition } from './utils.js';

const FILMS_MAX_COUNT = 20;
const FILMS_MIN_COUNT = 2;
const FILM_COUNT_PER_STEP = 5;

const films = new Array(FILMS_MAX_COUNT).fill().map(generateFilm);


const siteUserElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer__statistics');

// создание юзера

renderElement(siteUserElement, new UserProfileView().getElement(), RenderPosition.BEFOREEND);


// создание меню

const favoritFilm = films.filter((film) => film.isFavorit).length;
const watchedFilm = films.filter((film) => film.isWatched).length;
const futureFilm = films.filter((film) => film.futureFilm).length;


/* функция для самых рейтинговых фильмов  */

const rateFilm = films.slice().sort((a, b) => b.rating - a.rating);

/* самые коментированные фильмы */

const commentsFilm = films.slice().sort((a, b) => b.comments.length - a.comments.length);


renderTemplate(siteMainElement, createSiteMenuTemplate(favoritFilm, watchedFilm, futureFilm));

// создание списка фильмов

renderTemplate(siteMainElement, createFilmListWrap());

const filmCardContainers = document.querySelectorAll('.films-list__container');

for (let i = 0; i < Math.min(films.length, FILM_COUNT_PER_STEP); i++) {
  renderTemplate(filmCardContainers[0], createFilmCard(films[i]));
}

// кнопка
if (films.length > FILM_COUNT_PER_STEP) {

  let renderedFilmCount = FILM_COUNT_PER_STEP;

  const buttonPlace = siteMainElement.querySelector('.films-list');

  renderTemplate(buttonPlace, createShowMoreButton());

  const showMoreButton = siteMainElement.querySelector('.films-list__show-more');

  showMoreButton.addEventListener('click', (evt) => {
    evt.preventDefault();
    films
      .slice(renderedFilmCount, renderedFilmCount + FILM_COUNT_PER_STEP)
      .forEach((film) => renderTemplate(filmCardContainers[0], createFilmCard(film)));

    renderedFilmCount += FILM_COUNT_PER_STEP;
    if (renderedFilmCount >= films.length) {
      showMoreButton.remove();
    }
  });
}

// дополнительные фильмы
for (let i = 0; i < FILMS_MIN_COUNT; i++) {
  renderTemplate(filmCardContainers[1], createFilmCard(rateFilm[i]));
  renderTemplate(filmCardContainers[2], createFilmCard(commentsFilm[i]));
}

renderTemplate(siteMainElement, createPopUp(films[0]));


// создание счетчика на футере

renderTemplate(siteFooterElement, createFooterStatistic(FILMS_MAX_COUNT));

