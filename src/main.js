import { SiteMenu } from './view/menu.js';
import { UserProfile } from './view/user.js';
import { FilmList } from './view/film-list-section';
import { FilmCard } from './view/film-card.js';
import { ShowMoreButton } from './view/button-show-more.js';
import { PopUp } from './view/pop-up-information.js';
import { FooterStatistic } from './view/footer.js';
import { renderElement, RenderPosition } from './utils.js';
import { EmptyWrap } from './view/empty';

/* моки */
import { generateFilm } from './mock/film.js';

const FILMS_MAX_COUNT = 20;
const FILMS_MIN_COUNT = 2;
const FILM_COUNT_PER_STEP = 5;

const films = new Array(FILMS_MAX_COUNT).fill().map(generateFilm);

const siteUserElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer__statistics');

/* создание юзера */
renderElement(siteUserElement, new UserProfile().getElement(), RenderPosition.BEFOREEND);

/* создание меню */
const favoritFilm = films.filter((film) => film.isFavorit).length;
const watchedFilm = films.filter((film) => film.isWatched).length;
const futureFilm = films.filter((film) => film.futureFilm).length;


/* функция для самых рейтинговых фильмов  */
const rateFilm = films.slice().sort((a, b) => b.rating - a.rating);

/* самые коментированные фильмы */
const commentsFilm = films.slice().sort((a, b) => b.comments.length - a.comments.length);

/* меню фильмы */
renderElement(siteMainElement, new SiteMenu(favoritFilm, watchedFilm, futureFilm).getElement(), RenderPosition.BEFOREEND);
/* создание счетчика на футере */
renderElement(siteFooterElement, new FooterStatistic(FILMS_MAX_COUNT).getElement(), RenderPosition.BEFOREEND);

/* создание списка фильмов */
if (FILMS_MAX_COUNT === 0) {
  renderElement(siteMainElement, new EmptyWrap().getElement(), RenderPosition.BEFOREEND);
  const filmRemove = document.querySelector('.sort');
  filmRemove.classList.add('visually-hidden');

} else {
  renderElement(siteMainElement, new FilmList().getElement(), RenderPosition.BEFOREEND);
}


const filmCardContainers = document.querySelectorAll('.films-list__container');

/* поп-ап */
const removePopup = (element1,element2) => {
  element1.getElement().remove();
  element1.removeElement();
  element2.classList.remove('visually-hidden');
};

const makePopUp = (film) => {
  const popupElement = new PopUp(film);
  renderElement(siteMainElement, popupElement.getElement(), RenderPosition.BEFOREEND);

  const popupPlace = siteMainElement.querySelector('.film-details__top-container');
  popupPlace.classList.add('visually-hidden');

  const closeButton = popupElement.getElement().querySelector('.film-details__close-btn');


  const onClickCloseButton = (evt) => {
    evt.preventDefault();
    removePopup(popupElement, popupPlace);

    closeButton.removeEventListener('click', onClickCloseButton);
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      removePopup(popupElement, popupPlace);

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
  renderElement(filmCardContainers[0], film.getElement(), RenderPosition.BEFOREEND);
  addListenersOnFilm(film.getElement(), films[i]);
}

/* кнопка */

if (films.length > FILM_COUNT_PER_STEP) {
  let renderedFilmCount = FILM_COUNT_PER_STEP;
  const buttonPlace = siteMainElement.querySelector('.films-list');
  renderElement(buttonPlace, new ShowMoreButton().getElement(), RenderPosition.BEFOREEND);

  const showMoreButton = siteMainElement.querySelector('.films-list__show-more');

  showMoreButton.addEventListener('click', (evt) => {
    evt.preventDefault();
    films
      .slice(renderedFilmCount, renderedFilmCount + FILM_COUNT_PER_STEP)
      .forEach((film) => {
        const newFilm = new FilmCard(film);
        renderElement(filmCardContainers[0], newFilm.getElement(), RenderPosition.BEFOREEND);
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

  renderElement(filmCardContainers[1], filmRate.getElement(), RenderPosition.BEFOREEND);
  renderElement(filmCardContainers[2], filmComments.getElement(), RenderPosition.BEFOREEND);

  addListenersOnFilm(filmRate.getElement(), rateFilm[i]);
  addListenersOnFilm(filmComments.getElement(), commentsFilm[i]);
}

