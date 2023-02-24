import Component from '../common/component';
import { COUNT_PER_PAGE, TABLE_HEADER } from '../constants/constants';
import CustomMultipleSelect from './CustomMultipleSelect';
import FormView from './FormView';
import PaginationView from './PaginationView';
import TableView from './TableView';
import { SortNameType } from '../types/SortNameType';
import { PeopleData } from '../interfaces/PeopleData';
import { OrdersType } from '../types/OrdersType';

export default class AppView {
  hiddenColumnIndexes: number[]; // массив индексов скрытых колонок
  select: CustomMultipleSelect; // кастомный селект
  node: HTMLElement;
  main: Component; // тег main
  header: Component; // тег header
  headerTitle: Component; // заголовок страницы
  tableSection: Component; // секция, оборачивающая таблицы
  tableContainer: Component; // обертка для таблицы
  table: TableView; // таблица
  preloader: Component; // прелодер
  errorMessage: Component; // компонент сообщения об ошибки
  pagination: PaginationView; // компонент пагинации
  paginationContainer: Component; // обертка над пагинацией
  form: FormView; // форма
  paginationClickHandle: (term: number) => void; // метод, меняющий номер страницы. Реализуется в контроллере
  onSort: (name: SortNameType) => void; // метод, сортирующий данные. Реализуется в контроллере
  sendData: (peopleDataItem: PeopleData, id: string) => Promise<void>; // метод, который отправляет данные. Реализуется в контроллере
  onRowClick: (peopleItem: PeopleData) => void; // метод, который рендерит форму при клике на строку таблицы
  constructor(node: HTMLElement) {
    this.node = node;
    this.hiddenColumnIndexes = [];
    this.onRowClick = (peopleItem) => {
      this.destroyForm();
      this.renderForm(peopleItem);
    };
  }

  renderPage() { // рендер страницы
    this.renderHeader();
    this.main = new Component(this.node, 'main', 'main', '');
    this.renderSelect();
    this.renderTableContainer();
    this.renderPreloader();
    this.renderPagination();
  }

  renderHeader() { // рендер шапки
    this.header = new Component(this.node, 'header', 'header', '');
    this.headerTitle = new Component(this.node, 'h1', 'header__title', 'Page title');
  }

  renderSelect() { // рендер кастомного селекта
    this.select = new CustomMultipleSelect(
      this.main.node,
      'div',
      'select',
      '',
      TABLE_HEADER, // передаем массив, содержащий названия для опций
      (i) => { // передаем коллбэк, скрывающий столбцы таблицы
        const foundElement = this.hiddenColumnIndexes.find((value) => value === i); // проверяем, есть ли индекс в массиве
        if (foundElement !== undefined) { // если он уже есть, значит столбец уже скрыт и надо его отобразить
          this.hiddenColumnIndexes = this.hiddenColumnIndexes.filter((value) => value !== i); // удаляем индекс из массива, так как столбец больше не скрыт
          this.toggleColumnDisplay(false, i);
        } else {
          this.hiddenColumnIndexes.push(i); // если элемента нет, то столбец отображается и его надо скрыть. Пушим индекс в массив скрытых столбцов
          this.toggleColumnDisplay(true, i); 
        }
      },
      this.hiddenColumnIndexes // передаем массив индексов скрытых столбцов
    );
  }

  renderTableContainer() { // рендерим обертку над таблицей
    this.tableSection = new Component(this.main.node, 'section', 'table-section', '');
    this.tableContainer = new Component(this.tableSection.node, 'div', 'table-container', '');
  }

  renderTable(data: PeopleData[], pageNumber: number, ordersType: OrdersType) { // рендер таблицы
    this.table = new TableView(
      this.tableContainer.node,
      'table',
      'table',
      '',
      this.hiddenColumnIndexes, // передаем массив индексов скрытых столбцов
      this.onRowClick, // передаем коллбэк для отображения формы
      this.onSort, // передаем метод для сортировки
      ordersType // передаем объект, содержащий порядок сортировки для всех заголовков
    );
    this.table.renderTableHead(); // рендер шапки
    this.table.renderTableBody(data, pageNumber); // рендер тела таблицы
    if (this.hiddenColumnIndexes.length) { // при первоначальном рендере таблицы скрываем столбцы
      this.hiddenColumnIndexes.forEach((value) => {
        this.toggleColumnDisplay(true, value);
      });
    }
  }

  destroyTable() { // уничтожение таблицы, если она имеется
    if (this.table) {
      this.table.destroy();
    }
  }

  renderPreloader() { // рендер прелоадера. Показывается при загрузке данных
    this.preloader = new Component(this.tableContainer.node, 'div', 'preloader', '');
    new Component(this.preloader.node, 'div', 'preloader__dot', '');
    const dotsList = new Component(this.preloader.node, 'div', 'preloader__dots-list', '');
    new Component(dotsList.node, 'span', '', '');
    new Component(dotsList.node, 'span', '', '');
    new Component(dotsList.node, 'span', '', '');
  }

  destroyPreloader() { // уничтожение прелодера
    this.preloader.destroy();
  }

  renderErrorMessage(msg: string) { // рендер компонента, содержащего сообщение об ошибке
    this.errorMessage = new Component(this.tableContainer.node, 'div', 'preloader', msg);
  }

  destroyErrorMessage() { // уничтожение компонента, содержащего сообщение об ошибке, если этот компонент имеется
    if (this.errorMessage) {
      this.errorMessage.destroy();
    }
  }

  toggleColumnDisplay(shouldHide: boolean, index: number) { // если надо скрыть столбец, то пробегаем по столбцу с индексом index и скрываем все колонки столбца
    if (shouldHide) {
      this.table.columns[index].forEach((colItem) => {
        colItem.setStyle('display', 'none');
      });
    } else { // иначе ставим то свойство, которе было изначально, а именно table-cell иди -webkit-box в зависимости от колонки
      this.table.columns[index].forEach((colItem) => {
        colItem.setStyle('display', colItem.initialDisplayStyle);
      });
    }
  }

  renderPagination() { // рендер пагинации
    this.pagination = new PaginationView(
      this.main.node,
      'div',
      'pagination',
      '',
      this.paginationClickHandle
    );
  }

  editPagination(pageNumber: number, countOfItems: number) { // редактируем пагинацию
    this.pagination.togglePaginationButton(this.pagination.prevButton, pageNumber === 1); // меняем атрибут кнопок в зависимости от номера страницы
    this.pagination.togglePaginationButton(
      this.pagination.nextButton,
      pageNumber === Math.floor(countOfItems / COUNT_PER_PAGE)
    );
    this.pagination.setPageNumber(pageNumber); // устанавливаем номер страницы
  }

  destroyPagination() { // уничтожаем пагинацию
    this.paginationContainer.destroy();
  }

  renderForm(peopleItem: PeopleData) { // формы
    this.form = new FormView(
      this.tableSection.node,
      'form',
      'form',
      '',
      peopleItem, // передаем данные о человеке
      this.sendData // передаем метод, который будет отправлять введенные данные
    ).setAttribute('novalidate', 'true'); // устанавливаем для формы атрибут, убирающий дефолтную валидацию
  }

  destroyForm() { // если есть форма, то уничтожаем ее
    if (this.form) {
      this.form.destroy();
    }
  }
}
