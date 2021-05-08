import { Abstract } from './abstract.js';
import { SortType } from '../utils/utils-constans';

const createSorting = (currentSortType) => {
  return `  <ul class="sort">
  <li><a href="#" class="sort__button sort__button--active sort__button--default ${currentSortType === SortType.DEFAULT ? 'board__filter--active' : ''}" data-sort-type="${SortType.DEFAULT}">Sort by default</a></li>
  <li><a href="#" class="sort__button sort__button--date ${currentSortType === SortType.DEFAULT ? 'board__filter--active' : ''}" data-sort-type="${SortType.DATE}">Sort by date</a></li>
  <li><a href="#" class="sort__button sort__button--rate ${currentSortType === SortType.DEFAULT ? 'board__filter--active' : ''}" data-sort-type="${SortType.RATING}">Sort by rating</a></li>
  </ul>` ;
};

class Sort extends Abstract {
  constructor(currentSortType) {
    super();

    this._currentSortType = currentSortType;
    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createSorting(this._currentSortType);
  }

  _changeActiveStatus(target) {
    const urls = this.getElement().querySelectorAll('.sort__button');
    for (const url of urls) {
      url.classList.remove('sort__button--active');
    }
    target.classList.add('sort__button--active');
  }

  _sortTypeChangeHandler(evt) {
    if (evt.target.tagName !== 'A') {
      return;
    }
    evt.preventDefault();
    this._changeActiveStatus(evt.target);
    this._callback.sortTypeChange(evt.target.dataset.sortType);
  }

  setSortTypeChangeHandler(callback) {
    this._callback.sortTypeChange = callback;
    this.getElement().addEventListener('click', this._sortTypeChangeHandler);
  }
}

export { Sort };
