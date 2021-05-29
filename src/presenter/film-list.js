import FilmList from '../view/film-list-section.js';
import EmptyWrap from '../view/empty.js';
import Sort from '../view/sort.js';
import FilmCard from '../view/film-card.js';
import ShowMoreButton from '../view/button-show-more.js';
import PopUp from '../view/pop-up-information.js';
import Stats from '../view/stats.js';
import Loading from '../view/loading.js';
import { render, remove, replace } from '../utils/render.js';
import { UserFilters } from '../utils/filter.js';
import { compareDate } from '../utils/common.js';
import {
  FILMS_EXTRA_SECTION,
  FILM_COUNT_PER_STEP,
  SortType,
  Mode,
  Action,
  UpdateType,
  FilterType
  // State
} from '../utils/constans.js';

export default class FilmBoard {
  constructor(boardContainer, bodyElement, filmsModel, filterModel, api, comments) {
    this._boardContainer = boardContainer;
    this._body = bodyElement;
    this._filmsModel = filmsModel;
    this._filterModel = filterModel;
    this._api = api;
    this._commentsModel = comments;

    this._isLoading = true;

    this._sortComponent = null;
    this._loadMoreButtonComponent = null;
    this._popupComponent = null;
    this._statisticComponent = null;

    this._renderedFilmCount = FILM_COUNT_PER_STEP;
    this._filmListComponent = new FilmList();
    this._noFilmsComponent = new EmptyWrap();
    this._loadingComponent = new Loading();

    this._renderPopUp = this._renderPopUp.bind(this);
    this._keyDownHandler = this._keyDownHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
    this._watchedClickHandler = this._watchedClickHandler.bind(this);
    this._futureClickHandler = this._futureClickHandler.bind(this);
    this._closeButtonClickHandler = this._closeButtonClickHandler.bind(this);
    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);

    this._currentSortType = SortType.DEFAULT;
    this._mode = Mode.DEFAULT;

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleCommentsModelEvent = this._handleCommentsModelEvent.bind(this);
    this._filmsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
    this._commentsModel.addObserver(this._handleCommentsModelEvent);

    this._deleteComment = this._deleteComment.bind(this);
    this._addComment = this._addComment.bind(this);

  }
  init() {
    this._filmView = {};
    this._filmViewTop = {};
    this._filmViewComment = {};
    if (this._isLoading) {
      this._renderLoading();
      return;
    }
  }


  _getFilms() {
    this._filmsDefault = this._filmsModel.getData();

    const filterType = this._filterModel.getFilter();
    const filtredFilms = UserFilters[filterType](this._filmsDefault);

    switch (this._currentSortType) {
      case SortType.DATE:
        return filtredFilms.sort(compareDate);
      case SortType.RATING:
        return filtredFilms.sort((a, b) => b.rating - a.rating);
      case SortType.DEFAULT:
        return UserFilters[filterType](this._filmsModel.getDefaultFilms());
    }
  }

  _handleViewAction(actionType, updateType, filmForUpdate, comment) {
    switch (actionType) {
      case Action.UPDATE_FILM:
        this._api.updateFilm(filmForUpdate)
          .then((response) => {
            this._filmsModel.updateFilm(updateType, response);
          })
          .catch(() => {
          });
        break;
      case Action.ADD_COMMENT:
        this._api.addComment(filmForUpdate, comment)
          .then((response) => {
            this._commentsModel.addComment(UpdateType.MAJOR, response.comments, response.film);
            this._api.updateFilm(response.film).then((response) => {
              const oldFilm = this._getFilms().find((item) => item.id === response.id);
              oldFilm.comments = response.comments;
              this._filmsModel.updateFilm(UpdateType.MAJOR, response);
            });
          })
          .catch(() => {
          });
        break;
      case Action.DELETE_COMMENT:
        this._api.deleteComment(comment)
          .then(() => {
            this._commentsModel.deleteComment(UpdateType.MAJOR, comment);
            filmForUpdate.comments = this._commentsModel.getComments();
            const oldFilm = this._getFilms().find((item) => item.id === filmForUpdate.id);
            oldFilm.comments = filmForUpdate.comments;
            this._filmsModel.updateFilm(UpdateType.MAJOR, oldFilm);
          })
          .catch(() => {
          });
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    if (data === FilterType.STATS) {
      updateType = FilterType.STATS;
    }
    switch (updateType) {
      case FilterType.STATS:
        this._clearBoard({ resetRenderedFilmCount: true, resetSortType: true });
        this._renderStatistic();
        replace(this._statisticComponent, this._filmListComponent);
        break;
      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._loadingComponent);
        this._renderFilmBoard();
        break;
      case UpdateType.PATCH:
        this._filmView[data.id];
        break;
      case UpdateType.MINOR:
        this._clearBoard();
        this._renderFilmBoard();
        break;
      case UpdateType.MAJOR:
        if (this._statisticComponent !== null) {
          remove(this._statisticComponent);
        }
        this._clearBoard({ resetRenderedFilmCount: true, resetSortType: true });
        this._renderFilmBoard();
        break;
    }
  }

  _handleCommentsModelEvent(updateType, data, filmForUpdate) {
    switch (updateType) {
      case UpdateType.MINOR:
        this._clearBoard();
        this._renderFilmBoard();
        break;
      case UpdateType.MAJOR:
        this._popupComponent.updateComments(data);
        this._popupComponent.resetPopUp(filmForUpdate);
        this._clearBoard({ resetRenderedFilmCount: true, resetSortType: true });
        this._renderFilmBoard();
        break;
    }
  }

  _renderLoading() {
    render(this._boardContainer, this._loadingComponent);
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
    this._sortComponent.setSortTypeChangeHandler(this._sortTypeChangeHandler);
    render(this._boardContainer, this._sortComponent);
  }

  _sortTypeChangeHandler(type) {
    if (this._currentSortType === type) {
      return;
    }
    this._currentSortType = type;
    this._clearBoard({ resetRenderedTaskCount: true });
    this._renderFilmBoard();
  }

  _clearBoard(resetRenderedFilmCount = false, resetSortType = false) {
    const filmCount = this._getFilms().length;
    this._clearFilmList();
    this._filmView = {};

    remove(this._sortComponent);
    remove(this._noFilmsComponent);
    remove(this._loadingComponent);

    if (resetRenderedFilmCount) {
      this._renderedFilmCount = FILM_COUNT_PER_STEP;
    } else {
      this._renderedFilmCount = Math.min(filmCount, this._renderedFilmCount);
    }
    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }

  _renderContainers() {
    this._renderSort(); // отрисовка поля для послд. выбора сортировки фильмов
    render(this._boardContainer, this._filmListComponent); // отрисовываем сам контейнер new FilmList()
    const films = this._getFilms();
    this._renderFilmList(films);
    // this._renderFilmAdditionalList();
  }

  _renderFilmList(films) {
    this._renderFilmsMain(films);

    if (films.length > this._renderedFilmCount) {
      this._renderLoadMoreButton();
    }
  }

  _renderFilmsMain(films) {
    const filmCardContainers = this._boardContainer.querySelector('.films-list__container--main');
    this._renderFilms(filmCardContainers, films.slice(0, this._renderedFilmCount));
  }

  _renderFilm(container, film) {
    const commentsLength = film.comments.length;
    const filmView = new FilmCard(film, commentsLength);
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

  _clearFilmList() {
    Object.values(this._filmView).forEach((presenter) => remove(presenter));
    Object.values(this._filmViewTop).forEach((presenter) => remove(presenter));
    Object.values(this._filmViewComment).forEach((presenter) => remove(presenter));
    remove(this._loadMoreButtonComponent);
  }

  /*
   */
  _favoriteClickHandler(film) {
    const oldFilm = this._getFilms().find((item) => item.id === film.id);
    oldFilm.userDetails.isFavorit = !film.userDetails.isFavorit;
    this._handleViewAction(Action.UPDATE_FILM, UpdateType.MINOR, film);
  }

  _watchedClickHandler(film) {
    const oldFilm = this._getFilms().find((item) => item.id === film.id);
    oldFilm.userDetails.isWatched = !film.userDetails.isWatched;
    this._handleViewAction(Action.UPDATE_FILM, UpdateType.MINOR, film);
  }

  _futureClickHandler(film) {
    const oldFilm = this._getFilms().find((item) => item.id === film.id);
    oldFilm.userDetails.isFutureFilm = !film.userDetails.isFutureFilm;
    this._handleViewAction(Action.UPDATE_FILM, UpdateType.MINOR, film);
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
    this._loadMoreButtonComponent.setClickHandler(() => { this._loadMoreButtonClickHandler(this._getFilms()); });
  }

  _loadMoreButtonClickHandler(films) {
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
    this._api.getComments(film.id)
      .then((comments) => {
        this._comments = comments;
        this._commentsModel.addComment(UpdateType.MINOR, this._comments);

        if (this._mode === Mode.POPUP) {
          this._removePopup();
        }
        if (this._mode === Mode.DEFAULT) {
          this._popupComponent = new PopUp(film, this._commentsModel.getComments());
          this._popupComponent.setCloseBtnClickHandler(this._closeButtonClickHandler);

          this._popupComponent.setFavoritePopupClickHandler(() => { this._favoriteClickHandler(film); });
          this._popupComponent.setWatchedPopupClickHandler(() => { this._watchedClickHandler(film); });
          this._popupComponent.setFuturePopupClickHandler(() => { this._futureClickHandler(film); });

          this._popupComponent.setDeleteComment(this._deleteComment);
          this._popupComponent.setSendNewComment(this._addComment);

          render(this._body, this._popupComponent);
          this._mode = Mode.POPUP;
          this._body.classList.add('hide-overflow');
          document.addEventListener('keydown', this._keyDownHandler);
        }
      })
      .catch(() => {
        this._popupComponent.showError();
      });
  }

  showError() {
    // console.log('MISt');
  }

  _removePopup() {
    remove(this._popupComponent);
    this._popupComponent = null;
    this._mode = Mode.DEFAULT;
    this._body.classList.remove('hide-overflow');
  }

  _keyDownHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._removePopup();
      document.removeEventListener('keydown', this._keyDownHandler);
    }
  }

  _closeButtonClickHandler() {
    this._removePopup();
    this._boardContainer.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this._keyDownHandler);
  }

  _deleteComment(film, comment) {
    this._films = this._filmsModel.getData();
    film = this._films.find((filmItem) => filmItem.id === film.id);
    this._handleViewAction(Action.DELETE_COMMENT, UpdateType.MAJOR, film, comment.id);
  }

  _addComment(film, comment) {
    this._films = this._filmsModel.getData();
    film = this._films.find((filmItem) => filmItem.id === film.id);
    this._handleViewAction(Action.ADD_COMMENT, UpdateType.MAJOR, film, comment);
  }

  /*
   */

  _createFilmCommentsList() {
    const commentsFilm = this._filmsModel.getData().sort((a, b) => b.comments.length - a.comments.length);
    return commentsFilm;
  }

  _createFilmRateList() {
    const rateFilm = this._filmsModel.getData().sort((a, b) => b.rating - a.rating);
    return rateFilm;
  }
  /*
   */

  _renderAdditionalFilms(container, film) {
    const commentsLength = film.comments.length;
    const filmView = new FilmCard(film, commentsLength);
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

    const rateFilm = this._createFilmRateList();
    const commentsFilm = this._createFilmCommentsList();

    if (commentsFilm[0].comments !== 0) {
      commentsFilm
        .slice(0, FILMS_EXTRA_SECTION)
        .forEach((movie) => {
          this._renderAdditionalFilms(filmCardContainerMostComments, movie);
        });
    }
    if (rateFilm[0].rating !== 0) {
      rateFilm
        .slice(0, FILMS_EXTRA_SECTION)
        .forEach((movie) => {
          this._renderAdditionalFilms(filmCardContainerMostRate, movie);
        });
    }
  }

  _renderNoFilms() {
    render(this._boardContainer, this._noFilmsComponent);
  }

  _renderStatistic() {
    this._statisticComponent = new Stats(this._filmsModel.getData());
    render(this._boardContainer, this._statisticComponent);
  }
}
