import { SiteMenu } from '../view/menu.js';
import { replace, render, remove } from '../utils/utils-render';
import { FilterType } from '../utils/utils-constans.js';
import { filters } from '../utils/utils-filter.js';


class MenuPresenter {
  constructor(container, filmsModel, filterModel) {
    this._container = container;
    this._SiteMenuComponent = null;

    this._filmsModel = filmsModel;
    this._filterModel = filterModel;

    this._handlerFromModel = this._handlerFromModel.bind(this);
    this._handlerFilterClick = this._handlerFilterClick.bind(this);

    this._filmsModel.addObserver(this._handlerFromModel);
    this._filterModel.addObserver(this._handlerFromModel);
  }

  // initOld() {
  //   const films = this._filmsModel.getFilms();
  //   const state = this._getFilterState(films);
  //   this._SiteMenuComponent = new SiteMenu(state.favoritFilm, state.watchedFilm, state.futureFilm, this._activeFilter);
  //   render(this._container, this._SiteMenuComponent);
  //   this._renderFilter();
  // }

  init() {
    const choosenFilter = this._getFilters();
    const prevFilterComponent = this._SiteMenuComponent;

    this._SiteMenuComponent = new SiteMenu(choosenFilter, this._filterModel.getFilter());
    this._SiteMenuComponent.setFilterClick(this._handleFilterTypeChange);

    if (prevFilterComponent === null) {
      render(this._container, this._SiteMenuComponent);
      return;
    }
    replace(this._SiteMenuComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  _handlerFromModel() {
    this.init();
  }

  _handlerFilterClick(updateType, filterType) {
    this._filterModel.set(updateType, filterType);
  }

  _getFilters() {
    const films = this._filmsModel.getFilms();

    return [
      {
        type: FilterType.ALL,
        filterName: 'all',
        count: filters[FilterType.ALL](films).length,
      },
      {
        type: FilterType.WATCHLIST,
        filterName: 'watchlist',
        count: filters[FilterType.WATCHLIST](films).length,
      },
      {
        type: FilterType.HISTORY,
        filterName: 'history',
        count: filters[FilterType.HISTORY](films).length,
      },
      {
        type: FilterType.FAVORITES,
        filterName: 'favorites',
        count: filters[FilterType.FAVORITES](films).length,
      },
    ];
  }

  // старое
  // update(films = []) {
  //   if (this._SiteMenuComponent != null) {
  //     const state = this._getFilterState(films);
  //     remove(this._SiteMenuComponent);
  //     this._SiteMenuComponent = new SiteMenu(state.favoritFilm, state.watchedFilm, state.futureFilm);
  //     render(this._container, this._SiteMenuComponent, RenderPosition.AFTERBEGIN);
  //   }
  // }

  // _getFilterState(films) {
  //   const favoritFilm = films.filter((film) => film.isFavorit).length;
  //   const watchedFilm = films.filter((film) => film.isWatched).length;
  //   const futureFilm = films.filter((film) => film.isFutureFilm).length;

  //   return {
  //     favoritFilm,
  //     watchedFilm,
  //     futureFilm,
  //   };
  // }

  // клики

  // _renderFilter() {
  //   this._SiteMenuComponent.setFilterClick(this._handleFilterTypeChange);
  // }

  _handleFilterTypeChange(type) {
    if (this._activeFilter === type) {
      return;
    }
    this._activeFilter = type;
  }
}
export { MenuPresenter };
