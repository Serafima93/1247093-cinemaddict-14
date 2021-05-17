import { USER_RATING } from './constans.js';

const getRating = (number) => {
  const rating = [];
  for (const key in USER_RATING) {
    if (USER_RATING[key].FROM <= number && number <= USER_RATING[key].TO) {
      rating.push(key);
    }
  }
  return status;
};

export { getRating };
