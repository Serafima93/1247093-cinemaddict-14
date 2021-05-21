import Observer from '../utils/observer.js';
import dayjs from 'dayjs';

export default class Films extends Observer {
  constructor() {
    super();
    this._films = [];
    // this._defaultFilms = [];
  }

  setData(updateType, films) {

    this._films = films.slice();
    // this._defaultFilms = films.slice();

    this._notify(updateType);
  }

  getData() {
    return this._films;
  }

  // getDefaultFilms() {
  //   return this._defaultFilms;
  // }

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

  static adaptToServer(film) {
    const adaptedFilm = Object.assign(
      {},
      film,
      {
        'film_info': {
          poster: film.poster,
          title: film.title,
          'alternative_title': film.originalName,
          description: film.description,
          director: film.director,
          writers: film.screenwriters,
          actors: film.actors,
          'total_rating': film.rating,
          release: {
            date: dayjs(film.productionYear).toISOString(),
            'release_country': film.country,
          },
          runtime: film.timeContinue,
          genre: film.genres,
          'age_rating': film.ageRate,
        },
        'user_details': {
          watchlist: film.userDetails.isFutureFilm,
          favorite: film.userDetails.isFavorit,
          'already_watched': film.userDetails.isWatched,
          'watching_date': film.userDetails.isWatched ? dayjs(film.userDetails.watchedDate).toISOString() : film.userDetails.watchedDate,
        },
      },
    );
    delete adaptedFilm.poster;
    delete adaptedFilm.title;
    delete adaptedFilm.originalName;
    delete adaptedFilm.description;
    delete adaptedFilm.director;
    delete adaptedFilm.screenwriters;
    delete adaptedFilm.country;
    delete adaptedFilm.genres;
    delete adaptedFilm.ageRate;
    delete adaptedFilm.actors;
    delete adaptedFilm.rating;
    delete adaptedFilm.productionYear;
    delete adaptedFilm.timeContinue;

    delete adaptedFilm.userDetails;

    return adaptedFilm;
  }
}
