import Component from "../common/component.js";

export default class PaginationView extends Component {
  constructor(parentNode, tagName, className = '', content = '', onPaginationClick) {
    super(parentNode, tagName, className, content);
    this.prevButton = new Component(this.node, 'button', 'btn prev-btn', 'Prev')
      .setListener('click', () => onPaginationClick(-1));
    this.pageNumber = new Component(this.node, 'div', 'page-number', '1');
    this.nextButton = new Component(this.node, 'button', 'btn next-btn', 'Next')
      .setListener('click', () => onPaginationClick(1));
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