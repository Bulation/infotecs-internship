export default class Component {

  constructor(parentNode, tagName, className = '', content = '') {
    const el = document.createElement(tagName);
    el.className = className;
    el.textContent = content;
    if (parentNode) {
      parentNode.append(el);
    }
    this.parentNode = parentNode;
    this.node = el;
    this.initialDisplayStyle = this.getStyle('display');
  }

  setClass(className) {
    this.node.classList.add(className);
    return this;
  }

  hasClass(className) {
    return this.node.classList.contains(className);
  }

  removeClass(className) {
    this.node.classList.remove(className);
    return this;
  }

  setStyle(styleName, value) {
    this.node.style.setProperty(styleName, value);
    return this;
  }

  getStyle(styleName) {
    return getComputedStyle(this.node)[styleName];
  }

  setAttribute(attribute, value) {
    this.node.setAttribute(attribute, value);
    return this;
  }

  getAttribute(attribute) {
    return this.node.getAttribute(attribute);
  }

  removeAttribute(attribute) {
    this.node.removeAttribute(attribute);
    return this;
  }

  setListener(event, callback, params = null) {
    this.node.addEventListener(event, callback, params);
    return this;
  }

  setContent(content) {
    this.node.textContent = content;
    return this;
  }

  destroy() {
    this.node.remove();
  }
}