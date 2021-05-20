import { FilterType } from './constans.js';

const UserFilters = {
  [FilterType.ALL]: (films) => films,
  [FilterType.WATCHLIST]: (films) => films.filter((film) => film.userDetails.isFutureFilm),
  [FilterType.FAVORITES]: (films) => films.filter((film) => film.userDetails.isFavorit),
  [FilterType.HISTORY]: (films) => films.filter((film) => film.userDetails.isWatched),
  [FilterType.STATS]: (films) => films,
};

export { UserFilters };
