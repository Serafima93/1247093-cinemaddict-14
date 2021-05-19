import SiteMenu from '../view/menu.js';
import { replace, render, remove, RenderPosition } from '../utils/render';
import { FilterType, UpdateType } from '../utils/constans.js';
import { UserFilters } from '../utils/filter.js';

export default class MenuPresenter {
  constructor(container, filmsModel, filterModel) {
    this._container = container;
    this._filmsModel = filmsModel;
    this._filterModel = filterModel;
    this._siteMenuComponent = null;
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleFilterTypeChange = this._handleFilterTypeChange.bind(this);
    this._filmsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {
    const choosenFilter = this._getFilters();
    const prevFilterComponent = this._siteMenuComponent;

    this._siteMenuComponent = new SiteMenu(choosenFilter, this._filterModel.getFilter());
    this._siteMenuComponent.setFilterClick(this._handleFilterTypeChange);

    if (prevFilterComponent === null) {
      render(this._container, this._siteMenuComponent, RenderPosition.AFTERBEGIN);
      return;
    }
    replace(this._siteMenuComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  _handleModelEvent() {
    this.init();
  }

  _handleFilterTypeChange(filterType) {
    if (this._filterModel.getFilter() === filterType) {
      return;
    }
    this._filterModel.setFilter(UpdateType.MAJOR, filterType);
  }

  _getFilters() {
    const films = this._filmsModel.getFilms();

    return [
      {
        type: FilterType.ALL,
        filterName: 'all',
        count: UserFilters[FilterType.ALL](films).length,
      },
      {
        type: FilterType.WATCHLIST,
        filterName: 'watchlist',
        count: UserFilters[FilterType.WATCHLIST](films).length,
      },
      {
        type: FilterType.HISTORY,
        filterName: 'history',
        count: UserFilters[FilterType.HISTORY](films).length,
      },
      {
        type: FilterType.FAVORITES,
        filterName: 'favorites',
        count: UserFilters[FilterType.FAVORITES](films).length,
      },
    ];
  }
}
