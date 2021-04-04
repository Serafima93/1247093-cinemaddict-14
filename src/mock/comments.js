import { generateFilmDescription } from './film.js';
import { getRandomInteger } from './utils.js';

import dayjs from 'dayjs';

const generateCommentAuthor = () => {
  const name = ['TIM', 'UNI', 'SIMA', 'IGOR'];
  const randomIndex = getRandomInteger(0, name.length - 1);
  return name[randomIndex];
};


const generateCommentTime = () => {
  const randomIndex = getRandomInteger(0, 6);
  return dayjs().add(randomIndex, 'hour').add(randomIndex, 'minute').toDate();
};


const generateFilmComment = () => {
  return {
    text: generateFilmDescription(),
    author: generateCommentAuthor(),
    commentDate: generateCommentTime(),
  };
};


export { generateFilmComment};

