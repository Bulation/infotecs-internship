import Component from '../common/component';
import Input from '../common/input';
import {
  LASTNAME_ERROR_MSG,
  NAME_ERROR_MSG,
  PHONE_ERROR_MSG,
  PHONE_PATTERN,
} from '../constants/constants';
import { PeopleData } from '../interfaces/PeopleData';

export default class FormView extends Component {
  peopleItem: PeopleData; // данные о человеке, которые передаются в форму
  inputsObj: { input: Input; errorMsg: Component }[]; // массив объектов, в объектах содержатся валидируемый инпут и сообщение об ошибке
  inputName: Input;
  nameError: Component;
  inputLastName: Input;
  lastNameError: Component;
  inputPhone: Input;
  phoneError: Component;
  labelName: Component;
  labelLastName: Component;
  labelAbout: Component;
  inputAbout: Input;
  labelPhone: Component;
  labelEyeColor: Component;
  inputEyeColor: Input;
  submitBtn: Component;
  resetBtn: Component;
  onSend: (body: PeopleData, id: string) => void; // метод, в который передаются данные, полученные из формы и id
  constructor(
    parentNode: HTMLElement,
    tagName: keyof HTMLElementTagNameMap,
    className = '',
    content = '',
    peopleItem: PeopleData,
    onSend: (body: PeopleData, id: string) => void
  ) {
    super(parentNode, tagName, className, content);
    this.peopleItem = peopleItem;
    this.renderFormBody(); // рендерим тело формы
    this.setListener('submit', (e) => this.onSubmit(e)); // добавляем слушатель на сабмит, в функции onSubmit идет обработка введенных данных
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
      },
    ];
    this.onSend = onSend;
  }

  renderFormBody() { // создаем инпуты, лейблы, сообщения об ошибке и кнопки
    this.labelName = new Component(this.node, 'label', 'form__label', 'Firstname').setAttribute(
      'for',
      'name'
    );
    this.inputName = new Input(
      this.node,
      'input',
      'form__input',
      'Enter firstname',
      'name',
      this.peopleItem.name.firstName
    )
      .setAttribute('minlength', '2') // минимальная длина имени должна быть равна 2
      .setListener('input', () => this.checkValidity(this.inputName.node, this.nameError)); // при каждом вводе символа проверяется, валидный инпут или нет
    this.nameError = new Component(this.node, 'span', 'form__error-msg', NAME_ERROR_MSG);
    this.labelLastName = new Component(this.node, 'label', 'form__label', 'Lastname').setAttribute(
      'for',
      'lastname'
    );
    this.inputLastName = new Input(
      this.node,
      'input',
      'form__input',
      'Enter lastname',
      'lastname',
      this.peopleItem.name.lastName
    )
      .setAttribute('minlength', '2')
      .setListener('input', () => this.checkValidity(this.inputLastName.node, this.lastNameError));
    this.lastNameError = new Component(this.node, 'span', 'form__error-msg', LASTNAME_ERROR_MSG);
    this.labelAbout = new Component(this.node, 'label', 'form__label', 'About').setAttribute(
      'for',
      'about'
    );
    this.inputAbout = new Input(
      this.node,
      'textarea',
      'form__textarea',
      'Enter info about',
      'about',
      this.peopleItem.about
    );
    this.labelPhone = new Component(this.node, 'label', 'form__label', 'Phone').setAttribute(
      'for',
      'phone'
    );
    this.inputPhone = new Input(
      this.node,
      'input',
      'form__input',
      'Enter phone info',
      'phone',
      this.peopleItem.phone
    )
      .setAttribute('type', 'tel')
      .setAttribute('pattern', PHONE_PATTERN)
      .setListener('input', () => this.checkValidity(this.inputPhone.node, this.phoneError));
    this.phoneError = new Component(this.node, 'span', 'form__error-msg', PHONE_ERROR_MSG);
    this.labelEyeColor = new Component(this.node, 'label', 'form__label', 'Eye color').setAttribute(
      'for',
      'eyecolor'
    );
    this.inputEyeColor = new Input(
      this.node,
      'input',
      'form__input-eye-color',
      '',
      'eyecolor',
      this.peopleItem.eyeColor
    ).setAttribute('type', 'color');
    this.submitBtn = new Component(this.node, 'button', 'btn form__btn', 'Submit').setAttribute(
      'type',
      'submit'
    );
    this.resetBtn = new Component(this.node, 'button', 'btn', 'Reset')
      .setAttribute('type', 'button')
      .setListener('click', () => {
        this.destroy(); // при нажатии на кнопку форма уничтожается
      });
  }

  onSubmit(e: Event) {
    e.preventDefault(); // отключаем дефолтное поведение
    let isValid = true; // флаг, отображающий, валидная форма или нет
    this.inputsObj.forEach((value) => { // проверяем валидность инпутов
      if (!this.checkValidity(value.input.node, value.errorMsg)) {
        isValid = false;
      }
    });
    if (isValid) { // если форма валидна, то отправляем данные и уничтожаем форму
      this.onSend(
        {
          name: {
            firstName: this.inputName.node.value,
            lastName: this.inputLastName.node.value,
          },
          phone: this.inputPhone.node.value,
          about: this.inputAbout.node.value,
          eyeColor: this.inputEyeColor.node.value,
        },
        this.peopleItem.id
      );
      this.destroy();
    }
  }

  checkValidity(input: HTMLInputElement, error: Component) { // метод для проверки инпута
    if (!input.validity.valid || !input.value.length) { // если инпут не валиден или имеет пустое значение
      error.setClass('form__error-msg_active'); // то отображаем сообщение об ошибке
      this.submitBtn.setAttribute('disabled', 'true'); // запрещаем отправку формы
      return false; // возвращаем значение, указывающее, что инпут не валиден
    } else {
      error.removeClass('form__error-msg_active'); // если инпут валиден, то скрываем сообщение об ошибке и даем возможность сабмитнуть форму
      this.submitBtn.removeAttribute('disabled');
      return true;
    }
  }
}
