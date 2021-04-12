import dayjs from 'dayjs';
import { createSiteElement } from '../utils.js';


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

class FilmCard {
  constructor(films) {
    this._filters = films;
    this._element = null;
  }

  getTemplate() {
    return createFilmCard(this._filters);
  }

  getElement() {
    if (!this._element) {
      this._element = createSiteElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}

export { FilmCard };
