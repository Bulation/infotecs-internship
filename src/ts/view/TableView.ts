import Component from '../common/component';
import { COLUMNS_COUNT, COUNT_PER_PAGE, TABLE_HEADER } from '../constants/constants';
import { PeopleData } from '../interfaces/PeopleData';
import { OrdersType } from '../types/OrdersType';
import { SortNameType } from '../types/SortNameType';

export default class TableView extends Component {
  columns: Component[][]; // массив, содержащий массив, в котором содержатся все столбцы. Необходим для скрытия столбцов
  hiddenColumnIndexes: number[]; // массив индексов скрытых столбцов
  onRowClick: (peopleItem: PeopleData) => void; // коллбэк для строки таблицы, при клике по которому информация о человеке передается в этот коллбэк для инициализации формы
  onSort: (name: SortNameType) => void; // коллбэк, в который передается значение заголовка таблицы, который надо отсортировать
  ordersType: OrdersType; // объект, содержащий порядок сортировки для всех заголовков таблицы
  thead: Component;
  tbody: Component;
  constructor(
    parentNode: HTMLElement,
    tagName: keyof HTMLElementTagNameMap,
    className = '',
    content = '',
    hiddenColumnIndexes: number[],
    onRowClick: (peopleItem: PeopleData) => void,
    onSort: (name: SortNameType) => void,
    ordersType: OrdersType
  ) {
    super(parentNode, tagName, className, content);
    this.columns = [...new Array(COLUMNS_COUNT).fill([]).map(() => [])];
    this.hiddenColumnIndexes = hiddenColumnIndexes;
    this.onRowClick = onRowClick;
    this.onSort = onSort;
    this.ordersType = ordersType;
  }

  renderTableHead() {
    this.thead = new Component(this.node, 'thead', 'table__head', ''); // создание шапки
    new Component(this.thead.node, 'th', 'table__head-item', ''); // создание пустого заголовка для колонки с порядковым номерами строк
    TABLE_HEADER.forEach((name, i) => {
      const tableHead = new Component(this.thead.node, 'th', 'table__head-item', name) // создание заголовка
        .setClass(
          this.ordersType[name as keyof typeof this.ordersType] === 'asc' // установка класса, отображающего стрелочку, в зависимости от порядка сортировки
            ? 'table__head-item_asc'
            : 'table__head-item_desc'
        )
        .setListener('click', () => { // по клике на заголовок вызывается коллбэк для передачи названия заголовка для последующей сортировки, также меняется класс заголовка, чтобы изменить стрелочку
          this.onSort(name);
          this.toggleSortClass(tableHead, i);
        })
        .setAttribute('aria-label', 'Sort column') // установка aria-атрибута и title
        .setAttribute('title', 'Sort column');
      this.columns[i].push(tableHead); // в массив с индексом i пушится заголовок для возможности последующего скрытия заголовка
    });
  }

  renderTableBody(peopleData: PeopleData[], pageNumber: number) {
    this.tbody = new Component(this.node, 'tbody', 'table__body', ''); // создание тела формы
    peopleData.forEach((peopleItem, index) => {
      const row = new Component(this.tbody.node, 'tr', 'table__row', '').setListener('click', () =>
        this.onRowClick(peopleItem) // создание строки таблицы, при клике по которому в коллбэк передается информация о человеке. Дальше будет создана форма
      );
      new Component(
        row.node,
        'td',
        'table__col',
        String(index + 1 + (pageNumber - 1) * COUNT_PER_PAGE)
      ); // колонка, отображающая номер элемента
      this.columns[0].push( // в 0 элемент пушится первая колонка, необходимо для дальнейшего скрытия колонки
        new Component(row.node, 'td', 'table__col', `${peopleItem.name.firstName}`)
          .setAttribute('aria-label', 'Open form for edit row') // установка aria-атрибута и title
          .setAttribute('title', 'Open form for edit row')
      );
      this.columns[1].push(
        new Component(row.node, 'td', 'table__col', `${peopleItem.name.lastName}`)
          .setAttribute('aria-label', 'Open form for edit row')
          .setAttribute('title', 'Open form for edit row')
      );
      this.columns[2].push(
        new Component(row.node, 'td', 'table__col table__col-about', `${peopleItem.about}`)
          .setAttribute('aria-label', 'Open form for edit row')
          .setAttribute('title', 'Open form for edit row')
      );
      this.columns[3].push(new Component(row.node, 'td', 'table__col', '')
        .setStyle('background-color', peopleItem.eyeColor)
        .setAttribute('aria-label', 'Open form for edit row')
        .setAttribute('title', 'Open form for edit row'));
    });
  }

  toggleSortClass(tableHead: Component, headIndex: number) {
    if (tableHead.hasClass('table__head-item_desc')) { // если переданный заголовок имеет класс desc, то меняется на asc и наоборот. Для остальных заголовков устанавливается класс по умолчанию
      tableHead.removeClass('table__head-item_desc');
      tableHead.setClass('table__head-item_asc');
    } else {
      tableHead.removeClass('table__head-item_asc');
      tableHead.setClass('table__head-item_desc');
    }
    this.columns.forEach((column, columnIndex) => {
      if (headIndex !== columnIndex) {
        column[0].removeClass('table__head-item_desc');
      }
    });
  }
}
