import { FilmList } from '../view/film-list-section';
import { EmptyWrap } from '../view/empty';
import { Sort } from '../view/sort';
import { FilmCard } from '../view/film-card.js';
import { ShowMoreButton } from '../view/button-show-more.js';
import { PopUp } from '../view/pop-up-information.js';
import { render, emersion, remove } from '../utils/utils-render.js';
import { FILMS_EXTRA_SECTION, FILM_COUNT_PER_STEP, SortType, Mode } from '../utils/utils-constans.js';
import { MenuPresenter } from './menu.js';


class FilmBoard {
  constructor(boardContainer) {
    this._boardContainer = boardContainer;
    this._renderedFilmCount = FILM_COUNT_PER_STEP;

    this._filmListComponent = new FilmList();
    this._noFilmsComponent = new EmptyWrap();
    this._sortComponents = new Sort();
    this._loadMoreButtonComponent = new ShowMoreButton();
    this._SiteMenuPresenter = new MenuPresenter(this._boardContainer);

    this._renderPopUp = this._renderPopUp.bind(this);
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
    this._watchedClickHandler = this._watchedClickHandler.bind(this);
    this._futureClickHandler = this._futureClickHandler.bind(this);
    this._handleCloseButtonClick = this._handleCloseButtonClick.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._currentSortType = SortType.DEFAULT;
    this._mode = Mode.DEFAULT;
    this._popupComponent = null;
  }

  init(films) {
    this._films = films.slice();
    this._sourcedBoardFilms = films.slice();

    this._filmView = {};
    this._filmViewTop = {};
    this._filmViewComment = {};
    this._renderFilmBoard();
  }

  _renderFilmBoard() {
    this._SiteMenuPresenter.init(this._films);

    if (this._films.length) {
      this._sortComponents.setSortTypeChangeHandler(this._handleSortTypeChange);
      this._renderContainers();
    } else {
      this._renderNoFilms();
    }
  }

  _renderContainers() {
    render(this._boardContainer, this._sortComponents); // отрисовка поля для послд. выбора сортировки фильмов
    render(this._boardContainer, this._filmListComponent); // отрисовываем сам контейнер new FilmList()
    this._renderFilmList(this._films);
    this._renderFilmAdditionalList();
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
    Object.values(this._filmView).forEach((presenter) => remove(presenter));
    Object.values(this._filmViewTop).forEach((presenter) => remove(presenter));
    Object.values(this._filmViewComment).forEach((presenter) => remove(presenter));

    remove(this._loadMoreButtonComponent);
  }
  /*

   */
  _updateMenu(films) {
    this._SiteMenuPresenter.update(films);
  }

  _favoriteClickHandler(film) {
    const oldFilm = this._films.find((item) => item.id === film.id);
    oldFilm.isFavorit = !film.isFavorit;
    this._updateMenu(this._films);
  }

  _watchedClickHandler(film) {
    const oldFilm = this._films.find((item) => item.id === film.id);
    oldFilm.isWatched = !film.isWatched;
    this._updateMenu(this._films);
  }

  _futureClickHandler(film) {
    const oldFilm = this._films.find((item) => item.id === film.id);
    oldFilm.futureFilm = !film.futureFilm;
    this._updateMenu(this._films);
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
    if (this._mode === Mode.POPUP) {
      this._removePopup();
    }
    if (this._mode === Mode.DEFAULT) {
      this._popupComponent = new PopUp(film);

      this._popupComponent.setCloseBtnClickHandler(this._handleCloseButtonClick);

      this._popupComponent.setFavoritePopupClickHandler(() => { this._favoriteClickHandler(film); });
      this._popupComponent.setWatchedPopupClickHandler(() => { this._watchedClickHandler(film); });
      this._popupComponent.setFuturePopupClickHandler(() => { this._futureClickHandler(film); });

      emersion(this._boardContainer, this._popupComponent);
      this._mode = Mode.POPUP;
      this._boardContainer.classList.add('hide-overflow');
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
      this._boardContainer.classList.remove('hide-overflow');

      document.removeEventListener('keydown', this._onEscKeyDown);
    }
  }

  _handleCloseButtonClick() {
    this._removePopup();
    this._boardContainer.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this._onEscKeyDown);
  }
  /*

   */

  _createFilmRateArray() {
    const rateFilm = this._films.slice().sort((a, b) => b.rating - a.rating);
    return rateFilm;
  }

  _createFilmYearArray() {
    const yearFilm = this._films.slice().sort((a, b) => b.productionYear - a.productionYear);
    return yearFilm;
  }

  _filmRateSort() {
    const rateFilm = this._createFilmRateArray();
    this._renderFilmList(rateFilm);
  }

  _filmYearSort() {
    const yearFilm = this._createFilmYearArray();
    this._renderFilmList(yearFilm);
  }

  _sortFilmCards(type) {
    switch (type) {
      case SortType.RATING:
        this._filmRateSort();
        break;
      case SortType.DATE:
        this._filmYearSort();
        break;
      case SortType.DEFAULT:
        this._renderFilmList(this._sourcedBoardFilms);
        break;
    }
    this._currentSortType = type;
  }

  _handleSortTypeChange(type) {
    if (this._currentSortType === type) {
      return;
    }
    this._clearFilmList();
    this._sortFilmCards(type);
    this._renderFilmAdditionalList();
  }
  /*

   */
  _renderAdditionalFilms(container, film) {
    const filmView = new FilmCard(film);
    render(container, filmView);
    filmView.setEditClickHandler(this._renderPopUp);

    filmView.setFavoriteClickHandler(this._favoriteClickHandler);
    filmView.setWatchedClickHandler(this._watchedClickHandler);
    filmView.setFutureClickHandler(this._futureClickHandler);
    this._filmViewComment[film.id] = filmView;
    this._filmViewTop[film.id] = filmView;
  }

  _renderFilmAdditionalList() {
    const filmCardContainerMostRate = this._boardContainer.querySelector('.films-list__container--rating');
    const filmCardContainerMostComments = this._boardContainer.querySelector('.films-list__container--comments');

    const rateFilm = this._createFilmRateArray();
    const commentsFilm = this._films.slice().sort((a, b) => b.comments.length - a.comments.length);

    commentsFilm
      .slice(0, FILMS_EXTRA_SECTION)
      .forEach((movie) => {
        this._renderAdditionalFilms(filmCardContainerMostComments, movie);
      });

    rateFilm
      .slice(0, FILMS_EXTRA_SECTION)
      .forEach((movie) => {
        this._renderAdditionalFilms(filmCardContainerMostRate, movie);
      });
  }

  _renderNoFilms() {
    render(this._boardContainer, this._noFilmsComponent);
  }
}
export { FilmBoard };
