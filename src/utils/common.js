import dayjs from 'dayjs';

// Источник - https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_random
const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));
  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const changeActiveStatus = (target, activeClass) => {
  if (target.classList.contains(activeClass)) {
    target.classList.remove(activeClass);
  } else {
    target.classList.add(activeClass);
  }
};

const compareDate = (a, b) => {
  return dayjs().diff(a.productionYear) - dayjs().diff(b.productionYear);
};

export { getRandomInteger, changeActiveStatus, compareDate };
