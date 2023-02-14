import Component from './component';

export default class Popup extends Component {
  constructor(
    parent,
    tagName,
    className,
    content,
    popupContent
  ) {
    super(parent, tagName, className, content);
    this.overlay = new Component(this.node, 'div', 'popup-wrapper popup-animated', '');
    this.title = new Component(this.overlay.node, 'h2', '', popupContent);
    this.overlay.setListener('animationend', () => this.overlay.removeClass('popup-animated'));
  }

  destroy() {
    this.overlay.setListener('animationend', () => this.node.remove());
    this.overlay.setClass('popup-animate-out');
  }
}