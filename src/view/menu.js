import Abstract from './abstract.js';
import { FilterType } from '../utils/constans.js';

const generateFilterItem = (filter, activeFilter) => {

  const { type, filterName, count } = filter;
  return `<a href="#${filterName}"
  data-filter = "${type}"
  class="main-navigation__item ${activeFilter === type ? 'main-navigation__item--active' : ''}">
  ${type} ${type === FilterType.ALL ? '' : `<span class="main-navigation__item-count">${count}</span>`}</a>`;
};

const generateFiltersTemplate = (filters, activeFilter) => {
  return filters.map((filter) => generateFilterItem(filter, activeFilter)).join('');
};

const createSiteMenuTemplate = (filters, activeFilter) => {

  return `<nav class="main-navigation">
   <div class="main-navigation__items">
    ${generateFiltersTemplate(filters, activeFilter)}
    </div>
    <a href="#stats" class="main-navigation__additional ${activeFilter === FilterType.STATS ? 'main-navigation__additional--active' : ''}"
    data-filter = "${FilterType.STATS}">Stats</a>
    </nav>`;
};

export default class SiteMenu extends Abstract {
  constructor(filter, activeFilter) {
    super();
    this._data = filter;
    this._activeFilter = activeFilter;

    this._filterClickHandler = this._filterClickHandler.bind(this);
  }

  getTemplate() {
    return createSiteMenuTemplate(this._data, this._activeFilter);
  }

  restoreHandlers() {
    this.setFilterClick(this._callback.filterClick);
  }

  _filterClickHandler(evt) {
    const menuNavigation = evt.target.classList.contains('main-navigation__item') ||
      evt.target.classList.contains('main-navigation__additional');

    if (!menuNavigation) {
      return;
    }
    this._callback.filterClick(evt.target.dataset.filter);
  }

  setFilterClick(callback) {
    this._callback.filterClick = callback;
    this.getElement().addEventListener('click', this._filterClickHandler);
  }
}

