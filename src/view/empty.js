import { createSiteElement } from '../utils.js';

const createEmptyWrap = () => {
  return `
  <section class="films-list">
  <h2 class="films-list__title">There are no movies in our database</h2>
</section>` ;
};

class EmptyWrap {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createEmptyWrap();
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

export { EmptyWrap };
