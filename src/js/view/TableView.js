import Component from "../common/component.js";
import { COUNT_PER_PAGE, TABLE_HEADER } from "../constants/constants.js";

export default class TableView extends Component {
  constructor(parentNode, tagName, className = '', content = '', hiddenColumnIndexes, onRowClick, onSort) {
    super(parentNode, tagName, className, content);
    this.columns = [...new Array(4).fill([]).map(() => [])];
    this.hiddenColumnIndexes = hiddenColumnIndexes;
    this.onRowClick = onRowClick;
    this.onSort = onSort;
  }

  renderTableHead() {
    this.thead = new Component(this.node, 'thead', 'table__head', '');
    new Component(this.thead.node, 'th', 'table__head-item', '');
    TABLE_HEADER.forEach((name, i) => {
      const tableHead = new Component(this.thead.node, 'th', 'table__head-item', name);
      this.columns[i].push(tableHead);
      tableHead.setListener('click', () => {
        this.onSort(name);
        this.toggleSortClass(tableHead, i);
      });
    });
  }

  renderTableBody(peopleData, pageNumber) {
    this.tbody = new Component(this.node, 'tbody', 'table__body', '');
    peopleData.forEach((peopleItem, index) => {
      const row = new Component(this.tbody.node, 'tr', 'table__row', '');
      new Component(row.node, 'td', 'table__col', String(index + 1 + (pageNumber - 1) * COUNT_PER_PAGE));
      this.columns[0].push(new Component(row.node, 'td', 'table__col', `${peopleItem.name.firstName}`));
      this.columns[1].push(new Component(row.node, 'td', 'table__col', `${peopleItem.name.lastName}`));
      this.columns[2].push(new Component(row.node, 'td', 'table__col table__col-about', `${peopleItem.about}`));
      const eye = new Component(row.node, 'td', 'table__col', '').setStyle('background-color', peopleItem.eyeColor)
      this.columns[3].push(eye);
      row.setListener('click', () => this.onRowClick(peopleItem, eye));
    });
  }


  toggleSortClass(tableHead, headIndex) {
    if (tableHead.hasClass('desc')) {
      tableHead.removeClass('desc');
    } else {
      tableHead.setClass('desc');
    }
    this.columns.forEach((column, columnIndex) => {
      if (headIndex !== columnIndex) {
        column[0].removeClass('desc');
      }
    })
  }
}