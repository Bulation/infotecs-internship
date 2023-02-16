import Component from "../common/component.js";
import Input from "../common/input.js";
import { COUNT_PER_PAGE, TABLE_HEADER } from "../constants/constants.js";
import rgbToHex from "../helperFunctions/rgbToHex.js";

export default class View {
  constructor(node) {
    this.node = node;
    this.columns = [...new Array(4).fill([]).map(() => [])];
    this.hiddenColumnIndexes = [];
  }

  renderPage() {
    this.renderHideButtons();
    this.renderTableContainer();
    this.renderPreloader();
    this.renderPagination();
  }

  renderTable(data) {
    this.table = new Component(this.tableContainer.node, 'table', 'table', '');
    this.renderTableHead();
    this.renderTableBody(data);
  }

  destroyTable() {
    this.table.destroy();
  }

  renderTableContainer() {
    this.tableContainer = new Component(this.node, 'div', 'table-container', '');
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
    this.preloader.destroy();
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

  toggleColumnDisplay(index) {
    const foundElement = this.hiddenColumnIndexes.find((value) => value === index);
    console.log(this.hiddenColumnIndexes, foundElement);
    if (foundElement !== undefined) {
      this.columns[index].forEach((colItem) => {
        colItem.setStyle('display', 'none');
      });
    } else {
      this.columns[index].forEach((colItem) => {
        colItem.setStyle('display', colItem.initialDisplayStyle);
      });
    }
  }

  renderTableHead() {
    this.thead = new Component(this.table.node, 'thead', 'table__head', '');
    const tableHead = new Component(this.thead.node, 'th', 'table__head-item', '');
    this.columns = [...new Array(4).fill([]).map(() => [])];
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
      new Component(row.node, 'td', 'table__col', String(index + 1 + (this.getPageNumber()) * COUNT_PER_PAGE));
      this.columns[0].push(new Component(row.node, 'td', 'table__col', `${item.name.firstName}`));
      this.columns[1].push(new Component(row.node, 'td', 'table__col', `${item.name.lastName}`));
      this.columns[2].push(new Component(row.node, 'td', 'table__col table__col-about', `${item.about}`));
      const eye = new Component(row.node, 'td', 'table__col', '').setStyle('background-color', item.eyeColor);
      this.columns[3].push(eye);
      row.setListener('click', () => {
        this.destroyForm();
        this.renderForm({ ...item, eyeColor: rgbToHex(eye.getStyle('background-color')) });
      });
    });
    if (this.hiddenColumnIndexes.length) {
      this.hiddenColumnIndexes.forEach((value) => {
        this.toggleColumnDisplay(value);
      })
    }
  }

  renderPagination() {
    this.paginationContainer = new Component(this.node, 'div', 'pagination-container', '');
    this.prevButton = new Component(this.paginationContainer.node, 'button', 'btn prev-btn', 'Prev')
      .setListener('click', () => this.paginationClickHandle(-1));
    this.pageNumber = new Component(this.paginationContainer.node, 'div', 'page-number', `${this.getPageNumber() + 1}`);
    this.nextButton = new Component(this.paginationContainer.node, 'button', 'btn next-btn', 'Next')
      .setListener('click', () => this.paginationClickHandle(1));
    this.togglePaginationButton(this.prevButton, this.getPageNumber() === 0);
    this.togglePaginationButton(this.nextButton, this.getPageNumber() + 1 === Math.floor(this.getCountOfItems() / COUNT_PER_PAGE));
  }

  destroyPagination() {
    this.paginationContainer.destroy();
  }

  togglePaginationButton(button, shouldDisable) {
    if (shouldDisable) {
      button.setAttribute('disabled', 'true');
    } else {
      button.removeAttribute('disabled');
    }
  }

  destroyForm() {
    if (this.form) {
      this.form.destroy();
    }
  }
  renderForm(item) {
    this.form = new Component(this.node, 'form', 'form', '').setAttribute('novalidate', 'true').setListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;
      inputsObj.forEach((value) => {
        if (!this.checkValidity(value.input.node, value.errorMsg)) {
          isValid = false;
        }
      });
      if (isValid) {
        this.onSubmit({
          id: item.id,
          name: {
            firstName: inputName.node.value,
            lastName: inputLastName.node.value,
          },
          phone: inputPhone.node.value,
          about: inputAbout.node.value,
          eyeColor: inputEyeColor.node.value,
        })
      }
    });
    const labelName = new Component(this.form.node, 'label', 'label', 'Firstname').setAttribute('for', 'name');
    const inputName = new Input(this.form.node, 'input', 'input', 'Enter firstname', 'name', item.name.firstName)
        .setAttribute('minlength', 2)
        .setListener('input', () => this.checkValidity(inputName.node, nameError));
    const nameError = new Component(this.form.node, 'span', 'error-msg', 'Name must contain at least 2 symbols');
    const labelLastName = new Component(this.form.node, 'label', 'label', 'Lastname').setAttribute('for', 'lastname');
    const inputLastName = new Input(this.form.node, 'input', 'input', 'Enter lastname', 'lastname', item.name.lastName)
        .setAttribute('minlength', 2)
        .setListener('input', () => this.checkValidity(inputLastName.node, lastNameError));
    const lastNameError = new Component(this.form.node, 'span', 'error-msg', 'Lastname must contain at least 2 symbols');
    const labelAbout = new Component(this.form.node, 'label', 'label', 'About').setAttribute('for', 'about');
    const inputAbout = new Input(this.form.node, 'textarea', 'textarea', 'Enter info about', 'about', item.about);
    const labelPhone = new Component(this.form.node, 'label', 'label', 'Phone').setAttribute('for', 'phone');
    const inputPhone = new Input(this.form.node, 'input', 'input', 'Enter phone info', 'phone', item.phone)
        .setAttribute('type', 'tel')
        .setAttribute('pattern', "^(\\+)?7(\\s+)?\\(?[0-9]{3}\\)?(\\s+)?[0-9]{3}(-|\\s+)?[0-9]{4}$")
        .setListener('input', () => this.checkValidity(inputPhone.node, phoneError));
    const phoneError = new Component(this.form.node, 'span', 'error-msg', 'Phone must me written with 11 digits, example - +7 (999) 999-9999');
    const labelEyeColor = new Component(this.form.node, 'label', 'label', 'Eye color').setAttribute('for', 'eyecolor');
    const inputEyeColor = new Input(this.form.node, 'input', 'input', '', 'eyecolor', item.eyeColor)
        .setAttribute('type', 'color');
    const submitBtn = new Component(this.form.node, 'button', 'btn', 'Submit').setAttribute('type', 'submit');
    const resetBtn = new Component(this.form.node, 'button', 'btn', 'Reset').setAttribute('type', 'button').setListener('click', () => {
      inputName.setAttribute('value', item.name.firstName)
      inputLastName.setAttribute('value', item.name.lastName)
      inputAbout.setAttribute('value', item.about)
      inputPhone.setAttribute('value', item.phone)
      inputEyeColor.setAttribute('value', item.eyeColor)
    });
    const inputsObj = [
      {
        input: inputName, 
        errorMsg: nameError,
      }, 
      {
        input: inputLastName,
        errorMsg: lastNameError,
      },
      {
        input: inputPhone,
        errorMsg: phoneError
      }
    ];
  }

  checkValidity(input, error) {
    console.log(input, input.validity)
    if (!input.validity.valid || !input.value.length) {
      error.setClass('active-error');
      return false;
    } else {
      error.removeClass('active-error');
      return true;
    }
  }
}