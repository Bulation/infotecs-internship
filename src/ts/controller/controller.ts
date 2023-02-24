import DataModel from '../model/dataModel';
import StorageModel from '../model/StorageModel';
import Router from '../router/router';
import View from '../view/AppView';
import { SortNameType } from '../types/SortNameType';
import { PeopleData } from '../interfaces/PeopleData';

export default class Controller {
  model: DataModel;
  view: View;
  storageModel: StorageModel;
  router: Router;
  constructor(model: DataModel, view: View) {
    this.model = model;
    this.view = view;
    this.storageModel = new StorageModel();
    this.loadDataFromStorage(); // загружаем данные из local storage
    this.registerListeners(); // прописывем методы классов для связывания model и view и обработчики для window и document.body
    this.view.renderPage(); // рендер страницы
    this.model.loadData().then(() => {
      // загружаем данные и после этого их сортируем, отображаем на странице, создаем роутер для обработки хэша
      this.model.sortData();
      this.model.onUpdate(this.model.sliceData()); // отображаем не все данные, а 10 элементов, поэтому вызываем метод sliceData
      this.router = new Router((num) => {
        // передаем коллбэк, который будет вызван при изменении хэша
        this.model.pageNumber = num;
        this.changeDataView();
        this.model.onUpdate(this.model.sliceData());
      });
    });
  }

  loadDataFromStorage() {
    // загружаем данные из local storage, если они там есть
    if (this.storageModel.hasKey('hiddenColumnIndexes')) {
      this.view.hiddenColumnIndexes = this.storageModel.load('hiddenColumnIndexes'); // загружаем массив индексов скрытых колонок
    }
    if (this.storageModel.hasKey('sortName')) {
      this.model.sortName = this.storageModel.load('sortName'); // загружаем название колонки, которую нужно отсортировать
    }
    if (this.storageModel.hasKey('orders')) {
      this.model.ordersType = this.storageModel.load('orders'); // загружаем объект с порядком сортировки
    }
  }

  changeDataView() {
    // метод, который вызывается, если нужно перерендерить таблицу
    this.view.destroyTable();
    this.view.renderPreloader();
  }

  registerListeners() {
    this.view.paginationClickHandle = (term: number) => {
      // term может принимать значения 1 и -1. Если передана 1, то будет отображена следующая страница, если -1, то предыдущая
      location.hash = String(this.model.pageNumber + term); // в хэш прописываем номер страницы, которую нужно отобразить
    };
    this.view.onSort = (name: SortNameType) => {
      this.model.sortName = name; // записываем название колонки, которую нужно отсоритировать
      this.model.changeOrders(name); // устанавливаем порядок сортировки для колонок
      location.hash = '1'; // при сортировке сбрасываем номер страницы к единице
      this.changeDataView(); // меняем вид страницы
      this.model.sortData(); // сортируем данные
      this.model.onUpdate(this.model.sliceData()); // обновляем страницу
    };
    this.view.sendData = async (peopleDataItem: PeopleData, id: string) => {
      // метод для обновления данных, peopleDataItem - данные, пришедшие из формы
      this.changeDataView(); // меняем вид страницы
      await this.model.postData(peopleDataItem, id); // обновляем данные
      await this.model.loadData(); // загружаем обновленные данные
      this.model.sortData(); // сортируем данные
      this.model.onUpdate(this.model.sliceData()); // отображаем данные
    };
    this.model.onUpdate = (peopleData: PeopleData[]) => {
      // метод для отображения данных в таблице
      this.view.destroyErrorMessage(); // если было сообщение об ошибке, то уничтожаем его
      this.view.destroyPreloader(); // уничтожаем прелоадер
      this.view.renderTable(peopleData, this.model.pageNumber, this.model.ordersType); // рендерим таблицу в соответствии с данными, передаем данные, номер страницы, порядок сортировки
      this.view.editPagination(this.model.pageNumber, this.model.countOfItems); // меняем отображаемый номер страницы
    };
    this.model.onError = (msg: string) => {
      // если произошла ошибка в ходе загрузки данных, то рендерим блок с сообщением об ошибке
      this.view.destroyPreloader();
      this.view.renderErrorMessage(msg);
    };
    window.onbeforeunload = () => {
      // перед закрытием страницы сохраняем данные в local storage
      this.storageModel.save('hiddenColumnIndexes', this.view.hiddenColumnIndexes);
      this.storageModel.save('sortName', this.model.sortName);
      this.storageModel.save('orders', this.model.ordersType);
    };
    window.onclick = (e) => {
      // если селект открыт, то закрываем его при клике на любую другую область страницы кроме селекта
      if (
        this.view.select.isOptionsOpen && // если селект открыт и кликнутый элемент не содержится в селекте, то закрываем выпадающий лист и флаг открытого селекта переводим в false
        e.target instanceof HTMLElement &&
        !this.view.select.node.contains(e.target)
      ) {
        this.view.select.optionsList.destroy();
        this.view.select.isOptionsOpen = false;
      }
    };
  }
}
