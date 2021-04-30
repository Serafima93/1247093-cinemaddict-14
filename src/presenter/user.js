import { UserProfile } from '../view/user.js';
import { render } from '../utils/utils-render';

class UserProfilePresenter {
  constructor(container) {
    this._container = container;
    this._UserProfileComponent = null;
  }

  init() {
    this._UserProfileComponent = new UserProfile();

    render(this._container, this._UserProfileComponent);
  }
}
export { UserProfilePresenter };
