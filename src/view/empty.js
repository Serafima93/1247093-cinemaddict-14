import Abstract from './abstract.js';

const createEmptyWrap = () => {
  return `<section class="films-list">
  <h2 class="films-list__title">There are no movies in our database</h2>
</section>` ;
};

export default class EmptyWrap extends Abstract {

  getTemplate() {
    return createEmptyWrap();
  }
}

