import Component from "../common/component";
import { COUNT_PER_PAGE } from "../constants/constants";

export default class View {
  constructor(node, model) {
    this.model = model;
    this.node = node;
    this.tableContainer = new Component(this.node, 'div', 'table-container', '');
    this.renderHideButtons();
    this.renderPreloader();
    this.renderPagination();
    this.columns = [...new Array(4).fill([])]
  }

  renderPreloader() {
    this.preloader = new Component(this.tableContainer.node, 'div', 'preloader', 'Загрузка...');
  }

  destroyPreloader() {
    this.preloader.destroy();
  }

  renderHideButtons() {
    this.buttonsContainer = new Component(this.node, 'div', 'buttons-container', '');
    TABLE_HEADER.forEach((name, i) => {
      const button = new Component(this.buttonsContainer.node, 'button', '', `Hide/show ${name}`);
      button.setListener('click', () => {
        this.toggleColumnDisplay(i);
      });
    });
  }

  toggleColumnDisplay(index) {
    this.columns[index].forEach((column) => {
      column.forEach((colItem) => {
        if (colItem.getStyle('display') === 'none') {
          colItem.setStyle('display', 'table-cell');
        } else {
          colItem.setStyle('display', 'none');
        }
      })
    })
  }

  destroyTableBody() {
    this.tbody.destroy();
  }

  renderTable() {
    this.table = new Component(this.tableContainer.node, 'table', 'table', '');
    this.renderTableHead();
    this.renderTableBody();
  }

  renderTableHead() {
    this.thead = new Component(this.table.node, 'thead', 'table__head', '');
    TABLE_HEADER.forEach((name, i) => {
      const tableHead = new Component(this.thead.node, 'th', 'table__head-item', name);
      this.columns[i].push(tableHead);
      tableHead.setListener('click', () => {
        this.sort(name);
        this.toggleSortClass(tableHead, i);
      });
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

  renderTableBody(data) {
    this.tbody = new Component(this.table.node, 'tbody', 'table__body', '');
    data.forEach((item, index) => {
      const row = new Component(this.tbody.node, 'tr', 'table__row', '');
      new Component(row.node, 'td', 'table__col', String(index + 1 + (pageNumber - 1) * COUNT_PER_PAGE));
      this.columns[0].push(new Component(row.node, 'td', 'table__col', `${item.firstName}`));
      this.columns[1].push(new Component(row.node, 'td', 'table__col', `${item.lastName}`));
      this.columns[2].push(new Component(row.node, 'td', 'table__col', `${item.about}`));
      this.columns[3].push(new Component(row.node, 'td', 'table__col', '').setStyle('background-color', item.eyeColor));
    });
  }

  renderPagination() {
    this.paginationContainer = new Component(this.node, 'div', 'pagination-container', '');
    this.prevButton = new Component(this.node, 'button', 'btn prev-btn', 'Prev')
      .setListener('click', () => this.paginationClickHandle(-1));
    this.pageNumber = new Component(this.node, 'div', 'page-number', `${this.getPageNumber()}`);
    this.nextButton = new Component(this.node, 'button', 'btn next-btn', 'Next')
      .setListener('click', () => this.paginationClickHandle(1));
    this.togglePaginationButton(this.prevButton, this.getPageNumber() === 1);
    this.togglePaginationButton(this.nextButton, this.getPageNumber() === Math.floor(this.getCountOfItems() / COUNT_PER_PAGE));
  }

  togglePaginationButton(button, shouldDisable) {
    if (shouldDisable) {
      button.setAttribute('disabled', 'true');
    } else {
      button.removeAttribute('disabled');
    }
  }
}