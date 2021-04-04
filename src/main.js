import { createSiteMenuTemplate } from './view/menu.js';
import { createUser } from './view/user.js';
import { filmListWrap, createFilmCard } from './view/film-card.js';
import { createShowMoreButton } from './view/button-show-more.js';
import { createPopUp, createCommentsList } from './view/pop-up-information.js';
import { createFooterStatistic } from './view/footer.js';

// моки
import { getRandomInteger } from './mock/utils.js';
import { generateFilm, generatePopUpFilm, generateGenre } from './mock/film.js';
import { generateFilmComment } from './mock/comments.js';


const FILMS_MAX_COUNT = 20;
const FILMS_MIN_COUNT = 2;
const FILM_COUNT_PER_STEP = 5;

const COMMENTS_MAX_COUNT = 5;


// создание функции рендеринга
const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const siteUserElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer__statistics');

// создание юзера

render(siteUserElement, createUser(), 'beforeend');

// создание меню

render(siteMainElement, createSiteMenuTemplate(), 'beforeend');

// создание списка фильмов

const films = new Array(FILMS_MAX_COUNT).fill().map(generateFilm);

render(siteMainElement, filmListWrap(), 'beforeend');

const filmCardContainers = document.querySelectorAll('.films-list__container');

for (let i = 0; i < Math.min(films.length, FILM_COUNT_PER_STEP); i++) {
  render(filmCardContainers[0], createFilmCard(films[i]), 'beforeend');
}

// кнопка

if (films.length > FILM_COUNT_PER_STEP) {
  let renderedFilmCount = FILM_COUNT_PER_STEP;

  render(filmCardContainers[0], createShowMoreButton(), 'beforeend');

  const showMoreButton = filmCardContainers[0].querySelector('.films-list__show-more');

  showMoreButton.addEventListener('click', (evt) => {
    evt.preventDefault();
    films
      .slice(renderedFilmCount, renderedFilmCount + FILM_COUNT_PER_STEP)
      .forEach((film) => {
        render(filmCardContainers[0], createFilmCard(film), 'beforeend');

      });

    renderedFilmCount += FILM_COUNT_PER_STEP;

    // не понимаю как сдлеать чтобы удалялась кнопка и перерисовывалась!
    // showMoreButton.remove();
    // render(filmCardContainers[0], createShowMoreButton(), 'beforeend');

    if (renderedFilmCount >= films.length) {
      showMoreButton.remove();
    }

  });
}

// дополнительные фильмы
for (let i = 0; i < FILMS_MIN_COUNT; i++) {
  render(filmCardContainers[1], createFilmCard(films[i]), 'beforeend');
  render(filmCardContainers[2], createFilmCard(films[i]), 'beforeend');
}


// создаю попап. Почему нужен цикл? и почему так createPopUp(popups) - не работает?
const popups = new Array(1).fill().map(generatePopUpFilm);
for (let i = 0; i < 1; i++) {
  render(siteMainElement, createPopUp(popups[i]), 'beforeend');
}

// создаю функцию жанра фильмов. можно ли оставить так? Или как ее вынести?
const createFilmGenres = () => {
  const genreArray = generateGenre();
  const genres = document.querySelector('.film-details__cell--genres');
  genres.innerHTML = '';
  genreArray.forEach((item) => {
    const newElement = document.createElement('span');
    newElement.classList.add('film-details__genre');
    newElement.textContent = item;
    genres.appendChild(newElement);
  });
};
createFilmGenres();


// создаю комменты

const comments = new Array(COMMENTS_MAX_COUNT).fill().map(generateFilmComment);
const randomCommentsCount = comments.slice(getRandomInteger(0, COMMENTS_MAX_COUNT));

for (let i = 0; i < randomCommentsCount.length; i++) {
  render(siteMainElement, createCommentsList(randomCommentsCount[i]), 'beforeend');
}

// счетчик коментов

const createCommentsNumber = () => {
  const commentsNumber = randomCommentsCount.length.toString();
  const number = document.querySelector('.film-details__comments-count');
  number.textContent = commentsNumber;
};

createCommentsNumber();

// создание счетчика на футере

render(siteFooterElement, createFooterStatistic(FILMS_MAX_COUNT), 'beforeend');

