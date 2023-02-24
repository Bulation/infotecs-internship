import API from '../api/api';
import { COLORS_NAME, COUNT_PER_PAGE, DATA_ERROR_MSG } from '../constants/constants';
import { PeopleData } from '../interfaces/PeopleData';
import { SortNameType } from '../types/SortNameType';
import { OrdersType } from '../types/OrdersType';

export default class DataModel {
  private _sortName: SortNameType | ''; // название колонки, которую надо отсортировать
  ordersType: OrdersType; // объект, который содержит порядок сортировки для всех колонок
  private _pageNumber: number; // номер страницы
  onError: (msg: string) => void; // метод для отображения сообщения об ошибке. Реализуется в контроллере
  onUpdate: (data: PeopleData[]) => void; // метод, вызываемый при обновлении данных для обновления вьюхи. Реализуется в контроллере
  peopleData: PeopleData[]; // массив, содержащий данные
  countOfItems: number; // количество элементов в массиве
  constructor() {
    this._pageNumber = 1; // присваиваем дефолтные значения
    this._sortName = '';
    this.ordersType = {
      firstName: 'desc',
      lastName: 'asc',
      about: 'asc',
      eyeColor: 'asc',
    };
  }

  set sortName(name: SortNameType | '') {
    this._sortName = name;
  }

  get sortName() {
    return this._sortName;
  }

  set pageNumber(number: number) { 
    if (number < 1 || number > this.peopleData.length / COUNT_PER_PAGE) { // если номер страницы некорректный, то присваивается дефолтное значение
      this._pageNumber = 1;
      return;
    }
    this._pageNumber = number;
  }

  get pageNumber() {
    return this._pageNumber;
  }

  async loadData() {
    try {
      this.peopleData = await API.getData(); // загрузка данных из API
      this.peopleData = this.peopleData.map((peopleObject) => {
        return { // преобразуем данные, а именно цвет глаз. Так как в исходных данных указан цвет текстом, а input color его не принимает, то текст меняем на HEX значение
          ...peopleObject,
          eyeColor: COLORS_NAME[peopleObject.eyeColor as keyof typeof COLORS_NAME]
            ? COLORS_NAME[peopleObject.eyeColor as keyof typeof COLORS_NAME]
            : peopleObject.eyeColor,
        };
      });
      this.countOfItems = this.peopleData.length; // сохраняет количество элементов в массиве
    } catch (e) { // если при загрузке случилась ошибка, то отображаем информацию на странице
      this.onError(DATA_ERROR_MSG);
    }
  }

  async postData(peopleItem: PeopleData, id: string) { // обновляем объект с айдишником id, peopleItem содержит данные из формы
    try {
      await API.updateDataItem(peopleItem, id);
    } catch (e) {
      this.onError(DATA_ERROR_MSG);
    }
  }

  sortData() { // сортируем данные с помощью функции-компаратора
    this.peopleData.sort((a, b) => this.comparatorCallback(a, b));
  }

  comparatorCallback(a: PeopleData, b: PeopleData) { // a и b - соседние значения
    let firstValue = a[this.sortName as keyof typeof a]; // получаем значение того свойства, по которому надо отсортировать данные
    let secondValue = b[this.sortName as keyof typeof b];
    if (this.sortName === 'firstName' || this.sortName === 'lastName') { // если надо отсортировать по имени или фамилии, то получаем эти свойства из объекта name
      firstValue = a['name'][this.sortName];
      secondValue = b['name'][this.sortName];
    }
    if (firstValue < secondValue) { // если первое значение меньше по значению юникода и порядок сортировки указан по возрастанию, то первое значение будет содержаться по меньшему индексу, то есть идет первее, так как возращается -1, иначе первее будет идти второе значение
      return this.ordersType[this.sortName as keyof typeof this.ordersType] === 'asc' ? -1 : 1;
    } else {
      // если первое значение больше или равно по значению юникода и порядок сортировки указан по возрастанию, то первое значение будет содержаться по большему индексу, то есть идет после второго значения, так как возращается 1, иначе первее будет идти первое значение
      return this.ordersType[this.sortName as keyof typeof this.ordersType] === 'asc' ? 1 : -1;
    }
  }

  sliceData() { // возвращаем массив, содержащий 10 элементов в зависимости от номера страницы. Если номер страницы = 3, то вернется массив с 20 до 30 элемента
    return this.peopleData.slice(
      (this.pageNumber - 1) * COUNT_PER_PAGE,
      this.pageNumber * COUNT_PER_PAGE
    );
  }

  changeOrders(name: SortNameType) { // меняем порядок сортировки для всех колонок
    this.ordersType[name as keyof typeof this.ordersType] === 'asc' // если была кликнут заголовок с именем name, то порядок сортировки меняется с asc на desc или же c desc на asc. Все остальные значения сбрасывается к значению по умолчанию
      ? (this.ordersType[name as keyof typeof this.ordersType] = 'desc')
      : (this.ordersType[name as keyof typeof this.ordersType] = 'asc');
    Object.keys(this.ordersType).map((key) => {
      if (key !== name) {
        this.ordersType[key as keyof typeof this.ordersType] = 'asc';
      }
    });
  }
}
