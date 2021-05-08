const FILMS_MAX_COUNT = 20;
const FILMS_EXTRA_SECTION = 2;
const FILM_COUNT_PER_STEP = 5;

const SortType = {
  DEFAULT: 'default',
  DATE: 'date',
  RATING: 'rating',
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
  UPDATE_TASK: 'UPDATE_TASK',
  ADD_TASK: 'ADD_TASK',
  DELETE_TASK: 'DELETE_TASK',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
};

export { FILMS_MAX_COUNT, FILMS_EXTRA_SECTION, FILM_COUNT_PER_STEP, SortType, Mode, EmogiType, UpdateType, UserAction };
