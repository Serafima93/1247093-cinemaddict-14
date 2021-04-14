import { SiteMenu } from './view/menu.js';
import { UserProfile } from './view/user.js';
import { FilmList } from './view/film-list-section';
import { FilmCard } from './view/film-card.js';
import { ShowMoreButton } from './view/button-show-more.js';
import { PopUp } from './view/pop-up-information.js';
import { FooterStatistic } from './view/footer.js';
import { render } from './utils.js';
import { EmptyWrap } from './view/empty';

/* моки */
import { generateFilm } from './mock/film.js';

const FILMS_MAX_COUNT = 20;
const FILMS_MIN_COUNT = 2;
const FILM_COUNT_PER_STEP = 5;

const films = new Array(FILMS_MAX_COUNT).fill().map(generateFilm);

const siteBodyElement = document.querySelector('body');
const siteUserElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer__statistics');


/* создание юзера */
render(siteUserElement, new UserProfile().getElement());

/* создание меню */
const favoritFilm = films.filter((film) => film.isFavorit).length;
const watchedFilm = films.filter((film) => film.isWatched).length;
const futureFilm = films.filter((film) => film.futureFilm).length;


/* функция для самых рейтинговых фильмов  */
const rateFilm = films.slice().sort((a, b) => b.rating - a.rating);

/* самые коментированные фильмы */
const commentsFilm = films.slice().sort((a, b) => b.comments.length - a.comments.length);

/* меню фильмы */
render(siteMainElement, new SiteMenu(favoritFilm, watchedFilm, futureFilm).getElement());
/* создание счетчика на футере */
render(siteFooterElement, new FooterStatistic(FILMS_MAX_COUNT).getElement());

/* создание списка фильмов */
if (FILMS_MAX_COUNT === 0) {
  render(siteMainElement, new EmptyWrap().getElement());
  const filmRemove = document.querySelector('.sort');
  filmRemove.classList.add('visually-hidden');

} else {
  render(siteMainElement, new FilmList().getElement());
}


const filmCardContainers = document.querySelectorAll('.films-list__container');

/* поп-ап */

const makePopUp = (film) => {
  const popupElement = new PopUp(film);

  siteBodyElement.appendChild(popupElement.getElement());
  const popupPlace = siteBodyElement.querySelector('.film-details__top-container');
  popupPlace.classList.add('hide-overflow');

  const closeButton = popupElement.getElement().querySelector('.film-details__close-btn');

  const removePopup = () => {
    siteBodyElement.removeChild(popupElement.getElement());
    popupPlace.classList.remove('hide-overflow');
  };

  const onClickCloseButton = (evt) => {
    evt.preventDefault();
    removePopup();

    closeButton.removeEventListener('click', onClickCloseButton);
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      removePopup();

      document.removeEventListener('keydown', onEscKeyDown);
    }
  };

  closeButton.addEventListener('click', onClickCloseButton);
  document.addEventListener('keydown', onEscKeyDown);
};


const addListenersOnFilm = (filmComponent, film) => {
  const popupPoster = filmComponent.querySelector('.film-card__poster');
  const popupTitle = filmComponent.querySelector('.film-card__title');
  const popupComment = filmComponent.querySelector('.film-card__comments');

  popupPoster.addEventListener('click', () => {
    makePopUp(film);
  });
  popupTitle.addEventListener('click', () => {
    makePopUp(film);
  });
  popupComment.addEventListener('click', () => {
    makePopUp(film);
  });
};


for (let i = 0; i < Math.min(films.length, FILM_COUNT_PER_STEP); i++) {
  const film = new FilmCard(films[i]);
  render(filmCardContainers[0], film.getElement());
  addListenersOnFilm(film.getElement(), films[i]);
}

/* кнопка */

if (films.length > FILM_COUNT_PER_STEP) {
  let renderedFilmCount = FILM_COUNT_PER_STEP;
  const buttonPlace = siteMainElement.querySelector('.films-list');
  render(buttonPlace, new ShowMoreButton().getElement());

  const showMoreButton = siteMainElement.querySelector('.films-list__show-more');

  showMoreButton.addEventListener('click', (evt) => {
    evt.preventDefault();
    films
      .slice(renderedFilmCount, renderedFilmCount + FILM_COUNT_PER_STEP)
      .forEach((film) => {
        const newFilm = new FilmCard(film);
        render(filmCardContainers[0], newFilm.getElement());
        addListenersOnFilm(newFilm.getElement(), film);
      });
    renderedFilmCount += FILM_COUNT_PER_STEP;
    if (renderedFilmCount >= films.length) {
      showMoreButton.remove();
    }
  });
}

/* дополнительные фильмы */

for (let i = 0; i < FILMS_MIN_COUNT; i++) {
  const filmRate = new FilmCard(rateFilm[i]);
  const filmComments = new FilmCard(commentsFilm[i]);

  render(filmCardContainers[1], filmRate.getElement());
  render(filmCardContainers[2], filmComments.getElement());

  addListenersOnFilm(filmRate.getElement(), rateFilm[i]);
  addListenersOnFilm(filmComments.getElement(), commentsFilm[i]);
}

