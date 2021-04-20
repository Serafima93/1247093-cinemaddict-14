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

const replaceChild = (parent, newChild, status) => {
  if (newChild instanceof Abstract) {
    newChild = newChild.getElement();
  }

  if (parent === null || newChild === null) {
    throw new Error('Can\'t replace unexisting elements');
  }
  if (status === true) {
    return parent.appendChild(newChild);
  } else { parent.removeChild(newChild); }
};


const remove = (component) => {
  if (!(component instanceof Abstract)) {
    throw new Error('Can remove only components');
  }
  component.getElement().remove();
  component.removeElement();
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
  replaceChild
};
