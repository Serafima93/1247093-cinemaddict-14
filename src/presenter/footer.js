import FooterStatistic from '../view/footer.js';
import { render } from '../utils/render';

export default class FooterStatisticPresenter {
  constructor(container) {
    this._container = container;
    this._footerStatisticComponent = null;
  }

  init(number) {
    this._footerStatisticComponent = new FooterStatistic(number);

    render(this._container, this._footerStatisticComponent);
  }
}
