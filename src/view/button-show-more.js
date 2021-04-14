import { Abstract } from './abstract.js';

const createShowMoreButton = () => {
  return `
<button class="films-list__show-more">Show more</button>` ;
};

class ShowMoreButton extends Abstract {

  getTemplate() {
    return createShowMoreButton();
  }
}

export { ShowMoreButton };
