import Component from "../common/component.js";

export default class PaginationView extends Component {
  constructor(parentNode, tagName, className = '', content = '', onPaginationClick) {
    super(parentNode, tagName, className, content);
    this.prevButton = new Component(this.node, 'button', 'btn pagination__prev', 'Prev')
      .setListener('click', () => onPaginationClick(-1))
      .setAttribute('aria-label', 'Move to previous page')
      .setAttribute('title', 'Move to previous page');
    this.pageNumber = new Component(this.node, 'div', 'pagination__page-number', '1')
      .setAttribute('aria-label', 'Page number')
      .setAttribute('title', 'Page number');
    this.nextButton = new Component(this.node, 'button', 'btn pagination__next', 'Next')
      .setListener('click', () => onPaginationClick(1))
      .setAttribute('aria-label', 'Move to next page')
      .setAttribute('title', 'Move to next page');
  }

  setPageNumber(number) {
    this.pageNumber.setContent(number);
  }

  togglePaginationButton(button, shouldDisable) {
    if (shouldDisable) {
      button.setAttribute('disabled', 'true');
    } else {
      button.removeAttribute('disabled');
    }
  }
}