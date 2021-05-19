import Abstract from './abstract.js';

const createFooterStatistic = (number) => `<p>${number} movies inside</p>`;

export default class FooterStatistic extends Abstract {
  constructor(FilmMaxCount) {
    super();
    this._filters = FilmMaxCount;
  }

  getTemplate() {
    return createFooterStatistic(this._filters);
  }
}
