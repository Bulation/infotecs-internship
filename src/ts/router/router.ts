export default class Router {
  callback: (num: number) => void; // коллбэк, который вызывается при изменении хэша
  constructor(callback: (num: number) => void) {
    this.callback = callback;
    window.onpopstate = () => this.handleHash(); // при любом изменении истории вызывается метод handleHash
    this.handleHash(); // так как при первой загрузке страницы onpopstate не триггерится, то вызываем его вручную
  }

  handleHash() {
    const num = Number(location.hash.slice(1)); // так как хэш представляет из себя значение вида '#3', то вырезаем хэш и оставляем число
    if (num) { // если получилось корректное число, то передаем его в коллбэк
      this.callback(num);
    }
  }
}
