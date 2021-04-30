import { SiteMenu } from '../view/menu.js';
import { render, remove, RenderPosition } from '../utils/utils-render';

class MenuPresenter {
  constructor(container) {
    this._container = container;
    this._SiteMenuComponent = null;
  }

  init(films = []) {
    const state = this._getFilterState(films);
    this._SiteMenuComponent = new SiteMenu(state.favoritFilm, state.watchedFilm, state.futureFilm);
    render(this._container, this._SiteMenuComponent);
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
}
export { MenuPresenter };
