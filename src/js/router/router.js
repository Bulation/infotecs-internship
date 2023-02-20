export default class Router {
  constructor(model, callback) {
    this.model = model;
    this.callback = callback;
    window.onpopstate = () => this.handleHash();
    window.onpopstate();
  }

  handleHash() {
    const num = Number(location.hash.slice(1));
    console.log(num);
    if (num) {
      this.model.pageNumber = num;
      this.callback();
    }
  }
}