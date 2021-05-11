import { FilmList } from '../view/film-list-section';
import { EmptyWrap } from '../view/empty';
import { Sort } from '../view/sort';
import { FilmCard } from '../view/film-card.js';
import { ShowMoreButton } from '../view/button-show-more.js';
import { PopUp } from '../view/pop-up-information.js';
import { render, remove } from '../utils/utils-render.js';
import { FILMS_EXTRA_SECTION, FILM_COUNT_PER_STEP, SortType, Mode, UserAction, UpdateType } from '../utils/utils-constans.js';
import { MenuPresenter } from './menu.js';
import { generateFilmComment } from '../mock/comments';


class FilmBoard {
  constructor(boardContainer, bodyElement, filmsModel, filterModel, commentsModel) {
    this._boardContainer = boardContainer;
    this._body = bodyElement;
    this._filmsModel = filmsModel;
    this._filterModel = filterModel;
    this._commentsModel = commentsModel;

    this._sortComponent = null;
    this._loadMoreButtonComponent = null;
    this._popupComponent = null;

    this._renderedFilmCount = FILM_COUNT_PER_STEP;
    this._filmListComponent = new FilmList();
    this._noFilmsComponent = new EmptyWrap();
    this._SiteMenuPresenter = new MenuPresenter(this._boardContainer, this._filmsModel, this._filterModel);

    this._renderPopUp = this._renderPopUp.bind(this);
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
    this._watchedClickHandler = this._watchedClickHandler.bind(this);
    this._futureClickHandler = this._futureClickHandler.bind(this);

    this._handleCloseButtonClick = this._handleCloseButtonClick.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._currentSortType = SortType.DEFAULT;
    this._mode = Mode.DEFAULT;

    this._filmsModel.addObserver(this._handleModelEvent);
  }
  init() {
    this._filmView = {};
    this._filmViewTop = {};
    this._filmViewComment = {};

    this._SiteMenuPresenter.init();
    this._renderFilmBoard();
  }

  _getFilms() {
    switch (this._currentSortType) {
      case SortType.RATING:
        return this._filmsModel.getFilms().slice().sort((a, b) => b.productionYear - a.productionYear);
      case SortType.DATE:
        return this._filmsModel.getFilms().slice().sort((a, b) => b.rating - a.rating);
    }
    return this._filmsModel.getFilms();
  }


  _handleViewAction(actionType, updateType, update) {
    // actionType - действие пользователя, нужно чтобы понять, какой метод модели вызвать
    // updateType - тип изменений, нужно чтобы понять, что после нужно обновить
    // update - обновленные данные
    switch (actionType) {
      case UserAction.UPDATE_TASK:
        this._filmsModel.updateFilm(updateType, update);
        break;
      // case UserAction.ADD_TASK:
      //   this._filmsModel.addFilm(updateType, update);
      //   break;
      // case UserAction.DELETE_TASK:
      //   this._filmsModel.deleteFilm(updateType, update);
      //   break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        // - обновить часть списка (например, когда поменялось описание)
        this._filmView[data.id];
        break;
      case UpdateType.MINOR:
        // - обновить список (например, когда задача ушла в архив)
        this._clearBoard();
        this._renderFilmBoard();
        break;
      case UpdateType.MAJOR:
        this._clearBoard({ resetRenderedFilmCount: true, resetSortType: true });
        this._renderFilmBoard();
        // - обновить всю доску (например, при переключении фильтра)
        break;
    }
  }

  _renderFilmBoard() {
    if (this._getFilms().length) {
      this._renderContainers();
    } else {
      this._renderNoFilms();
    }
  }

  _renderSort() {
    if (this._sortComponent !== null) {
      this._sortComponent = null;
    }
    this._sortComponent = new Sort(this._currentSortType);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
    render(this._boardContainer, this._sortComponent);
  }

  _handleSortTypeChange(type) {
    if (this._currentSortType === type) {
      return;
    }
    this._currentSortType = type;
    this._clearBoard({resetRenderedTaskCount: true});
    this._renderFilmBoard();
  }

  _clearBoard({ resetRenderedFilmCount = false, resetSortType = false } = {}) {
    const filmCount = this._getFilms().length;
    this._clearFilmList();
    this._filmView = {};

    remove(this._sortComponent);
    remove(this._noFilmsComponent);
    remove(this._loadMoreButtonComponent);
    this._renderedFilmCount = FILM_COUNT_PER_STEP; // почему не работает true


    if (resetRenderedFilmCount) {
      this._renderedFilmCount = FILM_COUNT_PER_STEP;
    } else {
      // На случай, если перерисовка доски вызвана
      // уменьшением количества задач (например, удаление или перенос в архив)
      // нужно скорректировать число показанных задач
      this._renderedFilmCount = Math.min(filmCount, this._renderedFilmCount);
    }

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }


  _renderContainers() {
    this._renderSort(); // отрисовка поля для послд. выбора сортировки фильмов
    render(this._boardContainer, this._filmListComponent); // отрисовываем сам контейнер new FilmList()
    this._renderFilmList(this._getFilms());
    this._renderFilmAdditionalList();
  }

  _renderFilmList(films) {
    this._renderFilmsMain(films);

    if (this._getFilms().length > this._renderedFilmCount) {
      this._renderLoadMoreButton();
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
    return filmView;
  }

  _renderFilms(container, films) {
    for (let i = 0; i < films.length; i++) {
      const film = films[i];
      this._renderFilm(container, film);
    }
  }

  _removeFims(container, films) {
    for (let i = 0; i < films.length; i++) {
      const film = films[i];
      const filmCard = this._renderFilm(container, film);
      remove(filmCard);
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
    const oldFilm = this._getFilms().find((item) => item.id === film.id);
    oldFilm.isFavorit = !film.isFavorit;
    this._updateMenu(this._getFilms());
    UserAction.UPDATE_TASK;
    UpdateType.MINOR;

    this._handleViewAction(UserAction.UPDATE_TASK, UpdateType.MINOR, film);
    // возникает баг - фильмы над поп-апом
  }

  _watchedClickHandler(film) {
    const oldFilm = this._getFilms().find((item) => item.id === film.id);
    oldFilm.isWatched = !film.isWatched;
    this._updateMenu(this._getFilms());
    UserAction.UPDATE_TASK;
    UpdateType.MINOR;

    this._handleViewAction(UserAction.UPDATE_TASK, UpdateType.MINOR, film);
  }

  _futureClickHandler(film) {
    const oldFilm = this._getFilms().find((item) => item.id === film.id);
    oldFilm.isFutureFilm = !film.isFutureFilm;
    this._updateMenu(this._getFilms());
    UserAction.UPDATE_TASK;
    UpdateType.MINOR;

    this._handleViewAction(UserAction.UPDATE_TASK, UpdateType.MINOR, film);
  }

  /*
   */


  _renderLoadMoreButton() {
    if (this._loadMoreButtonComponent !== null) {
      this._loadMoreButtonComponent = null;
    }

    this._loadMoreButtonComponent = new ShowMoreButton();
    const buttonPlace = this._boardContainer.querySelector('.films-list');
    render(buttonPlace, this._loadMoreButtonComponent);
    this._loadMoreButtonComponent.setClickHandler(() => { this._handleLoadMoreButtonClick(this._getFilms()); });
  }

  _handleLoadMoreButtonClick(films) {
    const filmCardContainers = this._boardContainer.querySelector('.films-list__container--main');
    films
      .slice(this._renderedFilmCount, this._renderedFilmCount + this._renderedFilmCount)
      .forEach((film) => {
        this._renderFilm(filmCardContainers, film);
      });
    this._renderedFilmCount += this._renderedFilmCount;
    if (this._renderedFilmCount >= this._getFilms().length) {
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
      this._popupComponent = new PopUp(film, this._renderRandomComment());
      this._popupComponent.setCloseBtnClickHandler(this._handleCloseButtonClick);

      this._popupComponent.setFavoritePopupClickHandler(() => { this._favoriteClickHandler(film); });
      this._popupComponent.setWatchedPopupClickHandler(() => { this._watchedClickHandler(film); });
      this._popupComponent.setFuturePopupClickHandler(() => { this._futureClickHandler(film); });

      render(this._boardContainer, this._popupComponent);
      this._mode = Mode.POPUP;
      this._body.classList.add('hide-overflow');
      document.addEventListener('keydown', this._onEscKeyDown);
    }
  }

  _removePopup() {
    remove(this._popupComponent);
    this._popupComponent = null;
    this._mode = Mode.DEFAULT;
    this._body.classList.remove('hide-overflow');
  }

  _onEscKeyDown(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._removePopup();
      document.removeEventListener('keydown', this._onEscKeyDown);
    }
  }

  _handleCloseButtonClick() {
    this._removePopup();
    this._boardContainer.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this._onEscKeyDown);
  }

  _renderRandomComment() {
    return generateFilmComment();
  }

  /*
   */

  _createFilmCommentsArray() {
    const commentsFilm = this._getFilms().slice().sort((a, b) => b.comments.length - a.comments.length);
    return commentsFilm;
  }

  _createFilmRateArray() {
    const rateFilm = this._getFilms().slice().sort((a, b) => b.rating - a.rating);
    return rateFilm;
  }

  // _createFilmYearArray() {
  //   const yearFilm = this._getFilms().slice().sort((a, b) => b.productionYear - a.productionYear);
  //   return yearFilm;
  // }

  // _filmRateSort() {
  //   const rateFilm = this._createFilmRateArray();
  //   this._renderFilmList(rateFilm);
  // }

  // _filmYearSort() {
  //   const yearFilm = this._createFilmYearArray();
  //   this._renderFilmList(yearFilm);
  // }

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
    const commentsFilm = this._createFilmCommentsArray();

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
