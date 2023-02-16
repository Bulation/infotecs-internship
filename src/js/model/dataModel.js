import API from "../api/api.js";
import { COUNT_PER_PAGE } from "../constants/constants.js";

export default class DataModel {
  constructor() {
    this._pageNumber = 0;
    this._sortName = '';
    this.ordersType = {
      _firstName: 'asc',
      set firstName(value) {
        this._firstName = value;
      },
      get firstName() {
        return this._firstName
      },
      _lastName: 'asc',
      set lastName(value) {
        this._lastName = value;
      },
      get lastName() {
        return this._lastName
      },
      _about: 'asc',
      set about(value) {
        this._about = value;
      },
      get about() {
        return this._about
      },
      _eyeColor: 'asc',
      set eyeColor(value) {
        this._eyeColor = value;
      },
      get eyeColor() {
        return this._eyeColor;
      },
    };
  }

  get pageNumber() {
    return this._pageNumber;
  }

  set pageNumber(number) {
    if (number < 0 || number > this.peopleData.length / COUNT_PER_PAGE) {
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
      this.normalizeData();
    } catch (e) {
      this.onError('Произошла ошибка при загрузке данных. Попробуйте повторить попозже');
    }
  }

  normalizeData() {
    this.sortData();
    this.sliceData();
    this.onUpdate(this.normalizedPeopleData);
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
    this.normalizedPeopleData = this.peopleData.slice(this.pageNumber * COUNT_PER_PAGE, (this.pageNumber + 1) * COUNT_PER_PAGE)
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