const FILMS_MAX_COUNT = 20;
const FILMS_EXTRA_SECTION = 2;
const FILM_COUNT_PER_STEP = 5;

const SortType = {
  DEFAULT: 'default',
  DATE: 'date',
  RATING: 'rating',
};

const FilterType = {
  ALL: 'All Movies',
  WATCHLIST: 'Watchlist',
  HISTORY: 'History',
  FAVORITES: 'Favorites',
  STATS: 'Stats',
};

const Mode = {
  DEFAULT: 'DEFAULT',
  POPUP: 'POP-UP',
};

const EmogiType = {
  SMILE: 'smile',
  SLEEP: 'sleeping',
  PUKE: 'puke',
  ANGRY: 'angry',
};

const UserAction = {
  UPDATE_FILM: 'UPDATE_FILM',
  ADD_COMMENT: 'ADD_COMMENT',
  DELETE_COMMENT: 'DELETE_COMMENT',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
};

const statisticsPeriod = {
  ALL: 'all-time',
  TODAY: 'day',
  WEEK: 'week',
  MONTH: 'month',
  YEAR: 'year',
};

export { FILMS_MAX_COUNT, FILMS_EXTRA_SECTION, FILM_COUNT_PER_STEP, FilterType, SortType, Mode, EmogiType, UpdateType, UserAction, statisticsPeriod };
