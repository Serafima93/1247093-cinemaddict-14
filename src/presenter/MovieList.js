import { FilmList } from '../view/film-list-section';
import { EmptyWrap } from '../view/empty';
import { Sort } from '../view/sort';
import { FilmCard } from '../view/film-card.js';
import { ShowMoreButton } from '../view/button-show-more.js';
import { PopUp } from '../view/pop-up-information.js';
/*

 */
import { render, emersion, remove } from '../utils/utils-render.js';
import { FILMS_EXTRA_SECTION, FILM_COUNT_PER_STEP } from '../utils/utils-constans.js';

// import { updateItem } from '../utils/utils-common.js';
/*

 */
import { FooterStatisticPresenter } from './footer.js';
import { UserProfilePresenter } from './user.js';
import { MenuPresenter } from './menu.js';


const siteFooterElement = document.querySelector('.footer__statistics');
const siteHeaderElement = document.querySelector('.header');
const bodyElement = document.querySelector('body');

const Mode = {
  DEFAULT: 'DEFAULT',
  POPUP: 'POPUP',
};

class FilmBoard {
  constructor(boardContainer) {
    this._boardContainer = boardContainer;
    this._renderedFilmCount = FILM_COUNT_PER_STEP;

    this._filmListComponent = new FilmList();
    this._noFilmsComponent = new EmptyWrap();
    this._sortComponents = new Sort();
    this._loadMoreButtonComponent = new ShowMoreButton();

    this._handleLoadMoreButtonClick = this._handleLoadMoreButtonClick.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._onEscKeyDown = this._onEscKeyDown.bind(this);

    this._mode = Mode.DEFAULT;
    this._popupComponent = null;
  }

  init(films) {
    this._films = films;

    this._filmPresenter = {};
    this._renderFilmBoard();
  }

  _renderFilmBoard() {
    this._renderUserPresenter();
    this._renderSiteMenuPresenter(this._films);
    // this._SiteMenuPresenter.init(this._films);


    if (this._films.length) {
      this._renderContainers();
    } else {
      this._renderNoFilms();
    }
    this._renderFooterStatisticPresenter(this._films.length);
  }

  _renderContainers() {
    render(this._boardContainer, this._sortComponents); // отрисовка поля для послд. выбора сортировки фильмов
    render(this._boardContainer, this._filmListComponent); // отрисовываем сам контейнер new FilmList()
    this._renderFilmList();
    this._renderFilmAdditionalList();
  }

  _renderFilmList() {
    this._renderFilmsMain();

    if (this._films.length > FILM_COUNT_PER_STEP) {
      this._renderLoadMoreButton();
    }
  }

  _renderFilmsMain() {
    const filmCardContainers = this._boardContainer.querySelector('.films-list__container--main');
    this._renderFilms(filmCardContainers, this._films.slice(0, this._renderedFilmCount));
  }

  _renderFilms(container, films) {
    for (let i = 0; i < films.length; i++) {
      const film = films[i];
      const filmView = new FilmCard(film);
      render(container, filmView);
      filmView.setEditClickHandler(() => {this._renderPopUp(film);});
      // filmView.setEditClickHandler(this._renderPopUp);


      // this._filmComponents[film.id] = filmView;
      filmView.setFavoriteClickHandler(() => { this._favoriteClickHandler(film); });
      // this._buttonsClickHandler(filmView);
    }
  }
  /*

   */

  _favoriteClickHandler(film) {
    const newFilm = Object.assign(
      {},
      film,
      { isFavorit: !film.isFavorit },
    );
    const oldFilm = this._films.find((item) => item.id === film.id); // находим среди всех фильмов эту карточку
    const index = this._films.indexOf(oldFilm);
    if (index !== -1) {
      this._films[index] = newFilm;
    }
    // update menu
    // this._SiteMenuPresenter.update(this._films);
    // replace();

    this._renderSiteMenuPresenter(this._films);

    // // update film card
    // this._clearFilmList();
    // this._renderFilmList();
    // const filmView = this._filmComponents[film.id]
    // if (filmView) {
    //   replaceChild();
    // }
  }

  _clearFilmList() {
    for (let i = 0; this._films.length; i++) {
      const film = this._films[i];
      const filmView = this._filmComponents[film.id];
      if (filmView) {
        filmView.remove();
      }
    }
  }

  _updateMoviesList() {
    this._clearFilmList();
    this._renderFilmList();
  }
  /*

   */
  _renderLoadMoreButton() {
    const buttonPlace = this._boardContainer.querySelector('.films-list');
    render(buttonPlace, this._loadMoreButtonComponent);
    this._loadMoreButtonComponent.setClickHandler(this._handleLoadMoreButtonClick);
  }

  _handleLoadMoreButtonClick() {
    const filmCardContainers = this._boardContainer.querySelector('.films-list__container--main');
    this._films
      .slice(this._renderedFilmCount, this._renderedFilmCount + FILM_COUNT_PER_STEP)
      .forEach((film) => {
        const newFilm = new FilmCard(film);
        render(filmCardContainers, newFilm);

        newFilm.setEditClickHandler(() => { this._renderPopUp(film); });
        newFilm.setFavoriteClickHandler(() => { this._favoriteClickHandler(film); });

      });
    this._renderedFilmCount += FILM_COUNT_PER_STEP;
    if (this._renderedFilmCount >= this._films.length) {
      remove(this._loadMoreButtonComponent);
    }
  }
  /*

   */
  _renderPopUp(film) {
    this._renderSiteMenuPresenter(this._films);
    this._mode === Mode.POPUP;

    const prevPopupComponent = this._popupComponent;
    this._popupComponent = new PopUp(film);

    this._popupComponent.setCloseBtnClickHandler(() => {
      this._handleCloseButtonClick();
    });

    if (prevPopupComponent === null) {
      render(bodyElement, this._popupComponent);
      bodyElement.classList.add('hide-overflow');
      document.addEventListener('keydown', this._onEscKeyDown);

      return;
    }

    if (this._mode === Mode.POPUP) {
      emersion(this._boardContainer, this._popupComponent);
      bodyElement.classList.add('hide-overflow');
      document.addEventListener('keydown', this._onEscKeyDown);
    }
  }

  _removePopup() {
    // if (this._mode !== Mode.DEFAULT) {
    remove(this._popupComponent);
    this._popupComponent = null;
    this._mode = Mode.DEFAULT;
    // }
  }

  _onEscKeyDown(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._removePopup();
      bodyElement.classList.remove('hide-overflow');

      document.removeEventListener('keydown', this._onEscKeyDown);
    }
  }

  _handleCloseButtonClick() {
    this._removePopup();
    bodyElement.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this._onEscKeyDown);
  }

  _handleModeChange() {
    Object
      .values(this._films)
      .forEach((film) => film._removePopup());
  }
  /*

   */

  _renderFilmAdditionalList() {

    const filmCardContainerMostRate = this._boardContainer.querySelector('.films-list__container--rating');
    const filmCardContainerMostComments = this._boardContainer.querySelector('.films-list__container--comments');

    /* функция для самых рейтинговых фильмов  */
    const rateFilm = this._films.slice().sort((a, b) => b.rating - a.rating);
    /* самые коментированные фильмы */
    const commentsFilm = this._films.slice().sort((a, b) => b.comments.length - a.comments.length);

    this._renderFilms(filmCardContainerMostRate, rateFilm.slice(0, FILMS_EXTRA_SECTION));
    this._renderFilms(filmCardContainerMostComments, commentsFilm.slice(0, FILMS_EXTRA_SECTION));
  }

  _renderNoFilms() {
    render(this._boardContainer, this._noFilmsComponent);
  }

  _renderSiteMenuPresenter(films) {
    const SiteMenuPresenter = new MenuPresenter(this._boardContainer);
    SiteMenuPresenter.init(films);
  }

  _renderUserPresenter() {
    const userPresenter = new UserProfilePresenter(siteHeaderElement);
    userPresenter.init();
  }

  _renderFooterStatisticPresenter(totalFilms) {
    const footerStatisticPresenter = new FooterStatisticPresenter(siteFooterElement);
    footerStatisticPresenter.init(totalFilms);
  }

}
export { FilmBoard };
