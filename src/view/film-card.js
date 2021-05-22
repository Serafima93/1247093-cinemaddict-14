import dayjs from 'dayjs';
import Smart from './smart.js';
import { changeActiveStatus } from '../utils/common.js';
import { MAX_DESCRIPTION_LENGTH } from '../utils/constans.js';

const createFilmCard = (film) => {
  const { title, description, genres, poster, rating, productionYear, runtimeMessage, comments } = film;

  const mainGenre = genres.slice(0, 1);

  const date = productionYear !== null
    ? dayjs(productionYear).format('YYYY')
    : '';

  let newDescription = description;

  if (newDescription.length >= MAX_DESCRIPTION_LENGTH) {
    newDescription = `${description.slice(0, MAX_DESCRIPTION_LENGTH)}...`;
  }

  const commentLength = comments.length;

  return `<article class="film-card">
  <h3 class="film-card__title">${title}</h3>
  <p class="film-card__rating">${rating}</p>
  <p class="film-card__info">
    <span class="film-card__year">${date}</span>
    <span class="film-card__duration">${runtimeMessage}</span>
    <span class="film-card__genre">${mainGenre}</span>
  </p>
  <img src=${poster} alt="" class="film-card__poster">
  <p class="film-card__description">${newDescription}</p>
  <a class="film-card__comments">${commentLength} comments</a>
  <div class="film-card__controls">
    <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${film.userDetails.isFutureFilm ? 'film-card__controls-item--active' : ''}" type="button">Add to watchlist</button>
    <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${film.userDetails.isWatched ? 'film-card__controls-item--active' : ''}" type="button">Mark as watched</button>
    <button class="film-card__controls-item button film-card__controls-item--favorite ${film.userDetails.isFavorit ? 'film-card__controls-item--active' : ''}" type="button">Mark as favorite</button>
  </div>
</article>`;
};

export default class FilmCard extends Smart {
  constructor(film) {
    super();
    this._film = film;
    this._openPopUpHandler = this._openPopUpHandler.bind(this);
    this._changeFavoriteHandler = this._changeFavoriteHandler.bind(this);
    this._changeWatchedHandler = this._changeWatchedHandler.bind(this);
    this._changeFutureHandler = this._changeFutureHandler.bind(this);
  }

  getTemplate() {
    return createFilmCard(this._film);
  }

  _openPopUpHandler(evt) {
    evt.preventDefault();
    this._callback.openPopup(this._film);
  }

  _changeFavoriteHandler(evt) {
    evt.preventDefault();
    changeActiveStatus(evt.target, 'film-card__controls-item--active');
    this._callback.favorite(this._film);
  }

  _changeWatchedHandler(evt) {
    evt.preventDefault();
    changeActiveStatus(evt.target, 'film-card__controls-item--active');
    this._callback.watched(this._film);
  }

  _changeFutureHandler(evt) {
    evt.preventDefault();
    changeActiveStatus(evt.target, 'film-card__controls-item--active');
    this._callback.future(this._film);
  }

  setEditClickHandler(callback) {
    this._callback.openPopup = callback;
    this.getElement().querySelector('.film-card__poster').addEventListener('click', this._openPopUpHandler);
    this.getElement().querySelector('.film-card__title').addEventListener('click', this._openPopUpHandler);
    this.getElement().querySelector('.film-card__comments').addEventListener('click', this._openPopUpHandler);
  }

  setFavoriteClickHandler(callback) {
    this._callback.favorite = callback;
    const favoriteFilms = this.getElement().querySelector('.film-card__controls-item--favorite');
    favoriteFilms.addEventListener('click', this._changeFavoriteHandler);
  }

  setWatchedClickHandler(callback) {
    this._callback.watched = callback;
    const watchedFilms = this.getElement().querySelector('.film-card__controls-item--mark-as-watched');
    watchedFilms.addEventListener('click', this._changeWatchedHandler);

  }

  setFutureClickHandler(callback) {
    this._callback.future = callback;
    const futureFilms = this.getElement().querySelector('.film-card__controls-item--add-to-watchlist');
    futureFilms.addEventListener('click', this._changeFutureHandler);
  }
}

