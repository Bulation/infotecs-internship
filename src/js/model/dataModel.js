import API from "../api/api.js";
import { COUNT_PER_PAGE } from "../constants/constants.js";

export default class DataModel {
  constructor() {
    this._pageNumber = 1;
    this._sortName = '';
    this.ordersType = {
      firstName: 'asc',
      lastName: 'asc',
      about: 'asc',
      eyeColor: 'asc',
    };
  }

  get pageNumber() {
    return this._pageNumber;
  }

  set pageNumber(number) {
    if (number < 1 || number > this.peopleData.length / COUNT_PER_PAGE) {
      this.onError('Неверный номер страницы');
      return;
    }
    this._pageNumber = number;
  }

  get sortName() {
    return this._sortName;
  }

  set sortName(name) {
    this._sortName = name;
  }

  async loadData() {
    try {
      this.peopleData = await API.getData();
      this.countOfItems = this.peopleData.length;
    } catch (e) {
      this.onError('Произошла ошибка при загрузке данных. Попробуйте повторить попозже');
    }
  }

  async postData(peopleItem, id) {
    try {
      await API.updateDataItem(peopleItem, id);
    } catch (e) {
      this.onError('Произошла ошибка при отправке данных. Попробуйте повторить попозже');
    }
  }

  sortData() {
    this.peopleData.sort((a, b) => this.comparatorCallback(a, b));
  }

  comparatorCallback(a, b) {
    let firstValue = a[this.sortName];
    let secondValue = b[this.sortName]
    if (this.sortName === 'firstName' || this.sortName === 'lastName') {
      firstValue = a['name'][this.sortName];
      secondValue = b['name'][this.sortName]
    }
    if (firstValue < secondValue) {
      return this.ordersType[this.sortName] === 'asc' ? -1 : 1;
    } else {
      return this.ordersType[this.sortName] === 'asc' ? 1 : -1;
    }
  }

  sliceData() {
    return this.peopleData.slice((this.pageNumber - 1) * COUNT_PER_PAGE, this.pageNumber * COUNT_PER_PAGE)
  }

  changeOrders(name) {
    this.ordersType[name] === 'asc' ? this.ordersType[name] = 'desc' : this.ordersType[name] = 'asc';
    Object.keys(this.ordersType).map((key) => {
      if (key !== name) {
        this.ordersType[key] = 'asc';
      }
    });
  }
}