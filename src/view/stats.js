import Smart from './smart.js';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { getRating } from '../utils/stats.js';
import { StatisticsPeriod } from '../utils/constans.js';

import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
dayjs.extend(isBetween);

const getWatchedFilmByChoosenPeriod = (films, period) => {
  const watchedFilm = films.filter((film) => film.userDetails.isWatched);
  if (period === StatisticsPeriod.ALL) {
    return watchedFilm;
  }
  return watchedFilm.slice().filter((film) => dayjs(film.userDetails.watchedDate).isBetween(dayjs(), dayjs().subtract(1, period)));
};

// статистика этих фильмов
const getStatisticByWatchedFilms = (watchedFilms) => {
  let fullTime = 0;
  const minuteTime = 0;
  const genresStatistic = {};
  if (watchedFilms.length === 0) {
    return {
      watchingTime: 0,
      topGenre: '',
      genresStatistic,
      userStatus: getRating(watchedFilms.length),
      watchedFilmCount: watchedFilms.length,
    };
  }

  for (let i = 0; i < watchedFilms.length; i++) {
    const film = watchedFilms[i];
    fullTime += film.timeContinue,
    film.genres.forEach((film) => genresStatistic[film] = genresStatistic[film] + 1 || 1);
  }
  fullTime = fullTime + Math.trunc(minuteTime / 60);

  const topGenres = Object.entries(genresStatistic).sort((a, b) => b[1] - a[1]);
  return {
    fullTime,
    topGenre: topGenres[0][0],
    genresStatistic,
    userStatus: getRating(watchedFilms.length),
    watchedFilmCount: watchedFilms.length,
  };
};

// создание жанра
const createChartGenres = (statisticCtx, genresStats) => {
  let data;
  let label;
  if (!Object.keys(genresStats)) {
    data = 0;
    label = '';
  } else {
    data = Object.values(genresStats);
    label = Object.keys(genresStats);
  }

  return new Chart(statisticCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: label,
      datasets: [{
        data: data,
        backgroundColor: '#ffe800',
        hoverBackgroundColor: '#ffe800',
        anchor: 'start',
        barThickness: 21,
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 20,
          },
          color: '#ffffff',
          anchor: 'start',
          align: 'start',
          offset: 40,
        },
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#ffffff',
            padding: 100,
            fontSize: 20,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};

const makeInputTemplate = (input, currentInput) => {
  return `<input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter"
   id="statistic-${input}" value="${input}"  ${input === currentInput ? 'checked' : ''}>
  <label for="statistic-${input}" class="statistic__filters-label">
  ${input === StatisticsPeriod.ALL ? 'All time' : `${input.charAt(0).toUpperCase() + input.slice(1)}`}</label>`;
};

const createPeriodTemplate = (currentInput) => {
  return Object.values(StatisticsPeriod).map((input) => makeInputTemplate(input, currentInput)).join('');
};

const createStatistics = (data) => {
  const { films, statisticPeriod } = data;
  const watchedFilmByPeriod = getWatchedFilmByChoosenPeriod(films, statisticPeriod);
  const watchedStatistic = getStatisticByWatchedFilms(watchedFilmByPeriod);
  const { fullTime, topGenre, watchedFilmCount, userStatus } = watchedStatistic;

  return `<section class="statistic">
  <p class="statistic__rank">
    Your rank
    <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    <span class="statistic__rank-label">${userStatus}</span>
  </p>
  <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
    <p class="statistic__filters-description">Show stats:</p>${createPeriodTemplate(statisticPeriod)}
  </form>
  <ul class="statistic__text-list">
    <li class="statistic__text-item">
      <h4 class="statistic__item-title">You watched</h4>
      <p class="statistic__item-text">${watchedFilmCount} <span class="statistic__item-description">movies</span></p>
    </li>
    <li class="statistic__text-item">
      <h4 class="statistic__item-title">Total duration</h4>
      <p class="statistic__item-text">${fullTime === 0 ? `${0}<span class="statistic__item-description">h</span>` : `${Math.trunc(fullTime / 60)} <span class="statistic__item-description">h</span> ${fullTime % 60} <span class="statistic__item-description">m</span></p>`}
    </li>
    <li class="statistic__text-item">
      <h4 class="statistic__item-title">Top genre</h4>
      <p class="statistic__item-text">${topGenre}</p>
    </li>
  </ul>
  <div class="statistic__chart-wrap">
    <canvas class="statistic__chart" width="1000"></canvas>
  </div>
</section>`;
};


export default class Stats extends Smart {
  constructor(films) {
    super();
    this._data = {
      films,
      statisticPeriod: StatisticsPeriod.ALL,
    };
    this._genresChart = null;
    this._periodChangeHandler = this._periodChangeHandler.bind(this);
    this._setInnersHandler();

    this._setChart();
  }

  getTemplate() {
    return createStatistics(this._data);
  }

  restoreHandlers() {
    this._setInnersHandler();
    this._setChart();
  }

  _setInnersHandler() {
    this.getElement().querySelector('.statistic__filters').addEventListener('change', this._periodChangeHandler);
  }

  _periodChangeHandler(evt) {
    this.updateData({
      statisticPeriod: evt.target.value,
    });
  }

  _setChart() {
    const { films, statisticPeriod } = this._data;
    const BAR_HEIGHT = 50;
    const statisticCtx = this.getElement().querySelector('.statistic__chart');
    statisticCtx.height = BAR_HEIGHT * 5;
    const watchedFilmByPeriod = getWatchedFilmByChoosenPeriod(films, statisticPeriod);
    const watchedStatistic = getStatisticByWatchedFilms(watchedFilmByPeriod);
    this._genresChart = createChartGenres(statisticCtx, watchedStatistic.genresStatistic);
  }
}

