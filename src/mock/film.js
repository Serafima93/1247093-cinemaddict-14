import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { nanoid } from 'nanoid';
dayjs.extend(duration);

import { getRandomInteger } from '../utils/common';
import { generateFilmComment } from './comments';


const generateFilmPoster = () => {
  const filmPoster = ['./images/posters/santa-claus-conquers-the-martians.jpg','./images/posters/sagebrush-trail.jpg', './images/posters/the-great-flamarion.jpg', './images/posters/made-for-each-other.png', './images/posters/popeye-meets-sinbad.png', './images/posters/the-dance-of-life.jpg', './images/posters/the-man-with-the-golden-arm.jpg'];
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

const generateFilmRating = () => getRandomInteger(0, 10);


const generateFilmTime = () => {
  return dayjs.duration({
    hours: getRandomInteger(0, 6),
    minutes: getRandomInteger(1, 59),
  });
};

const generateFilmYearProduction = () => {
  const maxDaysGap = 10000;
  const daysGap = getRandomInteger(-maxDaysGap, 2021);
  const date = dayjs().add(daysGap, 'day').toDate();
  return date;
};

const generateGenre = () => {
  const genre = ['action', 'drama', 'SF', 'romance', 'art', 'sport', 'musical'];

  const randomIndex = genre.slice(getRandomInteger(0, genre.length - 1));
  return randomIndex;
};


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

const generateFilm = () => ({
  id: nanoid(),
  poster: generateFilmPoster(),
  title: generateFilmTitle(),
  originalName: generateFilmTitle(),
  rating: generateFilmRating(),
  director: generateFilmDirector(),
  actors: generateFilmHuman(),
  screenwriters: generateFilmHuman(),
  country: generateFilmCountry(),
  productionYear: generateFilmYearProduction(),
  timeContinue: generateFilmTime(),
  genres: generateGenre(),
  description: generateFilmDescription(),
  ageRate: ageFilmRate(),
  isFavorit: Boolean(getRandomInteger(0, 1)),
  isWatched: Boolean(getRandomInteger(0, 1)),
  isFutureFilm: Boolean(getRandomInteger(0, 1)),
  comments: new Array(getRandomInteger(1, 20)).fill().map(generateFilmComment),
});

export { generateFilmDescription, generateFilm };
