import { SiteMenu } from '../view/menu.js';
import { render, remove, RenderPosition } from '../utils/utils-render';
import { FilterType } from '../utils/utils-constans.js';

class MenuPresenter {
  constructor(container) {
    this._container = container;
    this._SiteMenuComponent = null;
    this._activeFilter = FilterType.ALL;

    // this._filmsModel = filmsModel;
    // this._filmsModel.addObserver(this._handleModelEvent);
  }

  init(films = []) {
    const state = this._getFilterState(films);
    this._SiteMenuComponent = new SiteMenu(state.favoritFilm, state.watchedFilm, state.futureFilm, this._activeFilter);
    render(this._container, this._SiteMenuComponent);
    this._renderFilter();
  }

  _getFilters () {
    // const films =  this._filmsModel.getData();

    return [
      {
        type: FilterType.ALL,
        filterName: 'all',
        // count: filtersFunctionMap[FILTER.ALL_MOVIES](films).length,
      },
      {
        type: FilterType.FAVORITES,
        filterName: 'favorites',
        // count: filtersFunctionMap[FILTER.FAVORITES](films).length,
      },
      {
        type: FilterType.WATCHLIST,
        filterName: 'watchlist',
        // count: filtersFunctionMap[FILTER.WATCHLIST](films).length,
      },
      {
        type: FilterType.HISTORY,
        filterName: 'history',
        // count: filtersFunctionMap[FILTER.HISTORY](films).length,
      },
    ];
  }

  update(films = []) {
    if (this._SiteMenuComponent != null) {
      const state = this._getFilterState(films);
      remove(this._SiteMenuComponent);
      this._SiteMenuComponent = new SiteMenu(state.favoritFilm, state.watchedFilm, state.futureFilm);
      render(this._container, this._SiteMenuComponent, RenderPosition.AFTERBEGIN);
    }
  }

  _getFilterState(films) {
    const favoritFilm = films.filter((film) => film.isFavorit).length;
    const watchedFilm = films.filter((film) => film.isWatched).length;
    const futureFilm = films.filter((film) => film.isFutureFilm).length;

    return {
      favoritFilm,
      watchedFilm,
      futureFilm,
    };
  }

  _renderFilter() {
    this._SiteMenuComponent.setFilterClick(this._handleFilterTypeChange);
  }

  _handleFilterTypeChange(type) {
    if (this._activeFilter === type) {
      return;
    }
    this._activeFilter = type;
  }
}
export { MenuPresenter };
