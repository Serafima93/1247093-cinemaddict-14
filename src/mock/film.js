// getRandomInteger - Источник - https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_random

import dayjs from 'dayjs';
import { getRandomInteger } from './utils';

const generateFilmPoster = () => {
  const filmPoster = ['./images/posters/made-for-each-other.png', './images/posters/popeye-meets-sinbad.png', './images/posters/the-dance-of-life.jpg', './images/posters/the-man-with-the-golden-arm.jpg'];
  // тут хотят чтобы мы обращались к файлам в папке. Но они все с разным урлом. Тут либо php, либо вручную...
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

  const randomIndex = genre.slice(getRandomInteger(0, genre.length - 1));
  return randomIndex;
};


const generateFilm = () => {
  return {
    poster: generateFilmPoster(),
    title: generateFilmTitle(),
    rating: generateFilmRating(),
    productionYear: generateFilmYear(),
    timeContinue: generateFilmTime(),
    // тут появляются пустоты. Как их избежать?
    genres: generateGenre().splice(1, 1),
    description: generateFilmDescription(),
    commentsCount: 10,
    isFavorit: Boolean(getRandomInteger(0, 1)),
    isWatched: Boolean(getRandomInteger(0, 1)),
    futureFilm: Boolean(getRandomInteger(0, 1)),
  };
};

//начало работы с поп-апом

const generateFilmCountry = () => {
  const country = ['USA', 'UK', 'Israel', 'Spain'];
  const randomIndex = getRandomInteger(0, country.length - 1);
  return country[randomIndex];
};

const generateFilmDirector = () => {
  const country = ['Alef', 'Bet', 'Gimel', 'Dalet'];
  const randomIndex = getRandomInteger(0, country.length - 1);
  return country[randomIndex];
};


const generateFilmHuman = () => {
  const human = ['Doe', 'Joly', 'Smith', 'Sims', 'Green'];
  const randomIndex = human.slice(getRandomInteger(0, human.length - 1));
  return randomIndex;
};
const ageFilmRate = () => {
  const age = ['6+', '14+', '16+', '18+', '21+'];
  const randomIndex = getRandomInteger(0, age.length - 1);
  return age[randomIndex];
};


const generatePopUpFilm = () => {
  return {
    poster: generateFilmPoster(),
    title: generateFilmTitle(),
    originalname: generateFilmTitle(),
    rating: generateFilmRating(),
    director: generateFilmDirector(),
    actors: generateFilmHuman(),
    screenwriters: generateFilmHuman(),
    country: generateFilmCountry(),
    productionYear: generateFilmYear(),
    timeContinue: generateFilmTime(),
    genres: generateGenre(),
    description: generateFilmDescription(),
    ageRate: ageFilmRate(),
  };
};

export { getRandomInteger, generateFilm, generatePopUpFilm, generateGenre, generateFilmDescription };
