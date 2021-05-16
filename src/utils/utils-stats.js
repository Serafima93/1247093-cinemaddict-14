const USER_RATING = {
  'none': {
    FROM: 0,
    TO: 0,
  },
  'novice': {
    FROM: 1,
    TO: 10,
  },
  'fan': {
    FROM: 11,
    TO: 20,
  },
  'movie buff': {
    FROM: 21,
    TO: 100,
  },
};

const getRating = (number) => {
  const status = [];
  for (const key in USER_RATING) {
    if (USER_RATING[key].FROM <= number && number <= USER_RATING[key].TO) {
      status.push(key);
    }
  }

  return status;
};

export { getRating };
