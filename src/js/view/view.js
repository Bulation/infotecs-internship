import Component from "../common/component.js";
import { COUNT_PER_PAGE, TABLE_HEADER } from "../constants/constants.js";
import rgbToHex from "../helperFunctions/rgbToHex.js";
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
    this.renderHideButtons();
    this.renderTableContainer();
    this.renderPreloader();
    this.renderPagination();
  }

  renderHideButtons() {
    this.buttonsContainer = new Component(this.node, 'div', 'buttons-container', '');
    TABLE_HEADER.forEach((name, i) => {
      const button = new Component(this.buttonsContainer.node, 'button', '', `Hide/show ${name}`);
      button.setListener('click', () => {
        const foundElement = this.hiddenColumnIndexes.find((value) => value === i);
        if (foundElement !== undefined) {
          this.hiddenColumnIndexes = this.hiddenColumnIndexes.filter((value) => value !== i);
        } else {
          this.hiddenColumnIndexes.push(i);
        }
        this.toggleColumnDisplay(i);
      });
    });
  }

  renderTableContainer() {
    this.tableContainer = new Component(this.node, 'div', 'table-container', '');
  }

  renderTable(data, pageNumber) {
    this.table = new TableView(this.tableContainer.node, 'table', 'table', '', this.hiddenColumnIndexes, this.onRowClick, this.onSort);
    this.table.renderTableHead();
    this.table.renderTableBody(data, pageNumber);
    if (this.hiddenColumnIndexes.length) {
      this.hiddenColumnIndexes.forEach((value) => {
        this.toggleColumnDisplay(value);
      })
    }
  }

  destroyTable() {
    this.table.destroy();
  }

  renderPreloader() {
    this.preloader = new Component(this.tableContainer.node, 'div', 'preloader', 'Загрузка...');
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

  toggleColumnDisplay(index) {
    const foundElement = this.hiddenColumnIndexes.find((value) => value === index);
    if (foundElement !== undefined) {
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
    this.pagination = new PaginationView(this.node, 'div', 'pagination-container', '', this.paginationClickHandle);
  }

  editPagination(pageNumber, countOfItems) {
    this.pagination.togglePaginationButton(this.pagination.prevButton, pageNumber === 0);
    this.pagination.togglePaginationButton(this.pagination.nextButton, pageNumber + 1 === Math.floor(countOfItems / COUNT_PER_PAGE)); 
    this.pagination.setPageNumber(pageNumber + 1);
  }

  destroyPagination() {
    this.paginationContainer.destroy();
  }

  renderForm(peopleItem) {
    this.form = new FormView(this.node, 'form', 'form', '', peopleItem, this.sendData);
  }

  destroyForm() {
    if (this.form) {
      this.form.destroy();
    }
  }
}