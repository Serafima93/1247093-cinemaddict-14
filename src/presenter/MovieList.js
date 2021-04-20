import { SiteMenu } from '../view/menu.js';
import { FilmList } from '../view/film-list-section';
import { EmptyWrap } from '../view/empty';
import { Sort } from '../view/sort';


import { FilmCard } from '../view/film-card.js';
import { ShowMoreButton } from '../view/button-show-more.js';
import { PopUp } from '../view/pop-up-information.js';
import { render, replaceChild, remove } from '../utils/utils-render.js';

const FILMS_MAX_COUNT = 20;
const FILMS_MIN_COUNT = 2;
const FILM_COUNT_PER_STEP = 5;

class FilmBoard {
  constructor(boardContainer) {
    this._boardContainer = boardContainer;

    this._filmPresenter = {};
    // this._filmPresenter[this._films[0].id]; - фильмы по айди - но у меня сразу все фильмы. Вставляем в цикл?

    this._boardComponent = new FilmList();

    this._noFilmsComponent = new EmptyWrap();
    this._sortComponents = new Sort();
    this._loadMoreButtonComponent = new ShowMoreButton();

    this._renderedFilmCount = FILM_COUNT_PER_STEP;
    this._handleLoadMoreButtonClick = this._handleLoadMoreButtonClick.bind(this);
  }


  init(films) {
    this._films = films.slice();

    // в классе рисуем контейнер или как?
    // render(this._boardContainer, this._boardComponent);

    this._renderFilmBoard();
  }

  _renderSort() {
    // Метод для рендеринга сортировки
    render(this._boardContainer, this._sortComponents);
  }

  _renderMenu(films) {
    const favoritFilm = films.filter((film) => film.isFavorit).length;
    const watchedFilm = films.filter((film) => film.isWatched).length;
    const futureFilm = films.filter((film) => film.futureFilm).length;

    render(this._boardContainer, new SiteMenu(favoritFilm, watchedFilm, futureFilm));
  }


  _clearTaskList() { // мне нужно вызвать его в начале цикла следующего метода при клике?
    Object
      .values(this._boardComponent) //
      .forEach((presenter) => presenter.remove(this._boardComponent)); //   подходит ли мне? у меня же уже список
    this._filmPresenter = {};
    this._renderedFilmCount = FILM_COUNT_PER_STEP;
    remove(this._loadMoreButtonComponent);
  }

  _buttonsClickHandler(filmView) {
    filmView.favoriteClickHandler(() => {
      // const filmIdHistoryNumber = filmView._film.id;
      filmView._film.isFavorit = true; // создаю на фильме флаг - верно
    });
  }

  _renderFilms(container, films, count) {
    for (let i = 0; i < this._films.slice(0, count).length; i++) {
      const filmView = new FilmCard(films[i]);
      render(container, filmView);
      this._renderFilmListner(filmView, films[i]);
      this._buttonsClickHandler(filmView);
    }
  }

  _renderFilmsMain() {
    const filmCardContainers = this._boardContainer.querySelector('#main-container');
    this._renderFilms(filmCardContainers, this._films, FILM_COUNT_PER_STEP);
  }

  _renderPopUp(film) {
    const popupElement = new PopUp(film);

    replaceChild(this._boardContainer, popupElement, true);

    const popupPlace = this._boardContainer.querySelector('.film-details__top-container');
    popupPlace.classList.add('hide-overflow');

    const removePopup = () => {
      replaceChild(this._boardContainer, popupElement, false);
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
    film.setEditClickHandler(() => {
      this._renderPopUp(filmPopUp);
    });
  }

  _handleLoadMoreButtonClick() {
    const filmCardContainers = this._boardContainer.querySelector('#main-container');
    this._films
      .slice(this._renderedFilmCount, this._renderedFilmCount + FILM_COUNT_PER_STEP)
      .forEach((film) => {
        const newFilm = new FilmCard(film);
        render(filmCardContainers, newFilm);
        this._renderFilmListner(newFilm, film);

        this._buttonsClickHandler(newFilm);
      });
    this._renderedFilmCount += FILM_COUNT_PER_STEP;
    if (this._renderedFilmCount >= this._films.length) {
      remove(this._loadMoreButtonComponent);
    }
  }

  _renderLoadMoreButton() {
    const buttonPlace = this._boardContainer.querySelector('.films-list');
    render(buttonPlace, this._loadMoreButtonComponent);
    this._loadMoreButtonComponent.setClickHandler(this._handleLoadMoreButtonClick);
  }

  _renderFilmList() {
    this._renderFilmsMain();

    if (this._films.length > FILM_COUNT_PER_STEP) {
      this._renderLoadMoreButton();
    }
  }

  _renderFilmAdditionalList() {

    const filmCardContainerMostRate = this._boardContainer.querySelector('#rating');
    const filmCardContainerMostComments = this._boardContainer.querySelector('#comments');

    /* функция для самых рейтинговых фильмов  */
    const rateFilm = this._films.slice().sort((a, b) => b.rating - a.rating);
    /* самые коментированные фильмы */
    const commentsFilm = this._films.slice().sort((a, b) => b.comments.length - a.comments.length);

    this._renderFilms(filmCardContainerMostRate, rateFilm, FILMS_MIN_COUNT);
    this._renderFilms(filmCardContainerMostComments, commentsFilm, FILMS_MIN_COUNT);

    // for (let i = 0; i < FILMS_MIN_COUNT; i++) {
    //   const filmRate = new FilmCard(rateFilm[i]);
    //   const filmComments = new FilmCard(commentsFilm[i]);

    //   render(filmCardContainerMostRate, filmRate);
    //   render(filmCardContainerMostComments, filmComments);
    //   this._renderFilmListner(filmRate, rateFilm[i]);
    //   this._renderFilmListner(filmComments, commentsFilm[i]);

    //   this._buttonsClickHandler(filmRate);
    //   this._buttonsClickHandler(filmComments); // добавить удаление полных дублей - отмена нажатия дважды
    // }
  }

  _renderNoFilms() {
    render(this._boardContainer, this._noFilmsComponent);
  }

  _renderFilmBoard() {
    // render(this._boardContainer,this._boardComponent);
    // рендер сортировки. Рендер меню. Рендер самих фильмов. Рендер мини контейнеров.


    this._renderMenu(this._films); // запуск меню. Тут передается постоянно с полными данными

    if (FILMS_MAX_COUNT === 0) {
      this._renderNoFilms();
      const filmRemove = this._boardContainer.querySelector('.sort');
      filmRemove.classList.add('visually-hidden');

    } else {
      this._renderSort();
      render(this._boardContainer, this._boardComponent); // отрисовываем сам контейнер new FilmList()
    }
    this._renderFilmList();
    this._renderFilmAdditionalList();

  }
}
export { FilmBoard };
