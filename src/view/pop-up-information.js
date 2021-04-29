import dayjs from 'dayjs';
import { Abstract } from './abstract.js';

const createCommentsList = (comments) => {
  const htmlPart = comments.map(createComment).join('');
  return `<div class="film-details__bottom-container">
  <section class="film-details__comments-wrap">
    <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>
    <ul class="film-details__comments-list">${htmlPart}</ul>
    <div class="film-details__new-comment">
      <div class="film-details__add-emoji-label"></div>
      <label class="film-details__comment-label">
        <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
      </label>
      <div class="film-details__emoji-list">
        <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile">
        <label class="film-details__emoji-label" for="emoji-smile">
          <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
        </label>
        <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
        <label class="film-details__emoji-label" for="emoji-sleeping">
          <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
        </label>
        <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke">
        <label class="film-details__emoji-label" for="emoji-puke">
          <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
        </label>
        <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
        <label class="film-details__emoji-label" for="emoji-angry">
          <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
        </label>
      </div>
    </div>
  </section>
</div>

`;
};

const createComment = (comment) => {
  const { text, author, commentDate, emoji } = comment;


  const date = commentDate !== null
    ? dayjs(commentDate).format('YYYY/MM/DD h:mm A')
    : '';

  return ` <li class="film-details__comment">
  <span class="film-details__comment-emoji">
    <img src="${emoji}" width="55" height="55" alt="emoji-smile">
  </span>
  <div>
    <p class="film-details__comment-text">${text}</p>
    <p class="film-details__comment-info">
      <span class="film-details__comment-author">${author}</span>
      <span class="film-details__comment-day">${date}</span>
      <button class="film-details__comment-delete">Delete</button>
    </p>
  </div>
</li>
`;
};

const createGenre = (genre) => `<span class="film-details__genre">${genre}</span>`;

const createPopUp = (films) => {
  const { title, description, director, comments, screenwriters, actors, ageRate, poster, rating, productionYear, timeContinue, country } = films;


  const { hours, minutes } = timeContinue.$d;

  const date = productionYear !== null
    ? dayjs(productionYear).format('DD MMMM YYYY')
    : '';

  const genres = films.genres.map(createGenre).join();

  const commentsResult = createCommentsList(comments);
  return `<section class="film-details">
  <form class="film-details__inner" action="" method="get">
    <div class="film-details__top-container">
      <div class="film-details__close">
        <button class="film-details__close-btn" type="button">close</button>
      </div>
      <div class="film-details__info-wrap">
        <div class="film-details__poster">
          <img class="film-details__poster-img" src='${poster}' alt="">
          <p class="film-details__age">${ageRate}</p>
        </div>
        <div class="film-details__info">
          <div class="film-details__info-head">
            <div class="film-details__title-wrap">
              <h3 class="film-details__title">${title}</h3>
              <p class="film-details__title-original">${title}</p>
            </div>
            <div class="film-details__rating">
              <p class="film-details__total-rating">${rating}</p>
            </div>
          </div>
          <table class="film-details__table">
            <tbody>
              <tr class="film-details__row">
                <td class="film-details__term">Director</td>
                <td class="film-details__cell">${director}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Writers</td>
                <td class="film-details__cell">${screenwriters}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Actors</td>
                <td class="film-details__cell">${actors}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Release Date</td>
                <td class="film-details__cell">${date}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Runtime</td>
                <td class="film-details__cell">${hours} h ${minutes} min</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Country</td>
                <td class="film-details__cell">${country}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Genres</td>
                <td class="film-details__cell">
                  ${genres}
              </tr>
            </tbody>
          </table>
          <p class="film-details__film-description">
            ${description}
          </p>
        </div>
      </div>
      <section class="film-details__controls">
        <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist">
        <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to
          watchlist</label>

        <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched">
        <label for="watched" class="film-details__control-label film-details__control-label--watched">Already
          watched</label>

        <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite">
        <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to
          favorites</label>
      </section>
    </div>
    ${commentsResult}
  </form>
  ` ;
};


class PopUp extends Abstract {
  constructor(films) {
    super();
    this._filters = films;
    this._element = null;
    this._closeClickHandler = this._closeClickHandler.bind(this);

    this._editClickHandlerPopupFavorite = this._editClickHandlerPopupFavorite.bind(this);
    this._editClickHandlerPopupWatched = this._editClickHandlerPopupWatched.bind(this);
    this._editClickHandlerPopupFuture = this._editClickHandlerPopupFuture.bind(this);
  }

  getTemplate() {
    return createPopUp(this._filters);
  }


  _editClickHandlerPopupFavorite(evt) {
    evt.preventDefault();
    this._callback.favorite(this._film);
    this.getElement().querySelector('.film-details__control-label--favorite').classList.add('sort__button--active');
  }

  _editClickHandlerPopupWatched(evt) {
    evt.preventDefault();
    this._callback.watched(this._film);
    this.getElement().querySelector('.film-details__control-label--watched').classList.add('sort__button--active');
  }

  _editClickHandlerPopupFuture(evt) {
    evt.preventDefault();
    this._callback.future(this._film);
    this.getElement().querySelector('.film-details__control-label--watchlist').classList.add('sort__button--active');
  }

  _closeClickHandler(evt) {
    evt.preventDefault();
    this._callback.closeClick();
  }

  setCloseBtnClickHandler(callback) {
    this._callback.closeClick = callback;
    this.getElement().querySelector('.film-details__close-btn').addEventListener('click', this._closeClickHandler);
  }

  setFavoritePopupClickHandler(callback) {
    this._callback.favorite = callback;
    this.getElement().querySelector('.film-details__control-label--favorite').addEventListener('click', this._editClickHandlerPopupFavorite);
  }

  setWatchedPopupClickHandler(callback) {
    this._callback.watched = callback;
    this.getElement().querySelector('.film-details__control-label--watched').addEventListener('click', this._editClickHandlerPopupWatched);
  }

  setFuturePopupClickHandler(callback) {
    this._callback.future = callback;
    this.getElement().querySelector('.film-details__control-label--watchlist').addEventListener('click', this._editClickHandlerPopupFuture);
  }
}

export { PopUp };
