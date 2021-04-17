// import { SiteMenu } from '../view/menu.js';
// import { UserProfile } from '../view/user.js';
import { FilmList } from '../view/film-list-section';
import { EmptyWrap } from '../view/empty';

import { FilmCard } from '../view/film-card.js';
import { ShowMoreButton } from '../view/button-show-more.js';
import { PopUp } from '../view/pop-up-information.js';
import { FooterStatistic } from '../view/footer.js';
import { render, replaceChild, remove } from '../utils/utils-render.js';

const FILMS_MAX_COUNT = 20;
// const FILMS_MIN_COUNT = 2;
const FILM_COUNT_PER_STEP = 5;


class FilmBoard {
  constructor(boardContainer) {
    this._boardContainer = boardContainer;

    // то что не меняется?
    this._boardComponent = new FilmList();  // но как действовать если тут параметры?
    // this._sortComponent = new Sort(); - надо создать
    // this._filmUserComponent = new UserProfile(); - это из хедера
    this._noFilmsComponent = new EmptyWrap();
  }

  init(films) {
    this._films = films.slice();

    // в классе рисуем контейнер
    render(this._boardContainer, this._boardComponent);
    // в контейнере рисуем меню и юзера.
    // Но как это сделать если юзер находится в хедере, а меню передаются параметры?
    render(this._boardComponent, this._filmUserComponent);


    this._renderFilmBoard();
  }

  _renderSort() {
    // Метод для рендеринга сортировки
  }

  // _renderMenu() {
  //   const favoritFilm = this._films.filter((film) => film.isFavorit).length;
  //   const watchedFilm = this._films.filter((film) => film.isWatched).length;
  //   const futureFilm = this._films.filter((film) => film.futureFilm).length;

  //   render(this._boardComponent, new SiteMenu(favoritFilm, watchedFilm, futureFilm));
  // }

  _renderPopUp(film) {
    const popupElement = new PopUp(film);

    replaceChild(this._boardComponent, popupElement, true);

    const popupPlace = this._boardComponent.querySelector('.film-details__top-container');
    popupPlace.classList.add('hide-overflow');

    const removePopup = () => {
      replaceChild(this._boardComponent, popupElement, false);
      popupPlace.classList.remove('hide-overflow');
    };

    const onEscKeyDown = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        removePopup();
        document.removeEventListener('keydown', onEscKeyDown);
      }
    };

    popupElement.setEditClickHandler(() => {
      removePopup();
    });
    document.addEventListener('keydown', onEscKeyDown);
  }

  _renderFilmListner(film, filmPopUp) {
    // const addListenersOnFilm = (film, filmPopUp) => {
    film.setEditClickHandler(() => {
      this._renderPopUp(filmPopUp);
    });
    // };
  }

  _renderFilms() {
    const filmCardContainers = document.querySelectorAll('.films-list__container');

    // Метод для рендеринга N-фильмов за раз
    for (let i = 0; i < Math.min(this._films.length, FILM_COUNT_PER_STEP); i++) {
      const film = new FilmCard(this._films[i]);
      render(filmCardContainers[0], film); // что делать вот с такими кусками кода?
      // addListenersOnFilm(film, this._films[i]);
      this._renderFilmListner(film, this._films[i]);
    }
  }

  _renderNoFilms() {
    render(this._boardContainer, this._noFilmsComponent);
  }

  _renderLoadMoreButton() {
    const buttonPlace = this._boardComponent.querySelector('.films-list');

    let renderedFilmCount = FILM_COUNT_PER_STEP;
    const loadMoreButtonComponent = new ShowMoreButton();
    render(buttonPlace, loadMoreButtonComponent);

    loadMoreButtonComponent.setClickHandler(() => {
      this._boardFilms
        .slice(renderedFilmCount, renderedFilmCount + FILM_COUNT_PER_STEP)
        .forEach((film) => {
          const newFilm = new FilmCard(film);
          // render(filmCardContainers[0], newFilm);
          this._renderFilmListner(newFilm, film);
          // addListenersOnFilm(newFilm, film);
        });
      renderedFilmCount += FILM_COUNT_PER_STEP;
      if (renderedFilmCount >= this._boardFilms.length) {
        remove(loadMoreButtonComponent);
      }
    });
  }

  _renderFilmList() {
    this._renderFilms();

    if (this._boardFilms.length > FILM_COUNT_PER_STEP) {
      this._renderLoadMoreButton();
    }
  }

  _renderFilmFooter() {
    render(this._boardComponent, new FooterStatistic(FILMS_MAX_COUNT));
  }

  _renderFilmBoard() {
    if (FILMS_MAX_COUNT === 0) {
      this._renderNoFilms();
      const filmRemove = document.querySelector('.sort');
      filmRemove.classList.add('visually-hidden');

    } else {
      this._renderSort(); // запускаем несделанную пока сортировку
      render(this._boardContainer, this._boardComponent); // отрисовываем сам контейнер new FilmList()
    }
    // this. _renderMenu();
    // this._renderFilmList();
    this._renderFilmFooter();
  }
}

export { FilmBoard };
