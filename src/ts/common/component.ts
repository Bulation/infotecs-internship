export default class Component<T extends HTMLElement = HTMLElement> { // дженерик наследуется от класса HTMLElement, чтобы мы могли создавать разные разные типы элементов и обращаться к свойствам, которые есть только у них, но не у HTMLElement
  public node: T; // сам HTML элемент
  parentNode: HTMLElement; // его родитель
  initialDisplayStyle: string; // значение свойства display, которое было изначально при создании. Необходимо для корректного отображения колонок таблицы

  constructor(
    parentNode: HTMLElement,
    tagName: keyof HTMLElementTagNameMap,
    className = '',
    content = ''
  ) {
    const el = document.createElement(tagName) as T; // создается элемент, затем идет прописывание классов и контента и добавление в родителя, родитель, элемент и значение свойства display прописываются в свойства объекта
    el.className = className;
    el.textContent = content;
    parentNode.append(el);
    this.parentNode = parentNode;
    this.node = el;
    this.initialDisplayStyle = this.getStyle('display');
  }

  setClass(className: string) { // добавляем класс в список классов
    this.node.classList.add(className);
    return this; // возвращаем текущий объект, чтобы мы могли чейнить несколько методов
  }

  hasClass(className: string) { // возвращает булево значение, которое будет оповещать о том, содержится ли класс в элементе или нет
    return this.node.classList.contains(className);
  }

  removeClass(className: string) { // удаление класса из элемента
    this.node.classList.remove(className);
    return this;
  }

  setStyle(styleName: string, value: string) { // добавляем свойство в стили
    this.node.style.setProperty(styleName, value);
    return this;
  }

  getStyle(styleName: string) { // получаем свойство из стилей
    return getComputedStyle(this.node).getPropertyValue(styleName);
  }

  setAttribute(attribute: string, value: string) { // добавляем атрибут в элемент
    this.node.setAttribute(attribute, value);
    return this;
  }

  getAttribute(attribute: string) { // получаем атрибут из элемента
    return this.node.getAttribute(attribute);
  }

  removeAttribute(attribute: string) { // удаляем атрибут из элемента
    this.node.removeAttribute(attribute);
    return this;
  }

  setListener(
    event: keyof HTMLElementEventMap,
    callback: (e?: Event) => void,
    params?: boolean | AddEventListenerOptions
  ) { // устанавливаем слушатель для элемента
    this.node.addEventListener(event, callback, params);
    return this;
  }

  setContent(content: string) { // перезаписываем текст внутри элемента
    this.node.textContent = content;
    return this;
  }

  destroy() { // уничтожаем элемент в DOM
    this.node.remove();
  }
}
