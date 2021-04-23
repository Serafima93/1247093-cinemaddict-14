import { SiteMenu } from '../view/menu.js';
import { render } from '../utils/utils-render';

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
    const state = this._getFilterState(films);
    this._SiteMenuComponent.setValue(state.favoritFilm, state.watchedFilm, state.futureFilm);

    // replace child
    // replaceChild(...);
    // render(this._container, this._SiteMenuComponent);
  }

  _getFilterState(films) {
    const favoritFilm = films.filter((film) => film.isFavorit).length;
    const watchedFilm = films.filter((film) => film.isWatched).length;
    const futureFilm = films.filter((film) => film.futureFilm).length;

    return {
      favoritFilm,
      watchedFilm,
      futureFilm,
    };
  }
}
export { MenuPresenter };
