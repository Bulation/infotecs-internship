import Component from "../common/component.js";

export default class CustomMultipleSelect extends Component {
  constructor(parentNode, tagName, className = '', content = '', options, onSelect, checkedIndexes) {
    super(parentNode, tagName, className, content);
    this.setAttribute('role', 'select');
    this.isOptionsOpen = false;
    this.checkedIndexes = checkedIndexes.slice();
    this.placeholderContainer = new Component(this.node, 'div', 'select-placeholder', '').setListener('click', () => {
      if (this.isOptionsOpen) {
        this.optionsList.destroy();
        this.isOptionsOpen = false;
      } else {
        this.isOptionsOpen = true;
        this.optionsList = new Component(this.node, 'ul', 'select-options-list', '')
        options.forEach((content, i) => {
          const option = new Component(this.optionsList.node, 'li', 'select-options-list__option', content).setListener('click', () => {
            onSelect(i);
            if (checkbox.hasClass('select-options-list__option-checkbox_selected')) {
              this.checkedIndexes = this.checkedIndexes.filter((value) => value !== i);
              checkbox.removeClass('select-options-list__option-checkbox_selected');
              сheckbox.setAttribute('aria-checked', 'false');
              option.setAttribute('aria-selected', 'false');
            } else {
              this.checkedIndexes.push(i);
              checkbox.setClass('select-options-list__option-checkbox_selected');
              сheckbox.setAttribute('aria-checked', 'true');
              option.setAttribute('aria-selected', 'true');
            }
          }).setAttribute('role', 'option')
          const checkbox = new Component(option.node, 'span', 'select-options-list__option-checkbox', '').setAttribute('role', 'checkbox')
          if (this.checkedIndexes.find((value) => value === i) !== undefined) {
            checkbox.setClass('select-options-list__option-checkbox_selected');
          }
        });
      }
    });
    this.placeholder = new Component(this.placeholderContainer.node, 'div', 'select-placeholder__text', 'Hide column')
      .setAttribute('aria-label', 'Open select')
      .setAttribute('title', 'Open select');
    this.placeholderIcon = new Component(this.placeholderContainer.node, 'span', 'select-placeholder__icon', '');
  }
}