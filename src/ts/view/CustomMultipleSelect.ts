import Component from '../common/component';
import { SortNameType } from '../types/SortNameType';

export default class CustomMultipleSelect extends Component {
  isOptionsOpen: boolean; // флаг, показывающий, открыт ли выпадающий лист или нет
  checkedIndexes: number[]; // массив, содержащий индексы выбранных опций
  placeholderContainer: Component; // контейнер, содержащий текст Hide column и иконку
  optionsList: Component;
  placeholder: Component;
  placeholderIcon: Component;
  constructor(
    parentNode: HTMLElement,
    tagName: keyof HTMLElementTagNameMap,
    className = '',
    content = '',
    options: SortNameType[], // массив, содержащий названия колонок. Названия будут прописаны в качестве названий опций
    onSelect: (i: number) => void, // коллбэк, в который передается индекс выбранной опции, дальше коллбэк скрывает столбец с соответствующим индексом
    checkedIndexes: number[] // массив индексов уже скрытых столбцов, получаемый из local storage
  ) {
    super(parentNode, tagName, className, content);
    this.setAttribute('role', 'select'); // прописываем для элемента aria-роль select, для улучшения доступности
    this.isOptionsOpen = false; // изначально выпадающий лист скрыт
    this.checkedIndexes = checkedIndexes.slice(); // инициализируем индексы чекнутых опций с помощью массива индексов скрытых столбцов. С помощью slice создаем новый массив, чтобы две переменных не ссылались на один и тот же массив
    this.placeholderContainer = new Component( // создаем кнопку, по клике на которую будет раскрываться или закрываться выпадающий лист
      this.node,
      'div',
      'select-placeholder',
      ''
    ).setListener('click', () => {
      if (this.isOptionsOpen) { // если лист уже открыт и по кнопке кликнули, то уничтожаем лист
        this.optionsList.destroy();
        this.isOptionsOpen = false;
      } else {
        this.isOptionsOpen = true;
        this.optionsList = new Component(this.node, 'ul', 'select-options-list', ''); // создается выпадающий лист
        options.forEach((content, i) => { // options содержит названия опций
          const option = new Component(
            this.optionsList.node,
            'li',
            'select-options-list__option',
            content
          )
            .setListener('click', () => { // если по опции кликнули, то передаем индекс опции в коллбэк
              onSelect(i);
              if (checkbox.hasClass('select-options-list__option-checkbox_selected')) { // если опция уже была выбрана, то фильтруем массив чекнутых опций, удаляя оттуда индекс этой опции, удаляем класс активного чекбокса у чекбокса
                this.checkedIndexes = this.checkedIndexes.filter((value) => value !== i);
                checkbox.removeClass('select-options-list__option-checkbox_selected');
                checkbox.setAttribute('aria-checked', 'false'); // прописываем aria-атрибуты для повышения доступности. Так как снимаем галочку с чекбокса, то прописываем значение false
                option.setAttribute('aria-selected', 'false');
              } else { // иначе если кликаем по опции впервые, то заносим индекс опции в массив, устанавливаем соответствующие классы и атрибуты
                this.checkedIndexes.push(i);
                checkbox.setClass('select-options-list__option-checkbox_selected');
                checkbox.setAttribute('aria-checked', 'true');
                option.setAttribute('aria-selected', 'true');
              }
            })
            .setAttribute('role', 'option'); // установка aria-роли для опции
          const checkbox = new Component(
            option.node,
            'span',
            'select-options-list__option-checkbox',
            ''
          ).setAttribute('role', 'checkbox'); // создается иконка чекбокса и указывается aria-роль
          if (this.checkedIndexes.find((value) => value === i) !== undefined) { // если в массиве чекнутых опций уже содержится текущий индекс, то устанавливаем класс, который отображает, что чекбокс активен
            checkbox.setClass('select-options-list__option-checkbox_selected');
          }
        });
      }
    });
    this.placeholder = new Component(
      this.placeholderContainer.node,
      'div',
      'select-placeholder__text',
      'Hide column'
    )
      .setAttribute('aria-label', 'Open select')
      .setAttribute('title', 'Open select'); // создаем текст кнопки и устанавливаем aria-атрибут и title
    this.placeholderIcon = new Component(
      this.placeholderContainer.node,
      'span',
      'select-placeholder__icon',
      ''
    );
  }
}
