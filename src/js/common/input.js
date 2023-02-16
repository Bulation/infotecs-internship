import Component from "./component.js";

export default class Input extends Component {
  constructor(parentNode, tagName, className = '', placeholder = '', id, value = '') {
    super(parentNode, tagName, className, '');
    this.setAttribute('placeholder', placeholder);
    this.setAttribute('id', id);
    this.node.value = value;
  }
}