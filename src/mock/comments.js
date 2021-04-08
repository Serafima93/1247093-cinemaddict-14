import { generateFilmDescription } from './film.js';
import { getRandomInteger } from './utils.js';

import dayjs from 'dayjs';

const generateCommentAuthor = () => {
  const name = ['TIM', 'UNI', 'SIMA', 'IGOR'];
  const randomIndex = getRandomInteger(0, name.length - 1);
  return name[randomIndex];
};


const generateCommentTime = () => {
  const maxDaysGap = 7;
  const daysGap = getRandomInteger(-maxDaysGap, maxDaysGap);
  const date = dayjs().add(daysGap, 'day').toDate();
  return date;
};

const generateCommentEmoji = () => {
  const photoArray = ['smile', 'sleeping', 'puke', 'angry'];
  const randomIndex = getRandomInteger(0, photoArray.length - 1);
  const imgUrl = `./images/emoji/${photoArray[randomIndex]}.png`;
  return imgUrl;
};


const generateFilmComment = () => {
  return {
    text: generateFilmDescription(),
    emoji: generateCommentEmoji(),
    author: generateCommentAuthor(),
    commentDate: generateCommentTime(),
  };
};

export { generateFilmComment };

