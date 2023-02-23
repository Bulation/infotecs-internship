import Component from "../common/component.js";

export default class CustomMultipleSelect extends Component {
  constructor(parentNode, tagName, className = '', content = '', options, onSelect, hiddenIndexes) {
    super(parentNode, tagName, className, content);
    this.isOptionsOpen = false;
    this.placeholder = new Component(this.node, 'div', 'select-placeholder', 'Hide column').setListener('click', () => {
      if (this.isOptionsOpen) {
        this.optionsList.destroy();
        this.isOptionsOpen = false;
      } else {
        this.isOptionsOpen = true;
        this.optionsList = new Component(this.node, 'ul', 'select-options-list', '')
        options.forEach((content, i) => {
          const option = new Component(this.optionsList.node, 'li', 'select-options-list__option', content).setListener('click', () => {
            onSelect(i);
            if (checkbox.hasClass('selected')) {
              checkbox.removeClass('selected');
            } else {
              checkbox.setClass('selected');
            }
          })
          const checkbox = new Component(option.node, 'span', 'select-options-list__option-checkbox', '');
          if (hiddenIndexes.find((value) => value === i)) {
            checkbox.setClass('selected');
          }
        });
      }
    });
  }
}