import UserProfile from '../view/user.js';
import { render } from '../utils/render';

export default class UserProfilePresenter {
  constructor(container) {
    this._container = container;
    this._userProfileComponent = null;
  }
  init() {
    this._userProfileComponent = new UserProfile();
    render(this._container, this._userProfileComponent);
  }
}
