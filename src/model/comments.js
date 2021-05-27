import dayjs from 'dayjs';
import Observer from '../utils/observer.js';

export default class Comments extends Observer {
  constructor() {
    super();
    this._comments = [];
    this._filmId = null;
  }

  setComments(updateType, comments) {
    this._comments = comments.slice();

    this._notify(updateType);
  }

  getComments() {
    return this._comments;
  }

  deleteComment(updateType, comment, film) {
    const index = this._comments.findIndex((item) => item.id === comment.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting item');
    }

    this._comments = [
      ...this._comments.slice(0, index),
      ...this._comments.slice(index + 1),
    ];

    this._notify(updateType, this._comments, film);
  }

  addComment(updateType, update, film) {
    this._comments = update;

    this._notify(updateType, update, film);
  }

  static adaptToClient(data) {
    const comments = data.comments ? data.comments : data;

    const adaptedComments = comments.map((comment) => {
      const adaptedComment = Object.assign(
        {},
        comment,
        {
          date: dayjs(comment.date).valueOf(),
        });
      return adaptedComment;
    });

    return adaptedComments;
  }

  static adaptToServer(comments) {
    const adaptedComments = Object.assign(
      {},
      comments);

    return adaptedComments;
  }
}
