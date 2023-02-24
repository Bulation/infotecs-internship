import Component from '../common/component';

export default class PaginationView extends Component {
  prevButton: Component; // кнопка, при клике на которую отображается предыдущая страница
  pageNumber: Component; // номер страницы
  nextButton: Component; // кнопка, при клике на которую отображается следующая страница
  constructor(
    parentNode: HTMLElement,
    tagName: keyof HTMLElementTagNameMap,
    className = '',
    content = '',
    onPaginationClick: (term: number) => void // коллбэк для переключения страницы, term принимает значения 1 и -1. Если передана 1, то отобразится следующая страница, иначе предыдущая
  ) {
    super(parentNode, tagName, className, content);
    this.prevButton = new Component(this.node, 'button', 'btn pagination__prev', 'Prev')
      .setListener('click', () => onPaginationClick(-1)) // устанавливаем слушатель при клике, при котором в коллбэк передается -1, чтобы отобразилась предыдущая страница
      .setAttribute('aria-label', 'Move to previous page') // установка aria-атрибута и title
      .setAttribute('title', 'Move to previous page');
    this.pageNumber = new Component(this.node, 'div', 'pagination__page-number', '1')
      .setAttribute('aria-label', 'Page number')
      .setAttribute('title', 'Page number');
    this.nextButton = new Component(this.node, 'button', 'btn pagination__next', 'Next')
      .setListener('click', () => onPaginationClick(1))
      .setAttribute('aria-label', 'Move to next page')
      .setAttribute('title', 'Move to next page');
  }

  setPageNumber(number: number) { // отображаем текущий номер страницы
    this.pageNumber.setContent(String(number));
  }

  togglePaginationButton(button: Component, shouldDisable: boolean) { // метод для смены атрибутов у кнопок, если номер страницы первый или последний
    if (shouldDisable) {
      button.setAttribute('disabled', 'true');
    } else {
      button.removeAttribute('disabled');
    }
  }
}
