export default class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.registerListeners();
    this.view.renderPage();
    this.model.loadData();
  }

  registerListeners() {
    this.view.paginationClickHandle = (term) => {
      this.model.pageNumber += term;
      this.view.destroyTable();
      this.view.renderPreloader();
      this.model.normalizeData();
    }
    this.view.onSort = (name) => {
      this.model.sortName = name;
      this.model.changeOrders(name);
      this.model.pageNumber = 0;
      this.view.destroyTable();
      this.view.renderPreloader();
      this.model.normalizeData();
    }
    this.view.sendData = (peopleDataItem, id) => {
      this.model.postData(peopleDataItem, id);
      this.view.destroyTable();
      this.view.renderPreloader();
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
  }
}