import { Abstract } from './abstract.js';

const createSorting = () => {
  return `  <ul class="sort">
  <li><a href="#" class="sort__button sort__button--active">Sort by default</a></li>
  <li><a href="#" class="sort__button">Sort by date</a></li>
  <li><a href="#" class="sort__button">Sort by rating</a></li>
  </ul>` ;
};

class Sort extends Abstract {

  getTemplate() {
    return createSorting();
  }
}

export { Sort };