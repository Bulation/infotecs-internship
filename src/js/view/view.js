import Component from "../common/component.js";
import { COUNT_PER_PAGE, TABLE_HEADER } from "../constants/constants.js";
import rgbToHex from "../helperFunctions/rgbToHex.js";
import CustomMultipleSelect from "./CustomMultipleSelect.js";
import FormView from "./FormView.js";
import PaginationView from "./PaginationView.js";
import TableView from "./TableView.js";

export default class View {
  constructor(node) {
    this.node = node;
    this.columns = [...new Array(4).fill([]).map(() => [])];
    this.hiddenColumnIndexes = [];
    this.onRowClick = (peopleItem, eye) => {
      this.destroyForm();
      this.renderForm({ 
        ...peopleItem, 
        eyeColor: rgbToHex(eye.getStyle('background-color')),
      })
    };
  }

  renderPage() {
    this.renderHeader();
    this.main = new Component(this.node, 'main', 'main', '')
    this.renderSelect();
    this.renderTableContainer();
    this.renderPreloader();
    this.renderPagination();
  }

  renderHeader() {
    this.header = new Component(this.node, 'header', 'header', '');
    this.headerTitle = new Component(this.node, 'h1', 'header__title', 'Page title');
  }

  renderSelect() {
    this.select = new CustomMultipleSelect(this.main.node, 'div', 'select', '', TABLE_HEADER, (i) => {
      const foundElement = this.hiddenColumnIndexes.find((value) => value === i);
      
      if (foundElement !== undefined) {
        this.hiddenColumnIndexes = this.hiddenColumnIndexes.filter((value) => value !== i);
        this.toggleColumnDisplay(false, i);
      } else {
        this.hiddenColumnIndexes.push(i);
        this.toggleColumnDisplay(true, i);
      }
    }, this.hiddenColumnIndexes);
  }

  renderTableContainer() {
    this.tableSection = new Component(this.main.node, 'section', 'table-section', '');
    this.tableContainer = new Component(this.tableSection.node, 'div', 'table-container', '');
  }

  renderTable(data, pageNumber, ordersType) {
    this.table = new TableView(this.tableContainer.node, 'table', 'table', '', this.hiddenColumnIndexes, this.onRowClick, this.onSort, ordersType);
    this.table.renderTableHead();
    this.table.renderTableBody(data, pageNumber);
    if (this.hiddenColumnIndexes.length) {
      this.hiddenColumnIndexes.forEach((value) => {
        this.toggleColumnDisplay(true, value);
      })
    }
  }

  destroyTable() {
    if (this.table) {
      this.table.destroy();
    }
  }

  renderPreloader() {
    this.preloader = new Component(this.tableContainer.node, 'div', 'preloader', '');
    const dot = new Component(this.preloader.node, 'div', 'preloader__dot', '');
    const dotsList = new Component(this.preloader.node, 'div', 'preloader__dots-list', '');
    new Component(dotsList.node, 'span', '', '');
    new Component(dotsList.node, 'span', '', '');
    new Component(dotsList.node, 'span', '', '');
  }

  destroyPreloader() {
    this.preloader.destroy();
  }

  renderErrorMessage(msg) {
    this.errorMessage = new Component(this.tableContainer.node, 'div', 'preloader', msg);
  }

  destroyErrorMessage() {
    if (this.errorMessage) {
      this.errorMessage.destroy();
    }
  }

  toggleColumnDisplay(shouldHide, index) {
    if (shouldHide) {
      this.table.columns[index].forEach((colItem) => {
        colItem.setStyle('display', 'none');
      });
    } else {
      this.table.columns[index].forEach((colItem) => {
        colItem.setStyle('display', colItem.initialDisplayStyle);
      });
    }
    
  }

  renderPagination() {
    this.pagination = new PaginationView(this.main.node, 'div', 'pagination', '', this.paginationClickHandle);
  }

  editPagination(pageNumber, countOfItems) {
    this.pagination.togglePaginationButton(this.pagination.prevButton, pageNumber === 1);
    this.pagination.togglePaginationButton(this.pagination.nextButton, pageNumber === Math.floor(countOfItems / COUNT_PER_PAGE)); 
    this.pagination.setPageNumber(pageNumber);
  }

  destroyPagination() {
    this.paginationContainer.destroy();
  }

  renderForm(peopleItem) {
    this.form = new FormView(this.tableSection.node, 'form', 'form', '', peopleItem, this.sendData).setAttribute('novalidate', 'true');
  }

  destroyForm() {
    if (this.form) {
      this.form.destroy();
    }
  }
}