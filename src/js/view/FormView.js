import Component from "../common/component.js";
import Input from "../common/input.js";

export default class FormView extends Component {
  constructor(parentNode, tagName, className = '', content = '', peopleItem, onSend) {
    super(parentNode, tagName, className, content);
    this.peopleItem = peopleItem;
    this.renderFormBody();
    this.setListener('submit', (e) => this.onSubmit(e));
    this.inputsObj = [
      {
        input: this.inputName, 
        errorMsg: this.nameError,
      }, 
      {
        input: this.inputLastName,
        errorMsg: this.lastNameError,
      },
      {
        input: this.inputPhone,
        errorMsg: this.phoneError,
      }
    ];
    this.onSend = onSend;
  }

  renderFormBody() {
    this.labelName = new Component(this.node, 'label', 'label', 'Firstname').setAttribute('for', 'name');
    this.inputName = new Input(this.node, 'input', 'input', 'Enter firstname', 'name', this.peopleItem.name.firstName)
        .setAttribute('minlength', 2)
        .setListener('input', () => this.checkValidity(this.inputName.node, this.nameError));
    this.nameError = new Component(this.node, 'span', 'error-msg', 'Name must contain at least 2 symbols');
    this.labelLastName = new Component(this.node, 'label', 'label', 'Lastname').setAttribute('for', 'lastname');
    this.inputLastName = new Input(this.node, 'input', 'input', 'Enter lastname', 'lastname', this.peopleItem.name.lastName)
        .setAttribute('minlength', 2)
        .setListener('input', () => this.checkValidity(this.inputLastName.node, this.lastNameError));
    this.lastNameError = new Component(this.node, 'span', 'error-msg', 'Lastname must contain at least 2 symbols');
    this.labelAbout = new Component(this.node, 'label', 'label', 'About').setAttribute('for', 'about');
    this.inputAbout = new Input(this.node, 'textarea', 'textarea', 'Enter info about', 'about', this.peopleItem.about);
    this.labelPhone = new Component(this.node, 'label', 'label', 'Phone').setAttribute('for', 'phone');
    this.inputPhone = new Input(this.node, 'input', 'input', 'Enter phone info', 'phone', this.peopleItem.phone)
        .setAttribute('type', 'tel')
        .setAttribute('pattern', "^(\\+)?7(\\s+)?\\(?[0-9]{3}\\)?(\\s+)?[0-9]{3}(-|\\s+)?[0-9]{4}$")
        .setListener('input', () => this.checkValidity(this.inputPhone.node, this.phoneError));
    this.phoneError = new Component(this.node, 'span', 'error-msg', 'Phone must me written with 11 digits, example - +7 (999) 999-9999');
    this.labelEyeColor = new Component(this.node, 'label', 'label', 'Eye color').setAttribute('for', 'eyecolor');
    this.inputEyeColor = new Input(this.node, 'input', 'input', '', 'eyecolor', this.peopleItem.eyeColor)
        .setAttribute('type', 'color');
    this.submitBtn = new Component(this.node, 'button', 'btn', 'Submit').setAttribute('type', 'submit');
    this.resetBtn = new Component(this.node, 'button', 'btn', 'Reset').setAttribute('type', 'button').setListener('click', () => {
      this.destroy();
    });
  }

  onSubmit(e) {
    e.preventDefault();
    let isValid = true;
    this.inputsObj.forEach((value) => {
      if (!this.checkValidity(value.input.node, value.errorMsg)) {
        isValid = false;
      }
    });
    if (isValid) {
      this.onSend({
        name: {
          firstName: this.inputName.node.value,
          lastName: this.inputLastName.node.value,
        },
        phone: this.inputPhone.node.value,
        about: this.inputAbout.node.value,
        eyeColor: this.inputEyeColor.node.value,
      }, this.peopleItem.id);
      this.destroy();
    }
  }

  checkValidity(input, error) {
    if (!input.validity.valid || !input.value.length) {
      error.setClass('active-error');
      return false;
    } else {
      error.removeClass('active-error');
      return true;
    }
  }
}