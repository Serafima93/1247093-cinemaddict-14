import Observer from '../utils/observer.js';

export default class Films extends Observer {
  constructor() {
    super();
    this._films = [];
  }

  setFilms(films) {
    this._films = films.slice();
    this._dafaultFilms = films.slice();
  }

  getFilms() {
    return this._films;
  }

  getDefaultFilms() {
    return this._dafaultFilms;
  }

  updateFilm(updateType, update) {
    const index = this._films.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting film');
    }

    this._films = [
      ...this._films.slice(0, index),
      update,
      ...this._films.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  static adaptToClient(film) {
    const adaptedFilm = Object.assign(
      {},
      film,
      {
        poster: film.film_info.poster,
        title: film.film_info.title,
        originalName: film.film_info.alternative_title,
        description: film.film_info.description,
        director: film.film_info.director,
        screenwriters: film.film_info.writers,
        actors: film.film_info.actors,
        rating: film.film_info.total_rating,
        productionYear: film.film_info.release.date,
        country: film.film_info.release.release_country,

        timeContinue: film.film_info.runtime,
        genres: film.film_info.genre,
        ageRate: film.film_info.age_rating,
        userDetails: {
          isFutureFilm: film.user_details.watchlist,
          isFavorit: film.user_details.favorite,
          isWatched: film.user_details.already_watched,
          watchedDate: film.user_details.watching_date,
        },
      },
    );

    // Ненужные ключи мы удаляем
    delete adaptedFilm.user_details;
    delete adaptedFilm.film_info;

    return adaptedFilm;
  }

  static adaptToServer(task) {
    const adaptedTask = Object.assign(
      {},
      task,
      {
        'due_date': task.dueDate instanceof Date ? task.dueDate.toISOString() : null, // На сервере дата хранится в ISO формате
        'is_archived': task.isArchive,
        'is_favorite': task.isFavorite,
        'repeating_days': task.repeating,
      },
    );

    // Ненужные ключи мы удаляем
    delete adaptedTask.dueDate;
    delete adaptedTask.isArchive;
    delete adaptedTask.isFavorite;
    delete adaptedTask.repeating;

    return adaptedTask;
  }
}
