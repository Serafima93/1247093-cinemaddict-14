import { SiteMenu } from '../view/menu.js';
import { render } from '../utils/utils-render';

class MenuProfilePresenter {
  constructor(container) {
    this._container = container;
    this._SiteMenuComponent = null;
  }

  init(favoritFilm, watchedFilm, futureFilm) {
    this._SiteMenuComponent = new SiteMenu(favoritFilm, watchedFilm, futureFilm);

    render(this._container, this._SiteMenuComponent);
  }
}
export { MenuProfilePresenter };
