import dayjs from 'dayjs';
import Smart from './smart.js';
import { EmogiType } from '../utils/constans.js';
import { changeActiveStatus } from '../utils/common.js';
import he from 'he';

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
        <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="${EmogiType.SMILE}">
        <label class="film-details__emoji-label" for="emoji-smile">
          <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
        </label>
        <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="${EmogiType.SLEEP}">
        <label class="film-details__emoji-label" for="emoji-sleeping">
          <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
        </label>
        <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="${EmogiType.PUKE}">
        <label class="film-details__emoji-label" for="emoji-puke">
          <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
        </label>
        <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="${EmogiType.ANGRY}">
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
  const { text, author, commentDate, emoji, id } = comment;


  const date = commentDate !== null
    ? dayjs(commentDate).format('YYYY/MM/DD h:mm A')
    : '';

  return ` <li class="film-details__comment">
  <span class="film-details__comment-emoji">
    <img src="${emoji}" width="55" height="55" alt="emoji-smile">
  </span>
  <div>
    <p class="film-details__comment-text">${he.encode(text)}</p>
    <p class="film-details__comment-info">
      <span class="film-details__comment-author">${author}</span>
      <span class="film-details__comment-day">${date}</span>

      <button class="film-details__comment-delete"  data-id = "${id}"> Delete </button>
    </p>
  </div>
</li>
`;
};

const createGenre = (genre) => `<span class="film-details__genre">${genre}</span>`;

const createPopUp = (film) => {
  const { title, description, director, comments, screenwriters, actors, ageRate, poster, rating, productionYear, timeContinue, country } = film;


  const { hours, minutes } = timeContinue.$d;

  const date = productionYear !== null
    ? dayjs(productionYear).format('DD MMMM YYYY')
    : '';

  const genres = film.genres.map(createGenre).join();

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
        <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist ${film.isFutureFilm ? 'sort__button--active' : ''}">Add to
          watchlist</label>

        <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched">
        <label for="watched" class="film-details__control-label film-details__control-label--watched ${film.isWatched ? 'sort__button--active' : ''}">Already
          watched</label>

        <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite">
        <label for="favorite" class="film-details__control-label film-details__control-label--favorite ${film.isFavorit ? 'sort__button--active' : ''}">Add to
          favorites</label>
      </section>
    </div>
    ${commentsResult}
  </form>
  ` ;
};


export default class PopUp extends Smart {
  constructor(film, newComment) {
    super();
    this._data = film;
    this._filmComment = PopUp.parseFilmToData(newComment);

    this._closeClickHandler = this._closeClickHandler.bind(this);

    this._changePopUpFavoriteHandler = this._changePopUpFavoriteHandler.bind(this);
    this._changePopupWatchedHandler = this._changePopupWatchedHandler.bind(this);
    this._changePopupFutureHandler = this._changePopupFutureHandler.bind(this);

    this._descriptionInputHandler = this._descriptionInputHandler.bind(this);
    this._emojiChangeHandler = this._emojiChangeHandler.bind(this);

    this._sendNewCommentHandler = this._sendNewCommentHandler.bind(this);
    this._deleteCommentHandler = this._deleteCommentHandler.bind(this);

    this._setInnerHandlers();
  }

  getTemplate() {
    return createPopUp(this._data);
  }

  getEmojis() {
    return this.getElement().querySelector('.film-details__emoji-list');
  }

  getCommentField() {
    return this.getElement().querySelector('.film-details__comment-input');
  }

  _setInnerHandlers() {
    this.getCommentField().addEventListener('input', this._descriptionInputHandler);
    this.getEmojis().addEventListener('change', this._emojiChangeHandler);
    document.addEventListener('keydown', this._sendNewCommentHandler);
    this.getElement().querySelector('.film-details__comments-list').addEventListener('click', this._deleteCommentHandler);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setCloseBtnClickHandler(this._callback.closeClick);
  }

  reset(popUp) {
    this.updateData(
      this._filmComment.parseFilmToData(popUp),
    );
  }

  _descriptionInputHandler(evt) {
    evt.preventDefault();
    this.updateData({
      commentText: evt.target.value,
    }, true);
    this._filmComment.text = evt.target.value;
  }

  _emojiChangeHandler(evt) {
    evt.preventDefault();
    this.updateData({ emoji: evt.target.value }, true);
    const url = this._emojiChangePlaceHandler(evt.target.value);
    this._filmComment.emoji = url;
  }

  _emojiChangePlaceHandler(value) {
    const emojiPlace = this.getElement().querySelector('.film-details__add-emoji-label');
    const newElement = document.createElement('img');
    newElement.src = './images/emoji/' + value + '.png';
    newElement.setAttribute('style', 'width: 55px');
    emojiPlace.innerHTML = '';
    emojiPlace.appendChild(newElement);
    return newElement.src;
  }

  static parseFilmToData(film) {
    return Object.assign(
      {},
      film,
      {
        emoji: '',
        text: '',
      },
    );
  }

  _sendNewCommentHandler(evt) {
    const isRightKeys = (evt.ctrlKey || evt.metaKey) && evt.keyCode === 13;
    const isHasTextAndEmoji = !this._filmComment.emoji || !this._filmComment.text.trim();

    if (isRightKeys && !isHasTextAndEmoji) {
      this._callback.setSendNewComment(this._data, this._filmComment);
      const block = this.getElement();
      block.scrollTop = block.scrollHeight;
    }
  }

  setSendNewComment(callback) {
    this._callback.setSendNewComment = callback;
  }

  _deleteCommentHandler(evt) {
    if (!evt.target.classList.contains('film-details__comment-delete')) {
      return;
    }
    this._callback.deleteComment(this._data, evt.target.dataset.id);
    const block = this.getElement();
    block.scrollTop = block.scrollHeight;
  }

  setDeleteComment(callback) {
    this._callback.deleteComment = callback;
  }

  _changePopUpFavoriteHandler(evt) {
    evt.preventDefault();
    changeActiveStatus(evt.target, 'sort__button--active');
    this._callback.favorite(this._film);
  }

  _changePopupWatchedHandler(evt) {
    evt.preventDefault();
    changeActiveStatus(evt.target, 'sort__button--active');
    this._callback.watched(this._film);
  }

  _changePopupFutureHandler(evt) {
    evt.preventDefault();
    changeActiveStatus(evt.target, 'sort__button--active');
    this._callback.future(this._film);
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
    const favoriteFilms = this.getElement().querySelector('.film-details__control-label--favorite');
    favoriteFilms.addEventListener('click', this._changePopUpFavoriteHandler);
  }

  setWatchedPopupClickHandler(callback) {
    this._callback.watched = callback;
    const watchedFilms = this.getElement().querySelector('.film-details__control-label--watched');
    watchedFilms.addEventListener('click', this._changePopupWatchedHandler);
  }

  setFuturePopupClickHandler(callback) {
    this._callback.future = callback;
    const futureFilms = this.getElement().querySelector('.film-details__control-label--watchlist');
    futureFilms.addEventListener('click', this._changePopupFutureHandler);
  }
}

