import { SiteMenu } from '../view/menu.js';
import { replace, render, remove, RenderPosition } from '../utils/utils-render';
import { FilterType, UpdateType } from '../utils/utils-constans.js';
import { filters } from '../utils/utils-filter.js';

class MenuPresenter {
  constructor(container, filmsModel, filterModel) {
    this._container = container;
    this._filmsModel = filmsModel;
    this._filterModel = filterModel;

    this._SiteMenuComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleFilterTypeChange = this._handleFilterTypeChange.bind(this);

    this._filmsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {
    const choosenFilter = this._getFilters();
    const prevFilterComponent = this._SiteMenuComponent;

    this._SiteMenuComponent = new SiteMenu(choosenFilter, this._filterModel.getFilter());
    this._SiteMenuComponent.setFilterClick(this._handleFilterTypeChange);

    if (prevFilterComponent === null) {
      render(this._container, this._SiteMenuComponent, RenderPosition.AFTERBEGIN);
      return;
    }
    replace(this._SiteMenuComponent, prevFilterComponent);
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
}
export { MenuPresenter };
