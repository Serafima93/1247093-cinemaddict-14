import { FilmList } from '../view/film-list-section';
import { EmptyWrap } from '../view/empty';
import { Sort } from '../view/sort';
import { FilmCard } from '../view/film-card.js';
import { ShowMoreButton } from '../view/button-show-more.js';
import { PopUp } from '../view/pop-up-information.js';

import { render, replaceChild, remove } from '../utils/utils-render.js';
// import { updateItem } from '../utils/utils-common.js';

import { FooterStatisticPresenter } from '../presenter/footer.js';
import { UserProfilePresenter } from '../presenter/user.js';
import { MenuProfilePresenter } from '../presenter/menu.js';


const FILMS_MAX_COUNT = 20;
const FILMS_MIN_COUNT = 2;
const FILM_COUNT_PER_STEP = 5;
const siteFooterElement = document.querySelector('.footer__statistics');
const siteHeaderElement = document.querySelector('.header');
const bodyElement = document.querySelector('body');


const Mode = {
  DEFAULT: 'DEFAULT',
  POPUP: 'POPUP',
};


class FilmBoard {
  constructor(boardContainer) {
    this._boardContainer = boardContainer;
    this._renderedFilmCount = FILM_COUNT_PER_STEP;

    this._filmListComponent = new FilmList();
    this._noFilmsComponent = new EmptyWrap();
    this._sortComponents = new Sort();
    this._loadMoreButtonComponent = new ShowMoreButton();

    this._handleLoadMoreButtonClick = this._handleLoadMoreButtonClick.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);

    this._mode = Mode.DEFAULT;
    this._popupComponent = null;
  }

  init(films) {
    this._films = films.slice();

    this._filmPresenter = {};
    this._renderFilmBoard();
  }

  _renderFilmBoard() {

    if (FILMS_MAX_COUNT === 0) {
      this._renderSiteMenuPresenter(0, 0, 0);
      this._renderNoFilms();
      this._renderFooterStatisticPresenter(FILMS_MAX_COUNT);

    } else {
      this._renderMenu(this._films);
      this._renderContainers();
    }

  }

  _renderContainers() {
    this._renderUserPresenter();
    render(this._boardContainer, this._sortComponents); // сортировка фильмов
    render(this._boardContainer, this._filmListComponent); // отрисовываем сам контейнер new FilmList()
    this._renderFilmList();
    this._renderFilmAdditionalList();
    this._renderFooterStatisticPresenter(FILMS_MAX_COUNT);
  }

  _renderLoadMoreButton() {
    const buttonPlace = this._boardContainer.querySelector('.films-list');
    render(buttonPlace, this._loadMoreButtonComponent);
    this._loadMoreButtonComponent.setClickHandler(this._handleLoadMoreButtonClick);
  }

  _handleLoadMoreButtonClick() {
    const filmCardContainers = this._boardContainer.querySelector('#main-container');
    this._films
      .slice(this._renderedFilmCount, this._renderedFilmCount + FILM_COUNT_PER_STEP)
      .forEach((film) => {
        const newFilm = new FilmCard(film);
        render(filmCardContainers, newFilm);
        this._renderFilmListner(newFilm, film);

        this._buttonsClickHandler(newFilm);
      });
    this._renderedFilmCount += FILM_COUNT_PER_STEP;
    if (this._renderedFilmCount >= this._films.length) {
      remove(this._loadMoreButtonComponent);
    }
  }

  _renderPopUp(film) {
    this._mode === Mode.POPUP;

    const prevPopupComponent = this._popupComponent;
    this._popupComponent = new PopUp(film);

    // const onEscKeyDown = (evt) => {
    //   if (evt.key === 'Escape' || evt.key === 'Esc') {
    //     evt.preventDefault();
    //     this._removePopup();
    //     document.removeEventListener('keydown', onEscKeyDown);
    //   }
    // };

    this._popupComponent.setCloseBtnClickHandler(() => {
      this._handleCloseButtonClick();
    });

    if (prevPopupComponent === null) {
      render(bodyElement, this._popupComponent);
      bodyElement.classList.add('hide-overflow');
      document.addEventListener('keydown', this._onEscKeyDown);

      return;
    }

    if (this._mode === Mode.POPUP) {
      replaceChild(this._boardContainer, this._popupComponent, true);
      bodyElement.classList.add('hide-overflow');
      document.addEventListener('keydown', this._onEscKeyDown);
    }
  }

  _removePopup() {
    // if (this._mode !== Mode.DEFAULT) {
    this._popupComponent.getElement().remove();
    this._popupComponent = null;
    this._mode = Mode.DEFAULT;
    // }
  }

  _onEscKeyDown(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._removePopup();
      bodyElement.classList.remove('hide-overflow');

      document.removeEventListener('keydown', this._onEscKeyDown);
    }
  }

  _handleCloseButtonClick() {
    this._removePopup();
    bodyElement.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this._onEscKeyDown);
  }

  _handleModeChange() {
    Object
      .values(this._films)
      .forEach((film) => film._removePopup());
  }

  _renderFilms(container, films, count) {
    for (let i = 0; i < films.slice(0, count).length; i++) {
      const filmView = new FilmCard(films[i]);
      render(container, filmView);
      this._renderFilmListner(filmView, films[i]);
      this._buttonsClickHandler(filmView);
    }
  }
  /*Мне нужно передать данные из вью в презентер, и тот должен изменить моки
  Узнаем фильм по id - по нажатию на кнопку (пр. фаворит) - получаем его. Но что потом?
Карточка должна сообщить что она была нажата и что надо пребавить к списку вверху фильм?
Или же мы нажатой карточке ставим флаг - тру в позиции фейфорит и перерисовываем весь список?
если так, то нам нужно написать - если позиция меняется, то тогда все карточки перерисовываются
(только данные - не новый вызов функции) - для этого их надо стереть и рисуются заново?
  */

  _renderFilmsMain() {
    const filmCardContainers = this._boardContainer.querySelector('#main-container');
    this._renderFilms(filmCardContainers, this._films, FILM_COUNT_PER_STEP);
    // this._filmPresenter[film.id] = filmPresenter;
  }

  _renderFilmList() {
    this._renderFilmsMain();

    if (this._films.length > FILM_COUNT_PER_STEP) {
      this._renderLoadMoreButton();
    }
  }

  _renderFilmListner(film, filmPopUp) {
    film.setEditClickHandler(() => {
      this._renderPopUp(filmPopUp);
    });
  }

  _buttonsClickHandler(filmView) {
    filmView.favoriteClickHandler(() => {
      // const filmIdHistoryNumber = filmView._film.id;
      filmView._film.isFavorit = true; // создаю на фильме флаг - верно
    });
  }


  _favoriteClickHandler() {
    Object.assign({}, this._films, { isFavorit: !this._films.isFavorit });
  }

  _clearTaskList() { // мне нужно вызвать его в начале цикла следующего метода при клике?
    Object
      .values(this._filmListComponent)
      .forEach((presenter) => presenter.remove(this._filmListComponent));
    this._filmPresenter = {};
    this._renderedFilmCount = FILM_COUNT_PER_STEP;
    remove(this._loadMoreButtonComponent);
  }


  _renderFilmAdditionalList() {

    const filmCardContainerMostRate = this._boardContainer.querySelector('#rating');
    const filmCardContainerMostComments = this._boardContainer.querySelector('#comments');

    /* функция для самых рейтинговых фильмов  */
    const rateFilm = this._films.slice().sort((a, b) => b.rating - a.rating);
    /* самые коментированные фильмы */
    const commentsFilm = this._films.slice().sort((a, b) => b.comments.length - a.comments.length);

    this._renderFilms(filmCardContainerMostRate, rateFilm, FILMS_MIN_COUNT);
    this._renderFilms(filmCardContainerMostComments, commentsFilm, FILMS_MIN_COUNT);
  }

  _renderNoFilms() {
    render(this._boardContainer, this._noFilmsComponent);
  }

  _renderMenu(films) {
    const favoritFilm = films.filter((film) => film.isFavorit).length;
    const watchedFilm = films.filter((film) => film.isWatched).length;
    const futureFilm = films.filter((film) => film.futureFilm).length;

    this._renderSiteMenuPresenter(favoritFilm, watchedFilm, futureFilm);
  }

  _renderSiteMenuPresenter(favoritFilm, watchedFilm, futureFilm) {
    const SiteMenuPresenter = new MenuProfilePresenter(this._boardContainer);
    SiteMenuPresenter.init(favoritFilm, watchedFilm, futureFilm);
  }

  _renderUserPresenter() {
    const userPresenter = new UserProfilePresenter(siteHeaderElement);
    userPresenter.init();
  }

  _renderFooterStatisticPresenter(totalFilms) {
    const footerStatisticPresenter = new FooterStatisticPresenter(siteFooterElement);
    footerStatisticPresenter.init(totalFilms);
  }
}
export { FilmBoard };
