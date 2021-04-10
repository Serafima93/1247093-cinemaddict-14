import { createSiteElement } from '../utils.js';

const createSiteMenuTemplate = (count, watched, futureFilm) => {
  return `
  <div>
  <nav class="main-navigation">
    <div class="main-navigation__items">
      <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
      <a href="#watchlist" class="main-navigation__item">Watchlist <span class="main-navigation__item-count">${count}</span></a>
      <a href="#history" class="main-navigation__item">History <span class="main-navigation__item-count">${watched}</span></a>
      <a href="#favorites" class="main-navigation__item">Favorites <span class="main-navigation__item-count">${futureFilm}</span></a>
    </div>
    <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>

  <ul class="sort">
  <li><a href="#" class="sort__button sort__button--active">Sort by default</a></li>
  <li><a href="#" class="sort__button">Sort by date</a></li>
  <li><a href="#" class="sort__button">Sort by rating</a></li>
  </ul>
  </section> </div>`;
};


class SiteMenu {
  constructor(favoritFilm, watchedFilm, futureFilm) {
    this._count = favoritFilm;
    this._watched = watchedFilm;
    this._future = futureFilm;
    this._element = null;
  }

  getTemplate() {
    return createSiteMenuTemplate(this._count, this._watched, this._future);
  }

  getElement() {
    if (!this._element) {
      this._element = createSiteElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}

export { SiteMenu };
