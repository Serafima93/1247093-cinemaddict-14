import { Abstract } from './abstract.js';
import { FilterType, UpdateType } from '../utils/utils-constans.js';

const generateFilterItem = (filter, activeFilter) => {

  const {type, filterName, count} = filter;
  return `<a href="#${filterName}"
  data-filter = "${type}"
  class="main-navigation__item ${activeFilter === type ? 'main-navigation__item--active' : ''}">
  ${type} ${type === FilterType.ALL ? '' : `<span class="main-navigation__item-count">${count}</span>`}</a>`;
};

const generateFiltersTemplate =(filters, activeFilter) => {
  return filters.map((filter) => generateFilterItem(filter, activeFilter)).join('');
};

const createSiteMenuTemplate = (filters, activeFilter) => {

  return `<nav class="main-navigation">
   <div class="main-navigation__items">
    ${generateFiltersTemplate(filters, activeFilter)}
    </div>
    <a href="#stats"
    class="main-navigation__additional ${activeFilter === FilterType.STATS ?'main-navigation__additional--active':''}"
    data-filter = "${FilterType.STATS}">Stats</a>
    </nav>`;
};

// const createSiteMenuTemplate = (/*favorite, watched, futureFilm*/filter, activeFilter) => {
//   const { type, filterName, count } = filter;

//   return `
//   <a href="#${filterName}" data-filter = "${type}" class="main-navigation__item ${activeFilter === type ? 'main-navigation__item--active' : ''}">
//   ${type} ${type === FilterType.ALL ? '' : `<span class="main-navigation__item-count">${count}</span>`}</a>`;

//   // ` <div> <nav class="main-navigation">
//   //   <div class="main-navigation__items">
//   //     <a href="#${filterName}" class="main-navigation__item ${activeFilter === type ? 'main-navigation__item--active' : ''}" data-filter="${type}">All movies</a>
//   //     <a href="#${filterName}" class="main-navigation__item ${activeFilter === type ? 'main-navigation__item--active' : ''}" data-filter="${type}" >Watchlist
//   //      <span class="main-navigation__item-count">${count}</span></a>
//   //     <a href="#${filterName}" class="main-navigation__item ${activeFilter === type ? 'main-navigation__item--active' : ''}" data-filter="$${type}" >History
//   //      <span class="main-navigation__item-count">${count}</span></a>
//   //     <a href="#${filterName}" class="main-navigation__item ${activeFilter === type ? 'main-navigation__item--active' : ''}"  data-filter="${type}" >Favorites
//   //     <span class="main-navigation__item-count">${count}</span></a>
//   //   </div>
//   //   <a href="#${filterName}" class="main-navigation__additional">Stats</a>
//   // </nav>
//   // </section> </div>`;

// };

class SiteMenu extends Abstract {
  constructor(/*favoritFilm = 0, watchedFilm = 0, futureFilm = 0,*/filter, activeFilter) {
    super();
    // this._favorite = favoritFilm;
    // this._watched = watchedFilm;
    // this._future = futureFilm;
    this._data = filter;
    this._activeFilter = activeFilter;

    this._filterClickHandler = this._filterClickHandler.bind(this);
  }

  getTemplate() {
    return createSiteMenuTemplate(this._data, this._activeFilter);
  }

  // getTemplate() {
  //   return createSiteMenuTemplate(this._favorite, this._watched, this._future, this._activeFilter);
  // }

  // setValue(favoritFilm = 0, watchedFilm = 0, futureFilm = 0) {
  //   this._favorite = favoritFilm;
  //   this._watched = watchedFilm;
  //   this._future = futureFilm;
  // }

  restoreHandlers() {
    this.setFilterClick(this._callback.filterClick);
  }

  _filterClickHandler(evt) {
    const menuNavigation = evt.target.classList.contains('main-navigation__item') ||
      evt.target.classList.contains('main-navigation__additional');

    if (!menuNavigation) {
      return;
    }
    this._callback.filterClick(UpdateType.MAJOR, evt.target.dataset.filter);
  }

  setFilterClick(callback) {
    this._callback.filterClick = callback;
    this.getElement().addEventListener('click', this._filterClickHandler);
  }
}

export { SiteMenu };
