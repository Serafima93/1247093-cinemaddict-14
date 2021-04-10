export const createFooterStatistic = (number) => `<p>${number} movies inside</p>`;

// export default class FooterStatistic {
//   constructor(FILMS_MAX_COUNT) {
//     this._filters = FILMS_MAX_COUNT;
//     this._element = null;
//   }

//   getTemplate() {
//     return createFooterStatistic(this._filters);
//   }

//   getElement() {
//     if (!this._element) {
//       this._element = createSiteElement(this.getTemplate());
//     }

//     return this._element;
//   }

//   removeElement() {
//     this._element = null;
//   }
// }

