import { createSiteElement } from '../utils.js';

const createShowMoreButton = () => {
  return `
<button class="films-list__show-more">Show more</button>` ;
};

class ShowMoreButton {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createShowMoreButton();
  }

  getElement() {
    if (!this._element) {
      this._element = createSiteElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}

export { ShowMoreButton };
