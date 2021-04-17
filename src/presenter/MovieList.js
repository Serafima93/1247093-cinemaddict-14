import { SiteMenu } from '../view/menu.js';
import { FilmList } from '../view/film-list-section';
import { EmptyWrap } from '../view/empty';

import { FilmCard } from '../view/film-card.js';
import { ShowMoreButton } from '../view/button-show-more.js';
import { PopUp } from '../view/pop-up-information.js';
import { render, replaceChild, remove } from '../utils/utils-render.js';

const FILMS_MAX_COUNT = 20;
const FILMS_MIN_COUNT = 2;
const FILM_COUNT_PER_STEP = 5;


class FilmBoard {
  constructor(boardContainer) {
    this._boardContainer = boardContainer;

    // то что не меняется?
    this._boardComponent = new FilmList(); // главный контейнер
    // this._sortComponent = new Sort(); - надо создать
    this._noFilmsComponent = new EmptyWrap();
  }

  init(films) {
    this._films = films.slice();

    // в классе рисуем контейнер или как?
    // render(this._boardContainer, this._boardComponent);

    this._renderFilmBoard();
  }

  _renderSort() {
    // Метод для рендеринга сортировки
  }

  _renderMenu() {
    const favoritFilm = this._films.filter((film) => film.isFavorit).length;
    const watchedFilm = this._films.filter((film) => film.isWatched).length;
    const futureFilm = this._films.filter((film) => film.futureFilm).length;

    render(this._boardContainer, new SiteMenu(favoritFilm, watchedFilm, futureFilm));
  }

  _renderPopUp(film) {
    const popupElement = new PopUp(film);

    replaceChild(this._boardContainer, popupElement, true);

    const popupPlace = this._boardContainer.querySelector('.film-details__top-container');
    popupPlace.classList.add('hide-overflow');

    const removePopup = () => {
      replaceChild(this._boardContainer, popupElement, false);
      popupPlace.classList.remove('hide-overflow');
    };

    const onEscKeyDown = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        removePopup();
        document.removeEventListener('keydown', onEscKeyDown);
      }
    };

    popupElement.setEditClickHandler(() => {
      removePopup();
    });
    document.addEventListener('keydown', onEscKeyDown);
  }

  _renderFilmListner(film, filmPopUp) {
    film.setEditClickHandler(() => {
      this._renderPopUp(filmPopUp);
    });
  }

  _renderFilms() {
    const filmCardContainers = document.querySelectorAll('.films-list__container');

    // Метод для рендеринга N-фильмов за раз
    for (let i = 0; i < Math.min(this._films.length, FILM_COUNT_PER_STEP); i++) {
      const film = new FilmCard(this._films[i]);
      render(filmCardContainers[0], film); // что делать вот с такими кусками кода?
      this._renderFilmListner(film, this._films[i]);
    }
  }

  _renderNoFilms() {
    render(this._boardContainer, this._noFilmsComponent);
  }

  _renderLoadMoreButton() {
    const filmCardContainers = document.querySelectorAll('.films-list__container');

    const buttonPlace = this._boardContainer.querySelector('.films-list');

    let renderedFilmCount = FILM_COUNT_PER_STEP;
    const loadMoreButtonComponent = new ShowMoreButton();
    render(buttonPlace, loadMoreButtonComponent);

    loadMoreButtonComponent.setClickHandler(() => {
      this._films
        .slice(renderedFilmCount, renderedFilmCount + FILM_COUNT_PER_STEP)
        .forEach((film) => {
          const newFilm = new FilmCard(film);
          render(filmCardContainers[0], newFilm);
          this._renderFilmListner(newFilm, film);
        });
      renderedFilmCount += FILM_COUNT_PER_STEP;
      if (renderedFilmCount >= this._films.length) {
        remove(loadMoreButtonComponent);
      }
    });
  }

  _renderFilmList() {
    this._renderFilms();

    if (this._films.length > FILM_COUNT_PER_STEP) {
      this._renderLoadMoreButton();
    }
  }

  _renderFilmAdditionalList() {
    const filmCardContainers = document.querySelectorAll('.films-list__container');
    /* функция для самых рейтинговых фильмов  */

    const rateFilm = this._films.slice().sort((a, b) => b.rating - a.rating);

    /* самые коментированные фильмы */
    const commentsFilm = this._films.slice().sort((a, b) => b.comments.length - a.comments.length);

    for (let i = 0; i < FILMS_MIN_COUNT; i++) {
      const filmRate = new FilmCard(rateFilm[i]);
      const filmComments = new FilmCard(commentsFilm[i]);

      render(filmCardContainers[1], filmRate);
      render(filmCardContainers[2], filmComments);
      this._renderFilmListner(filmRate, rateFilm[i]);
      this._renderFilmListner(filmComments, commentsFilm[i]);
    }
  }

  _renderFilmBoard() {
    this._renderMenu(); // запуск меню. Тут передается постоянно с полными данными

    if (FILMS_MAX_COUNT === 0) {
      this._renderNoFilms();
      const filmRemove = document.querySelector('.sort');
      filmRemove.classList.add('visually-hidden');

    } else {
      this._renderSort(); // запускаем несделанную пока сортировку
      render(this._boardContainer, this._boardComponent); // отрисовываем сам контейнер new FilmList()
    }
    this._renderFilmList();
    this._renderFilmAdditionalList();

  }
}
export { FilmBoard };
