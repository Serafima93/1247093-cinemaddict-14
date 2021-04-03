// getRandomInteger - Источник - https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_random

import dayjs from 'dayjs';

const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const generateFilmPoster = () => {
  const filmPoster = ['./images/posters/made-for-each-other.png', './images/posters/popeye-meets-sinbad.png', './images/posters/the-dance-of-life.jpg'];

  const randomIndex = getRandomInteger(0, filmPoster.length - 1);
  return filmPoster[randomIndex];
};

const generateFilmTitle = () => {
  const filmTitle = ['Leon', 'Sin City', 'Rear Window', 'La piel que habito', 'The Lord of the Rings'];
  const randomIndex = getRandomInteger(0, filmTitle.length - 1);
  return filmTitle[randomIndex];
};

const generateFilmDescription = () => {
  const description = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.';
  const createDescriptions = description.split(['. ']);

  const randomIndex = createDescriptions.slice(getRandomInteger(0, createDescriptions.length - 1));
  randomIndex.splice(5, randomIndex.length - 1).join('. ');

  const makeString = randomIndex.join('. ');
  return makeString;
};

const generateFilmRating = () => {
  const randomIndex = getRandomInteger(0, 10);
  return randomIndex;
};

const generateFilmYear = () => {
  const randomIndex = getRandomInteger(1950, 2020);
  return randomIndex;
};


const generateFilmTime = () => {
  const randomIndex = getRandomInteger(0, 6);
  return dayjs().add(randomIndex, 'hour').add(randomIndex, 'minute').toDate();
};

const generateGenre = () => {
  const genre = ['action', 'drama', 'SF', 'romance'];
  const randomIndex = getRandomInteger(0, genre.length - 1);
  return genre[randomIndex];
};


export const generateFilm = () => {
  return {
    poster: generateFilmPoster(),
    title: generateFilmTitle(),
    rating: generateFilmRating(),
    productionYear: generateFilmYear(),
    timeContinue: generateFilmTime(),
    genres: generateGenre(),
    description: generateFilmDescription(),
    commentsCount: 10,
  };
};

