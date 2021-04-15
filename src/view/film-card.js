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
    <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist" type="button">Add to watchlist</button>
    <button class="film-card__controls-item button film-card__controls-item--mark-as-watched" type="button">Mark as watched</button>
    <button class="film-card__controls-item button film-card__controls-item--favorite" type="button">Mark as favorite</button>
  </div>
</article>`;
};

class FilmCard extends Abstract {
  constructor(films) {
    super();
    this._filters = films;
    this._editClickHandler = this._editClickHandler.bind(this);
  }

  getTemplate() {
    return createFilmCard(this._filters);
  }
  _editClickHandler(evt) {
    evt.preventDefault();
    this._callback.editClick();
  }

  setEditClickHandler(callback) {
    this._callback.editClick = callback;
    this.getElement().querySelector('.film-card__poster').addEventListener('click', this._editClickHandler);
    //   this.getElement().querySelector('.film-card__title').addEventListener('click', this._editClickHandler);
    //   this.getElement().querySelector('.film-card__comments').addEventListener('click', this._editClickHandler);
    //
  }
}

export { FilmCard };
