import { Abstract } from './abstract.js';

const createSiteMenuTemplate = (favorite, watched, futureFilm) => {
  return ` <div> <nav class="main-navigation">
    <div class="main-navigation__items">
      <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
      <a href="#watchlist" class="main-navigation__item">Watchlist <span class="main-navigation__item-count">${futureFilm}</span></a>
      <a href="#history" class="main-navigation__item">History <span class="main-navigation__item-count">${watched}</span></a>
      <a href="#favorites" class="main-navigation__item">Favorites <span class="main-navigation__item-count">${favorite}</span></a>
    </div>
    <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>
  </section> </div>`;
};

class SiteMenu extends Abstract {
  constructor(favoritFilm = 0, watchedFilm = 0, futureFilm = 0) {
    super();
    this._favorite = favoritFilm;
    this._watched = watchedFilm;
    this._future = futureFilm;
  }

  getTemplate() {
    return createSiteMenuTemplate(this._favorite, this._watched, this._future);
  }

  setValue(favoritFilm = 0, watchedFilm = 0, futureFilm = 0) {
    this._favorite = favoritFilm;
    this._watched = watchedFilm;
    this._future = futureFilm;
  }
}

export { SiteMenu };
