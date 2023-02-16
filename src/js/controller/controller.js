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
    this.view.getPageNumber = () => this.model.pageNumber;
    this.view.getCountOfItems = () => this.model.countOfItems;
    this.view.sort = (name) => {
      this.model.sortName = name;
      this.model.changeOrders(name);
      this.model.pageNumber = 0;
      this.view.destroyTable();
      this.view.renderPreloader();
      this.model.normalizeData();
    }
    this.view.onSubmit = (peopleDataItem) => {
      this.model.postDataItem(peopleDataItem);
    }
    this.model.onUpdate = (peopleData) => {
      this.view.destroyErrorMessage();
      this.view.destroyPreloader();
      this.view.renderTable(peopleData);
      this.view.destroyPagination();
      this.view.renderPagination();
    }
    this.model.onError = (msg) => {
      this.view.destroyPreloader();
      this.view.renderErrorMessage(msg);
    }
  }
}