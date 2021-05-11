import { FilterType } from './utils-constans.js';

const filters = {
  [FilterType.ALL]: (films) => films,
  [FilterType.WATCHLIST]: (films) => films.filter((film) => film.isFutureFilm),
  [FilterType.FAVORITES]: (films) => films.filter((film) => film.isFavorit),
  [FilterType.HISTORY]: (films) => films.filter((film) => film.isWatched),
};

export { filters };
