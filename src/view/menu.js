import { Abstract } from './abstract.js';
import { FilterType } from '../utils/utils-constans.js';


const createSiteMenuTemplate = (favorite, watched, futureFilm, activeFilter) => {
  return ` <div> <nav class="main-navigation">
    <div class="main-navigation__items">
      <a href="#all" class="main-navigation__item ${activeFilter === FilterType.ALL ? 'main-navigation__item--active' : ''}" data-sort-type="${FilterType.ALL}">All movies</a>
      <a href="#watchlist" class="main-navigation__item ${activeFilter === FilterType.WATCHLIST ? 'main-navigation__item--active' : ''}" data-sort-type="${FilterType.WATCHLIST}" >Watchlist
       <span class="main-navigation__item-count">${futureFilm}</span></a>
      <a href="#history" class="main-navigation__item ${activeFilter === FilterType.HISTORY ? 'main-navigation__item--active' : ''}" data-sort-type="${FilterType.HISTORY}" >History
       <span class="main-navigation__item-count">${watched}</span></a>
      <a href="#favorites" class="main-navigation__item ${activeFilter === FilterType.FAVORITES ? 'main-navigation__item--active' : ''}"  data-sort-type="${FilterType.FAVORITES}" >Favorites
      <span class="main-navigation__item-count">${favorite}</span></a>
    </div>
    <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>
  </section> </div>`;
};

class SiteMenu extends Abstract {
  constructor(favoritFilm = 0, watchedFilm = 0, futureFilm = 0, activeFilter) {
    super();
    this._favorite = favoritFilm;
    this._watched = watchedFilm;
    this._future = futureFilm;
    this._activeFilter = activeFilter;
    this._filterClickHandler = this._filterClickHandler.bind(this);
  }

  getTemplate() {
    return createSiteMenuTemplate(this._favorite, this._watched, this._future, this._activeFilter);
  }

  setValue(favoritFilm = 0, watchedFilm = 0, futureFilm = 0) {
    this._favorite = favoritFilm;
    this._watched = watchedFilm;
    this._future = futureFilm;
  }

  restoreHandlers() {
    this.setFilterClick(this._callback.filterClick);
  }

  _filterClickHandler(evt) {
    if (evt.target.tagName !== 'A') {
      return;
    }
    evt.preventDefault();
    this._callback.filterClick(evt.target.dataset.sortType);
  }

  setFilterClick(callback) {
    this._callback.filterClick = callback;
    this.getElement().addEventListener('click', this._filterClickHandler);
  }
}

export { SiteMenu };
