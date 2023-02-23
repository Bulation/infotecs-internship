import StorageModel from "../model/StorageModel.js";
import Router from "../router/router.js";

export default class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.storageModel = new StorageModel();
    this.loadDataFromStorage();
    this.registerListeners();
    this.view.renderPage();
    this.model.loadData().then(() => {
      this.model.onUpdate(this.model.sliceData());
      this.router = new Router(this.model, () => {
        this.changeDataView();
        this.model.onUpdate(this.model.sliceData());
      });
    });
  }

  loadDataFromStorage() {
    if (this.storageModel.hasKey('hiddenColumnIndexes')) {
      this.view.hiddenColumnIndexes = this.storageModel.load('hiddenColumnIndexes');
    }
  }

  changeDataView() {
    this.view.destroyTable();
    this.view.renderPreloader();
  }

  registerListeners() {
    this.view.paginationClickHandle = (term) => {
      location.hash = this.model.pageNumber + term;
    }
    this.view.onSort = (name) => {
      this.model.sortName = name;
      this.model.changeOrders(name);
      location.hash = 1;
      this.changeDataView();
      this.model.sortData();
      this.model.onUpdate(this.model.sliceData());
    }
    this.view.sendData = async (peopleDataItem, id) => {
      this.changeDataView();
      await this.model.postData(peopleDataItem, id);
      await this.model.loadData();
      this.model.sortData();
      this.model.onUpdate(this.model.sliceData());
    }
    this.model.onUpdate = (peopleData) => {
      this.view.destroyErrorMessage();
      this.view.destroyPreloader();
      this.view.renderTable(peopleData, this.model.pageNumber);
      this.view.editPagination(this.model.pageNumber, this.model.countOfItems);
    }
    this.model.onError = (msg) => {
      this.view.destroyPreloader();
      this.view.renderErrorMessage(msg);
    }
    window.onbeforeunload = () => {
      this.storageModel.save('hiddenColumnIndexes', this.view.hiddenColumnIndexes);
    }
    document.body.onclick = (e) => {
      console.log(e.target);
      if (this.view.select.isOptionsOpen && !this.view.select.node.contains(e.target)) {
        this.view.select.optionsList.destroy();
        this.view.select.isOptionsOpen = false;
      }
    }
  }
}