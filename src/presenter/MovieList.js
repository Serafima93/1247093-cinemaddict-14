import { FilmList } from '../view/film-list-section';
import { EmptyWrap } from '../view/empty';
import { Sort } from '../view/sort';
import { FilmCard } from '../view/film-card.js';
import { ShowMoreButton } from '../view/button-show-more.js';
import { PopUp } from '../view/pop-up-information.js';
/*

 */
import { render, emersion, remove } from '../utils/utils-render.js';
import { FILMS_EXTRA_SECTION, FILM_COUNT_PER_STEP } from '../utils/utils-constans.js';

// import { updateItem } from '../utils/utils-common.js';
/*

 */
import { FooterStatisticPresenter } from './footer.js';
import { UserProfilePresenter } from './user.js';
import { MenuPresenter } from './menu.js';


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

    this._renderPopUp = this._renderPopUp.bind(this);
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    // this._handleModeChange = this._handleModeChange.bind(this);

    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
    this._watchedClickHandler = this._watchedClickHandler.bind(this);
    this._futureClickHandler = this._futureClickHandler.bind(this);
    this._handleCloseButtonClick = this._handleCloseButtonClick.bind(this);

    this._mode = Mode.DEFAULT;
    this._popupComponent = null;

    this._SiteMenuPresenter = new MenuPresenter(this._boardContainer);
  }

  init(films) {
    this._films = films;

    this._filmView = {};
    this._renderFilmBoard();
  }

  _renderFilmBoard() {
    this._renderUserPresenter();
    this._SiteMenuPresenter.init(this._films);

    if (this._films.length) {
      this._renderContainers();
      this._filmsSorting();
    } else {
      this._renderNoFilms();
    }
    this._renderFooterStatisticPresenter(this._films.length);
  }

  _renderContainers() {
    render(this._boardContainer, this._sortComponents); // отрисовка поля для послд. выбора сортировки фильмов
    render(this._boardContainer, this._filmListComponent); // отрисовываем сам контейнер new FilmList()
    this._renderFilmList(this._films);
    // this._renderFilmAdditionalList(this._films);
  }

  _renderFilmList(films) {
    this._renderFilmsMain(films);

    if (this._films.length > FILM_COUNT_PER_STEP) {
      this._renderLoadMoreButton(films);
    }
  }

  _renderFilmsMain(films) {
    const filmCardContainers = this._boardContainer.querySelector('.films-list__container--main');
    this._renderFilms(filmCardContainers, films.slice(0, this._renderedFilmCount));
  }

  _renderFilm(container, film) {
    const filmView = new FilmCard(film);
    render(container, filmView);
    filmView.setEditClickHandler(this._renderPopUp);

    filmView.setFavoriteClickHandler(this._favoriteClickHandler);
    filmView.setWatchedClickHandler(this._watchedClickHandler);
    filmView.setFutureClickHandler(this._futureClickHandler);
    this._filmView[film.id] = filmView;
  }

  _renderFilms(container, films) {
    for (let i = 0; i < films.length; i++) {
      const film = films[i];
      this._renderFilm(container, film);
    }
  }

  _clearFilmList() {
    Object
      .values(this._filmView)
      .forEach((presenter) => remove(presenter));
    remove(this._loadMoreButtonComponent);
  }
  /*

   */

  _favoriteClickHandler(film) {
    const oldFilm = this._films.find((item) => item.id === film.id);
    oldFilm.isFavorit = !film.isFavorit;

    const index = this._films.indexOf(film);
    if (index !== -1) {
      this._films[index] = oldFilm;
    }
    this._SiteMenuPresenter.update(this._films);

  }

  _watchedClickHandler(film) {
    const oldFilm = this._films.find((item) => item.id === film.id);
    oldFilm.isWatched = !film.isWatched;

    const index = this._films.indexOf(film);
    if (index !== -1) {
      this._films[index] = oldFilm;
    }
    this._SiteMenuPresenter.update(this._films);
  }

  _futureClickHandler(film) {
    const oldFilm = this._films.find((item) => item.id === film.id);
    oldFilm.futureFilm = !film.futureFilm;

    const index = this._films.indexOf(film);
    if (index !== -1) {
      this._films[index] = oldFilm;
    }
    this._SiteMenuPresenter.update(this._films);
  }

  /*

   */
  _renderLoadMoreButton(films) {
    const buttonPlace = this._boardContainer.querySelector('.films-list');
    render(buttonPlace, this._loadMoreButtonComponent);
    this._loadMoreButtonComponent.setClickHandler(() => { this._handleLoadMoreButtonClick(films); });
  }

  _handleLoadMoreButtonClick(films) {
    const filmCardContainers = this._boardContainer.querySelector('.films-list__container--main');
    films
      .slice(this._renderedFilmCount, this._renderedFilmCount + FILM_COUNT_PER_STEP)
      .forEach((film) => {
        const newFilm = new FilmCard(film);
        render(filmCardContainers, newFilm);
        newFilm.setEditClickHandler(this._renderPopUp);
      });
    this._renderedFilmCount += FILM_COUNT_PER_STEP;
    if (this._renderedFilmCount >= this._films.length) {
      remove(this._loadMoreButtonComponent);
    }
  }
  /*

   */
  _renderPopUp(film) {
    this._mode === Mode.POPUP;

    const prevPopupComponent = this._popupComponent;
    this._popupComponent = new PopUp(film);

    this._popupComponent.setCloseBtnClickHandler(this._handleCloseButtonClick);

    this._popupComponent.setFavoritePopupClickHandler(() => { this._favoriteClickHandler(film); });
    this._popupComponent.setWatchedPopupClickHandler(() => { this._watchedClickHandler(film); });
    this._popupComponent.setFuturePopupClickHandler(() => { this._futureClickHandler(film); });

    if (prevPopupComponent === null) {
      render(bodyElement, this._popupComponent);
      bodyElement.classList.add('hide-overflow');
      document.addEventListener('keydown', this._onEscKeyDown);

      return;
    }

    if (this._mode === Mode.POPUP) {
      emersion(this._boardContainer, this._popupComponent);
      bodyElement.classList.add('hide-overflow');
      document.addEventListener('keydown', this._onEscKeyDown);
    }
  }

  _removePopup() {
    remove(this._popupComponent);
    this._popupComponent = null;
    this._mode = Mode.DEFAULT;
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

  _resetFilmView() {
    if (this._mode === Mode.POPUP) {
      this._removePopup();
      this._mode !== Mode.DEFAULT;
    }
  }

  _handleModeChange() {
    Object
      .values(this._filmView)
      .forEach((film) => film._resetFilmView());
  }
  /*

   */
  _filmRateSort() {
    this._clearFilmList();
    const newElement = this._boardContainer.querySelector('.sort__button--rate');
    this._filmModeChange(newElement);
    const rateFilm = this._films.slice().sort((a, b) => b.rating - a.rating);
    this._renderFilmList(rateFilm);
    // this._renderFilmAdditionalList(rateFilm);
  }

  _filmYearSort() {
    this._clearFilmList();
    const newElement = this._boardContainer.querySelector('.sort__button--date');
    this._filmModeChange(newElement);
    const yearFilm = this._films.slice().sort((a, b) => b.productionYear - a.productionYear);
    this._renderFilmList(yearFilm);
    // this._renderFilmAdditionalList(yearFilm);
  }

  _filmModeChange(newElement) {
    const oldElement = this._boardContainer.querySelector('.sort__button--active');
    oldElement.classList.remove('sort__button--active');
    newElement.classList.add('sort__button--active');
  }

  _filmsSorting() {
    this._sortComponents.setRatingClickHandler(() => { this._filmRateSort(); });
    this._sortComponents.setYearClickHandler(() => { this._filmYearSort(); });
  }
  /*

   */
  _renderFilmAdditionalList(films) {
    const filmCardContainerMostRate = this._boardContainer.querySelector('.films-list__container--rating');
    const filmCardContainerMostComments = this._boardContainer.querySelector('.films-list__container--comments');

    /* функция для самых рейтинговых и коментированных фильмов  */
    const rateFilm = films.slice().sort((a, b) => b.rating - a.rating);
    const commentsFilm = films.slice().sort((a, b) => b.comments.length - a.comments.length);

    this._renderFilms(filmCardContainerMostRate, rateFilm.slice(0, FILMS_EXTRA_SECTION));
    this._renderFilms(filmCardContainerMostComments, commentsFilm.slice(0, FILMS_EXTRA_SECTION));
  }

  _renderNoFilms() {
    render(this._boardContainer, this._noFilmsComponent);
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
