import Component from "../common/component.js";
import Input from "../common/input.js";
import { LASTNAME_ERROR_MSG, NAME_ERROR_MSG, PHONE_ERROR_MSG, PHONE_PATTERN } from "../constants/constants.js";

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
    this.labelName = new Component(this.node, 'label', 'form__label', 'Firstname').setAttribute('for', 'name');
    this.inputName = new Input(this.node, 'input', 'form__input', 'Enter firstname', 'name', this.peopleItem.name.firstName)
        .setAttribute('minlength', 2)
        .setListener('input', () => this.checkValidity(this.inputName.node, this.nameError));
    this.nameError = new Component(this.node, 'span', 'form__error-msg', NAME_ERROR_MSG);
    this.labelLastName = new Component(this.node, 'label', 'form__label', 'Lastname').setAttribute('for', 'lastname');
    this.inputLastName = new Input(this.node, 'input', 'form__input', 'Enter lastname', 'lastname', this.peopleItem.name.lastName)
        .setAttribute('minlength', 2)
        .setListener('input', () => this.checkValidity(this.inputLastName.node, this.lastNameError));
    this.lastNameError = new Component(this.node, 'span', 'form__error-msg', LASTNAME_ERROR_MSG);
    this.labelAbout = new Component(this.node, 'label', 'form__label', 'About').setAttribute('for', 'about');
    this.inputAbout = new Input(this.node, 'textarea', 'form__textarea', 'Enter info about', 'about', this.peopleItem.about);
    this.labelPhone = new Component(this.node, 'label', 'form__label', 'Phone').setAttribute('for', 'phone');
    this.inputPhone = new Input(this.node, 'input', 'form__input', 'Enter phone info', 'phone', this.peopleItem.phone)
        .setAttribute('type', 'tel')
        .setAttribute('pattern', PHONE_PATTERN)
        .setListener('input', () => this.checkValidity(this.inputPhone.node, this.phoneError));
    this.phoneError = new Component(this.node, 'span', 'form__error-msg', PHONE_ERROR_MSG);
    this.labelEyeColor = new Component(this.node, 'label', 'form__label', 'Eye color').setAttribute('for', 'eyecolor');
    this.inputEyeColor = new Input(this.node, 'input', 'form__input-eye-color', '', 'eyecolor', this.peopleItem.eyeColor)
        .setAttribute('type', 'color');
    this.submitBtn = new Component(this.node, 'button', 'btn form__btn', 'Submit').setAttribute('type', 'submit');
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
      error.setClass('form__error-msg_active');
      this.submitBtn.setAttribute('disabled', 'true')
      return false;
    } else {
      error.removeClass('form__error-msg_active');
      this.submitBtn.removeAttribute('disabled');
      return true;
    }
  }
}