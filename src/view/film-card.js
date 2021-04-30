import dayjs from 'dayjs';
import { Abstract } from './abstract.js';

const createFilmCard = (film) => {
  const { title, description, genres, poster, rating, productionYear, timeContinue, comments } = film;

  const mainGenre = genres.slice(0, 1);

  const { hours, minutes } = timeContinue.$d;

  const date = productionYear !== null
    ? dayjs(productionYear).format('YYYY')
    : '';

  const commentLength = comments.length;

  return `<article class="film-card">
  <h3 class="film-card__title">${title}</h3>
  <p class="film-card__rating">${rating}</p>
  <p class="film-card__info">
    <span class="film-card__year">${date}</span>
    <span class="film-card__duration">${hours} h ${minutes} min</span>
    <span class="film-card__genre">${mainGenre}</span>
  </p>
  <img src=${poster} alt="" class="film-card__poster">
  <p class="film-card__description">${description}</p>
  <a class="film-card__comments">${commentLength} comments</a>
  <div class="film-card__controls">
    <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${film.isFutureFilm ? 'film-card__controls-item--active' : ''}" type="button">Add to watchlist</button>
    <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${film.isWatched ? 'film-card__controls-item--active' : ''}" type="button">Mark as watched</button>
    <button class="film-card__controls-item button film-card__controls-item--favorite ${film.isFavorit ? 'film-card__controls-item--active' : ''}" type="button">Mark as favorite</button>
  </div>
</article>`;
};

class FilmCard extends Abstract {
  constructor(film) {
    super();
    this._film = film;

    this._editClickHandlerPopup = this._editClickHandlerPopup.bind(this);
    this._editClickHandlerFavorite = this._editClickHandlerFavorite.bind(this);
    this._editClickHandlerWatched = this._editClickHandlerWatched.bind(this);
    this._editClickHandlerFuture = this._editClickHandlerFuture.bind(this);
  }

  getTemplate() {
    return createFilmCard(this._film);
  }

  _changeActiveStatus(target) {
    if (target.classList.contains('film-card__controls-item--active')) {
      target.classList.remove('film-card__controls-item--active');
    } else { target.classList.add('film-card__controls-item--active'); }
  }

  _editClickHandlerPopup(evt) {
    evt.preventDefault();
    this._callback.openPopup(this._film);
  }

  _editClickHandlerFavorite(evt) {
    evt.preventDefault();
    this._changeActiveStatus(evt.target);
    this._callback.favorite(this._film);
  }

  _editClickHandlerWatched(evt) {
    evt.preventDefault();
    this._changeActiveStatus(evt.target);
    this._callback.watched(this._film);
  }

  _editClickHandlerFuture(evt) {
    evt.preventDefault();
    this._changeActiveStatus(evt.target);
    this._callback.future(this._film);
  }

  setEditClickHandler(callback) {
    this._callback.openPopup = callback;
    this.getElement().querySelector('.film-card__poster').addEventListener('click', this._editClickHandlerPopup);
    this.getElement().querySelector('.film-card__title').addEventListener('click', this._editClickHandlerPopup);
    this.getElement().querySelector('.film-card__comments').addEventListener('click', this._editClickHandlerPopup);
  }

  setFavoriteClickHandler(callback) {
    this._callback.favorite = callback;
    const favoriteFilms = this.getElement().querySelector('.film-card__controls-item--favorite');
    favoriteFilms.addEventListener('click', this._editClickHandlerFavorite);

  }

  setWatchedClickHandler(callback) {
    this._callback.watched = callback;
    const watchedFilms = this.getElement().querySelector('.film-card__controls-item--mark-as-watched');
    watchedFilms.addEventListener('click', this._editClickHandlerWatched);

  }

  setFutureClickHandler(callback) {
    this._callback.future = callback;
    const futureFilms = this.getElement().querySelector('.film-card__controls-item--add-to-watchlist');
    futureFilms.addEventListener('click', this._editClickHandlerFuture);
  }
}

export { FilmCard };
