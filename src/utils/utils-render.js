import { Abstract } from '../view/abstract.js';

const RenderPosition = {
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
};

const render = (container, child, place = RenderPosition.BEFOREEND) => {
  if (container instanceof Abstract) {
    container = container.getElement();
  }

  if (child instanceof Abstract) {
    child = child.getElement();
  }

  switch (place) {
    case RenderPosition.BEFOREEND:
      container.append(child);
      break;
    default:
      container.prepend(child);
      break;
  }
};

// эта функция нужна не для замены одного элемента другим, а только для его всплытия.

const emersion = (parent, child) => {
  if (parent === null || child === null) {
    throw new Error('Can\'t show unexisting elements');
  }
  if (child instanceof Abstract) {
    child = child.getElement();
  }
  return parent.appendChild(child);
};


const remove = (component) => {
  if (!(component instanceof Abstract)) {
    throw new Error('Can remove only components');
  }
  component.getElement().remove();
};

const createSiteElement = (template) => {
  const newElement = document.createElement('div');
  newElement.innerHTML = template;

  return newElement.lastChild;
};

export {
  RenderPosition,
  render,
  createSiteElement,
  remove,
  emersion
};
