import Abstract from './abstract.js';

const createFilmListWrap = () => {
  return `<section class="films">
  <section class="films-list">
    <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
    <div class="films-list__container films-list__container--main">
    </div>
  </section>
  <section class="films-list films-list--extra">
    <h2 class="films-list__title">Top rated</h2>
    <div class="films-list__container films-list__container--rating"></div>
  </section>
  <section class="films-list films-list--extra">
    <h2 class="films-list__title">Most commented</h2>
    <div class="films-list__container films-list__container--comments"></div>
  </section>
  </section>`;
};

export default class FilmList extends Abstract {

  getTemplate() {
    return createFilmListWrap();
  }
}
