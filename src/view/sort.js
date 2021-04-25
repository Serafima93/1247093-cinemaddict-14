import { Abstract } from './abstract.js';

const createSorting = () => {
  return `  <ul class="sort">
  <li><a href="#" class="sort__button sort__button--active">Sort by default</a></li>
  <li><a href="#" class="sort__button sort__button--date">Sort by date</a></li>
  <li><a href="#" class="sort__button sort__button--rate">Sort by rating</a></li>
  </ul>` ;
};

class Sort extends Abstract {
  constructor() {
    super();
    this._editClickHandlerRating = this._editClickHandlerRating.bind(this);
    this._editClickHandlerYear = this._editClickHandlerYear.bind(this);
  }

  getTemplate() {
    return createSorting();
  }

  _editClickHandlerRating(evt) {
    evt.preventDefault();
    this._callback.rating();
  }

  _editClickHandlerYear(evt) {
    evt.preventDefault();
    this._callback.year();
  }

  _filmModeChange() {
    const oldElement = this.getElement().querySelector('.sort__button--active');
    oldElement.classList.remove('sort__button--active');
  }

  setRatingClickHandler(callback) {
    this._callback.rating = callback;
    this.getElement().querySelector('.sort__button--rate').addEventListener('click', this._editClickHandlerRating);
  }

  setYearClickHandler(callback) {
    this._callback.year = callback;
    this.getElement().querySelector('.sort__button--date').addEventListener('click', this._editClickHandlerYear);
  }
}

export { Sort };
