import Component from './component';

export default class Input extends Component<HTMLInputElement> { //прописываем соответсвующий дженерик, чтобы элемент имел тип HTMLInputElement и мы могли иметь доступ к таким особым для него свойствам как value и placeholder
  constructor(
    parentNode: HTMLElement,
    tagName: keyof HTMLElementTagNameMap,
    className = '',
    placeholder = '',
    id = '',
    value = ''
  ) {
    super(parentNode, tagName, className, ''); // устанавливаем атрибуты placeholder и id и значение инпута
    this.setAttribute('placeholder', placeholder);
    this.setAttribute('id', id);
    this.node.value = value;
  }
}
